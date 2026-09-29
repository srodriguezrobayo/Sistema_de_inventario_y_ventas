<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

final class Product
{
    public function __construct(private readonly mysqli $database)
    {
    }

    public function listForUser(int $userId): array
    {
        $statement = $this->database->prepare(
            'SELECT Id_productos AS id, Nombre_producto AS name, Codigo_producto AS code, '
            . 'Valor_unitario_producto AS price, Cantidad_Producto AS quantity, '
            . 'Unidad_medida_producto AS unit, Tiene_FV AS has_expiry, Conoce_FV AS knows_expiry, '
            . 'Fecha_vencimiento AS expires_on, Cantidad_minima AS minimum_stock, Foto_producto AS photo '
            . 'FROM Productos WHERE Usuario_id_usuario = ? AND Estado_producto = 1 ORDER BY Nombre_producto'
        );
        $statement->bind_param('i', $userId);
        $statement->execute();

        return $statement->get_result()->fetch_all(MYSQLI_ASSOC);
    }

    public function findForUser(int $productId, int $userId): ?array
    {
        $statement = $this->database->prepare(
            'SELECT Id_productos AS id, Nombre_producto AS name, Codigo_producto AS code, '
            . 'Valor_unitario_producto AS price, Cantidad_Producto AS quantity, '
            . 'Unidad_medida_producto AS unit, Tiene_FV AS has_expiry, Conoce_FV AS knows_expiry, '
            . 'Fecha_vencimiento AS expires_on, Cantidad_minima AS minimum_stock, Foto_producto AS photo '
            . 'FROM Productos WHERE Id_productos = ? AND Usuario_id_usuario = ? AND Estado_producto = 1 LIMIT 1'
        );
        $statement->bind_param('ii', $productId, $userId);
        $statement->execute();
        $product = $statement->get_result()->fetch_assoc();

        if (!$product) {
            return null;
        }

        $batches = $this->database->prepare(
            'SELECT Fecha_llegada_producto AS arrived_on, Cantidad_llegada_producto AS quantity, '
            . 'Lote_producto AS lot, Fecha_vencimiento AS expires_on '
            . 'FROM Log_producto WHERE Producto_id_producto = ? AND Estado_log_producto = 1 '
            . 'ORDER BY Fecha_vencimiento, Fecha_llegada_producto'
        );
        $batches->bind_param('i', $productId);
        $batches->execute();
        $product['batches'] = $batches->get_result()->fetch_all(MYSQLI_ASSOC);

        return $product;
    }

    public function codeExists(string $code, int $userId, ?int $exceptId = null): bool
    {
        if ($exceptId === null) {
            $statement = $this->database->prepare(
                'SELECT Id_productos FROM Productos WHERE Codigo_producto = ? AND Usuario_id_usuario = ? LIMIT 1'
            );
            $statement->bind_param('si', $code, $userId);
        } else {
            $statement = $this->database->prepare(
                'SELECT Id_productos FROM Productos WHERE Codigo_producto = ? AND Usuario_id_usuario = ? AND Id_productos <> ? LIMIT 1'
            );
            $statement->bind_param('sii', $code, $userId, $exceptId);
        }
        $statement->execute();

        return $statement->get_result()->fetch_assoc() !== null;
    }

    public function create(array $product, int $userId, ?string $photo): int
    {
        $this->database->begin_transaction();

        try {
            $statement = $this->database->prepare(
                'INSERT INTO Productos (Nombre_producto, Codigo_producto, Valor_unitario_producto, '
                . 'Cantidad_Producto, Unidad_medida_producto, Tiene_FV, Conoce_FV, Fecha_vencimiento, '
                . 'Cantidad_minima, Foto_producto, Estado_producto, Usuario_id_usuario) '
                . 'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)'
            );
            $statement->bind_param(
                'ssdisiisssi',
                $product['name'],
                $product['code'],
                $product['price'],
                $product['quantity'],
                $product['unit'],
                $product['has_expiry'],
                $product['knows_expiry'],
                $product['expires_on'],
                $product['minimum_stock'],
                $photo,
                $userId
            );
            $statement->execute();
            $productId = (int) $this->database->insert_id;

            if ($product['quantity'] > 0) {
                $this->insertBatch($productId, date('Y-m-d'), $product['quantity'], null, $product['expires_on']);
            }

            $this->database->commit();
            return $productId;
        } catch (\Throwable $exception) {
            $this->database->rollback();
            throw $exception;
        }
    }

    public function update(int $productId, array $product, int $userId, ?string $photo): bool
    {
        $statement = $this->database->prepare(
            'UPDATE Productos SET Nombre_producto = ?, Codigo_producto = ?, Valor_unitario_producto = ?, '
            . 'Unidad_medida_producto = ?, Tiene_FV = ?, Conoce_FV = ?, Fecha_vencimiento = ?, '
            . 'Cantidad_minima = ?, Foto_producto = COALESCE(?, Foto_producto) '
            . 'WHERE Id_productos = ? AND Usuario_id_usuario = ? AND Estado_producto = 1'
        );
        $statement->bind_param(
            'ssdsiisisii',
            $product['name'],
            $product['code'],
            $product['price'],
            $product['unit'],
            $product['has_expiry'],
            $product['knows_expiry'],
            $product['expires_on'],
            $product['minimum_stock'],
            $photo,
            $productId,
            $userId
        );
        $statement->execute();

        return $this->findForUser($productId, $userId) !== null;
    }

    public function receive(int $productId, array $receipt, int $userId): bool
    {
        $this->database->begin_transaction();

        try {
            $find = $this->database->prepare(
                'SELECT Tiene_FV FROM Productos WHERE Id_productos = ? AND Usuario_id_usuario = ? AND Estado_producto = 1 FOR UPDATE'
            );
            $find->bind_param('ii', $productId, $userId);
            $find->execute();
            $product = $find->get_result()->fetch_assoc();

            if (!$product) {
                $this->database->rollback();
                return false;
            }

            $update = $this->database->prepare(
                'UPDATE Productos SET Cantidad_Producto = Cantidad_Producto + ?, '
                . 'Fecha_vencimiento = COALESCE(?, Fecha_vencimiento) '
                . 'WHERE Id_productos = ? AND Usuario_id_usuario = ?'
            );
            $update->bind_param('isii', $receipt['quantity'], $receipt['expires_on'], $productId, $userId);
            $update->execute();

            $this->insertBatch(
                $productId,
                $receipt['arrived_on'],
                $receipt['quantity'],
                $receipt['lot'],
                $receipt['expires_on']
            );

            $this->database->commit();
            return true;
        } catch (\Throwable $exception) {
            $this->database->rollback();
            throw $exception;
        }
    }

    public function deactivate(int $productId, int $userId): bool
    {
        $statement = $this->database->prepare(
            'UPDATE Productos SET Estado_producto = 0 WHERE Id_productos = ? AND Usuario_id_usuario = ? AND Estado_producto = 1'
        );
        $statement->bind_param('ii', $productId, $userId);
        $statement->execute();

        return $statement->affected_rows === 1;
    }

    private function insertBatch(int $productId, string $date, int $quantity, ?string $lot, ?string $expiresOn): void
    {
        $statement = $this->database->prepare(
            'INSERT INTO Log_producto (Fecha_llegada_producto, Cantidad_llegada_producto, Lote_producto, '
            . 'Fecha_vencimiento, Producto_id_producto, Estado_log_producto) VALUES (?, ?, ?, ?, ?, 1)'
        );
        $statement->bind_param('sissi', $date, $quantity, $lot, $expiresOn, $productId);
        $statement->execute();
    }
}