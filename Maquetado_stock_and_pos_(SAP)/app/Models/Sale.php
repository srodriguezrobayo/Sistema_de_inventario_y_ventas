<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;
use RuntimeException;

final class Sale
{
    public function __construct(private readonly mysqli $database)
    {
    }

    public function listForUser(int $userId): array
    {
        $statement = $this->database->prepare(
            'SELECT v.Id_ventas AS id, v.Fecha_hora_venta AS sold_at, v.Total_pagar_venta AS total, '
            . 'v.Estado_envio_venta AS invoice_sent, v.Correo_envio_venta AS invoice_email, '
            . 'COUNT(d.Id_detalle_venta) AS item_count '
            . 'FROM Ventas v LEFT JOIN Detalle_venta d ON d.Venta_id_venta = v.Id_ventas '
            . 'WHERE v.Usuario_id_usuario = ? AND v.Estado_venta = 1 '
            . 'GROUP BY v.Id_ventas ORDER BY v.Fecha_hora_venta DESC'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();

        return $statement->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function findForUser(int $saleId, int $userId): ?array
    {
        $statement = $this->database->prepare(
            'SELECT Id_ventas AS id, Fecha_hora_venta AS sold_at, Total_pagar_venta AS total, '
            . 'Estado_envio_venta AS invoice_sent, Correo_envio_venta AS invoice_email '
            . 'FROM Ventas WHERE Id_ventas = ? AND Usuario_id_usuario = ? AND Estado_venta = 1 LIMIT 1'
        );
        $statement->bind_param('ii', $saleId, $userId);
        $statement->execute();
        $sale = $statement->get_result()->fetch_assoc();

        if (!$sale) {
            return null;
        }

        $details = $this->database->prepare(
            'SELECT d.Producto_id_producto AS product_id, p.Nombre_producto AS name, '
            . 'd.Cantidad AS quantity, d.Precio_unitario AS unit_price, d.Subtotal AS subtotal '
            . 'FROM Detalle_venta d INNER JOIN Productos p ON p.Id_productos = d.Producto_id_producto '
            . 'WHERE d.Venta_id_venta = ? ORDER BY d.Id_detalle_venta'
        );
        $details->bind_param('i', $saleId);
        $details->execute();
        $sale['items'] = $details->get_result()->fetch_all(MYSQLI_ASSOC);

        return $sale;
    }

    public function create(int $userId, array $requestedItems): int
    {
        ksort($requestedItems);
        $this->database->begin_transaction();

        try {
            $items = [];
            $total = 0.0;
            $findProduct = $this->database->prepare(
                'SELECT Nombre_producto, Valor_unitario_producto, Cantidad_Producto '
                . 'FROM Productos WHERE Id_productos = ? AND Usuario_id_usuario = ? '
                . 'AND Estado_producto = 1 FOR UPDATE'
            );

            foreach ($requestedItems as $productId => $quantity) {
                $findProduct->bind_param('ii', $productId, $userId);
                $findProduct->execute();
                $product = $findProduct->get_result()->fetch_assoc();
                if (!$product || (int) $product['Cantidad_Producto'] < $quantity) {
                    throw new RuntimeException('insufficient_stock');
                }

                $unitPrice = (float) $product['Valor_unitario_producto'];
                $subtotal = round($unitPrice * $quantity, 2);
                $total += $subtotal;
                $items[] = [
                    'id' => (int) $productId,
                    'name' => $product['Nombre_producto'],
                    'quantity' => $quantity,
                    'unit_price' => $unitPrice,
                    'subtotal' => $subtotal,
                ];
            }

            $description = json_encode($items, JSON_UNESCAPED_UNICODE | JSON_THROW_ON_ERROR);
            $date = date('Y-m-d H:i:s');
            $statement = $this->database->prepare(
                'INSERT INTO Ventas (Fecha_hora_venta, Descripcion_VENTA, Total_pagar_venta, '
                . 'Estado_envio_venta, Estado_venta, Usuario_id_usuario) VALUES (?, ?, ?, 0, 1, ?)'
            );
            $statement->bind_param('ssdi', $date, $description, $total, $userId);
            $statement->execute();
            $saleId = (int) $this->database->insert_id;

            $insertDetail = $this->database->prepare(
                'INSERT INTO Detalle_venta (Venta_id_venta, Producto_id_producto, Cantidad, Precio_unitario, Subtotal) '
                . 'VALUES (?, ?, ?, ?, ?)'
            );
            $decreaseStock = $this->database->prepare(
                'UPDATE Productos SET Cantidad_Producto = Cantidad_Producto - ? '
                . 'WHERE Id_productos = ? AND Usuario_id_usuario = ? AND Cantidad_Producto >= ?'
            );

            foreach ($items as $item) {
                $productId = $item['id'];
                $quantity = $item['quantity'];
                $unitPrice = $item['unit_price'];
                $subtotal = $item['subtotal'];
                $insertDetail->bind_param('iiidd', $saleId, $productId, $quantity, $unitPrice, $subtotal);
                $insertDetail->execute();

                $decreaseStock->bind_param('iiii', $quantity, $productId, $userId, $quantity);
                $decreaseStock->execute();
                if ($decreaseStock->affected_rows !== 1) {
                    throw new RuntimeException('insufficient_stock');
                }
            }

            $this->database->commit();
            return $saleId;
        } catch (\Throwable $exception) {
            $this->database->rollback();
            throw $exception;
        }
    }

    public function markInvoiceSent(int $saleId, int $userId, string $email): bool
    {
        $statement = $this->database->prepare(
            'UPDATE Ventas SET Estado_envio_venta = 1, Correo_envio_venta = ? '
            . 'WHERE Id_ventas = ? AND Usuario_id_usuario = ? AND Estado_venta = 1'
        );
        $statement->bind_param('sii', $email, $saleId, $userId);
        $statement->execute();

        return $statement->affected_rows === 1;
    }
}