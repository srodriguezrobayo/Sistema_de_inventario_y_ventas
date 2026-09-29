<?php
declare(strict_types=1);

namespace App\Models;

use mysqli;

final class Dashboard
{
    public function __construct(private readonly mysqli $database)
    {
    }

    public function summary(int $userId): array
    {
        $products = $this->database->prepare(
            'SELECT COUNT(*) AS product_count, '
            . 'COALESCE(SUM(CASE WHEN Cantidad_Producto <= Cantidad_minima THEN 1 ELSE 0 END), 0) AS low_stock_count '
            . 'FROM Productos WHERE Usuario_id_usuario = ? AND Estado_producto = 1'
        );
        $products->bind_param('i', $userId);
        $products->execute();
        $productSummary = $products->get_result()->fetch_assoc();

        $sales = $this->database->prepare(
            'SELECT COUNT(*) AS sales_count, COALESCE(SUM(Total_pagar_venta), 0) AS sales_total '
            . 'FROM Ventas WHERE Usuario_id_usuario = ? AND Estado_venta = 1 '
            . 'AND YEAR(Fecha_hora_venta) = YEAR(CURRENT_DATE) AND MONTH(Fecha_hora_venta) = MONTH(CURRENT_DATE)'
        );
        $sales->bind_param('i', $userId);
        $sales->execute();
        $salesSummary = $sales->get_result()->fetch_assoc();

        $topProducts = $this->database->prepare(
            'SELECT p.Nombre_producto AS name, SUM(d.Cantidad) AS quantity_sold '
            . 'FROM Detalle_venta d INNER JOIN Ventas v ON v.Id_ventas = d.Venta_id_venta '
            . 'INNER JOIN Productos p ON p.Id_productos = d.Producto_id_producto '
            . 'WHERE v.Usuario_id_usuario = ? AND v.Estado_venta = 1 '
            . 'AND YEAR(v.Fecha_hora_venta) = YEAR(CURRENT_DATE) AND MONTH(v.Fecha_hora_venta) = MONTH(CURRENT_DATE) '
            . 'GROUP BY p.Id_productos, p.Nombre_producto ORDER BY quantity_sold DESC LIMIT 5'
        );
        $topProducts->bind_param('i', $userId);
        $topProducts->execute();
        $topProductRows = $topProducts->get_result()->fetch_all(MYSQLI_ASSOC);

        $expiring = $this->database->prepare(
            'SELECT p.Nombre_producto AS name, l.Lote_producto AS lot, l.Fecha_vencimiento AS expires_on '
            . 'FROM Log_producto l INNER JOIN Productos p ON p.Id_productos = l.Producto_id_producto '
            . 'WHERE p.Usuario_id_usuario = ? AND p.Estado_producto = 1 AND l.Estado_log_producto = 1 '
            . 'AND l.Fecha_vencimiento BETWEEN CURRENT_DATE AND DATE_ADD(CURRENT_DATE, INTERVAL 90 DAY) '
            . 'ORDER BY l.Fecha_vencimiento LIMIT 100'
        );
        $expiring->bind_param('i', $userId);
        $expiring->execute();
        $expiringRows = $expiring->get_result()->fetch_all(MYSQLI_ASSOC);

        return [
            'product_count' => (int) $productSummary['product_count'],
            'low_stock_count' => (int) $productSummary['low_stock_count'],
            'sales_count' => (int) $salesSummary['sales_count'],
            'sales_total' => (float) $salesSummary['sales_total'],
            'top_products' => $topProductRows,
            'expiring' => $expiringRows,
        ];
    }
}