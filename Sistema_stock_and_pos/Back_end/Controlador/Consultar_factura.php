<?php

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function responderFactura(int $codigo, array $respuesta): void
{
    http_response_code($codigo);
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}

if (
    empty($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    responderFactura(401, [
        'resultado' => 0,
        'mensaje' => 'Tu sesión expiró. Inicia sesión nuevamente.'
    ]);
}

$id = filter_input(INPUT_GET, 'id', FILTER_VALIDATE_INT);
if (!$id || $id < 1) {
    responderFactura(400, [
        'resultado' => 0,
        'mensaje' => 'El número de factura no es válido.'
    ]);
}

require_once __DIR__ . '/../Modelo/conexion.php';

try {
    $stmt = $con->prepare(
        'SELECT v.Id_ventas, v.Fecha_hora_venta, v.Descripcion_VENTA,
                v.Total_pagar_venta, v.Accion_venta, v.Estado_envio_venta,
                v.Correo_envio_venta, u.Nombre_usuario
         FROM Ventas v
         INNER JOIN Usuarios u ON u.Id_usuario = v.Usuario_id_usuario
         WHERE v.Id_ventas = ?
           AND u.Email_usuario = ?
           AND u.Estado_usuario = 1
           AND v.Estado_venta = 1
         LIMIT 1'
    );
    $stmt->bind_param('is', $id, $_SESSION['usuario_email']);
    $stmt->execute();
    $venta = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$venta) {
        responderFactura(404, [
            'resultado' => 0,
            'mensaje' => 'La factura no existe o no tienes permiso para verla.'
        ]);
    }

    $detalle = json_decode($venta['Descripcion_VENTA'], true);
    if (!is_array($detalle)) {
        $detalle = [];
    }

    echo json_encode([
        'resultado' => 1,
        'factura' => [
            'id' => (int) $venta['Id_ventas'],
            'numero' => $detalle['factura'] ?? 'SAP-' . $venta['Id_ventas'],
            'cajero' => $detalle['cajero'] ?? $venta['Nombre_usuario'],
            'fecha' => $venta['Fecha_hora_venta'],
            'accion' => $venta['Accion_venta'],
            'total' => (float) $venta['Total_pagar_venta'],
            'correo' => $venta['Correo_envio_venta'],
            'enviada' => (bool) $venta['Estado_envio_venta'],
            'items' => is_array($detalle['items'] ?? null)
                ? $detalle['items']
                : []
        ]
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('Error al consultar factura ' . $id . ': ' . $e->getMessage());
    responderFactura(500, [
        'resultado' => 0,
        'mensaje' => 'No se pudo cargar la factura.'
    ]);
}
?>