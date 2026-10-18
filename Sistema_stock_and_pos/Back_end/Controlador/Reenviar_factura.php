<?php

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function responderReenvio(int $codigo, array $respuesta): void
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
    responderReenvio(401, [
        'resultado' => 0,
        'mensaje' => 'Tu sesión expiró. Inicia sesión nuevamente.'
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderReenvio(405, [
        'resultado' => 0,
        'mensaje' => 'Método no permitido.'
    ]);
}

$entrada = json_decode(file_get_contents('php://input'), true);
$id = filter_var($entrada['id'] ?? null, FILTER_VALIDATE_INT);
$correo = trim((string) ($entrada['correo'] ?? ''));

if (!$id || $id < 1 || !filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responderReenvio(400, [
        'resultado' => 0,
        'mensaje' => 'El número de factura o el correo no son válidos.'
    ]);
}

require_once __DIR__ . '/../Modelo/conexion.php';

try {
    $stmt = $con->prepare(
        'SELECT v.Id_ventas, v.Fecha_hora_venta, v.Descripcion_VENTA,
                v.Total_pagar_venta, v.Accion_venta, u.Nombre_usuario
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
        responderReenvio(404, [
            'resultado' => 0,
            'mensaje' => 'La factura no existe o no tienes permiso para enviarla.'
        ]);
    }

    $detalle = json_decode($venta['Descripcion_VENTA'], true);
    if (!is_array($detalle) || !is_array($detalle['items'] ?? null)) {
        responderReenvio(422, [
            'resultado' => 0,
            'mensaje' => 'La factura no contiene un detalle que se pueda enviar.'
        ]);
    }

    $operacion = [
        'tipo' => $venta['Accion_venta'],
        'factura' => $detalle['factura'] ?? 'SAP-' . $venta['Id_ventas'],
        'fecha' => $venta['Fecha_hora_venta'],
        'cajero' => $detalle['cajero'] ?? $venta['Nombre_usuario'],
        'total' => (float) $venta['Total_pagar_venta'],
        'items' => $detalle['items']
    ];

    require_once __DIR__ . '/../Modelo/EmailComprobante.php';
    enviarComprobanteVenta($correo, $operacion);

    $stmt = $con->prepare(
        'UPDATE Ventas
         SET Estado_envio_venta = 1, Correo_envio_venta = ?
         WHERE Id_ventas = ?'
    );
    $stmt->bind_param('si', $correo, $id);
    $stmt->execute();
    $stmt->close();

    echo json_encode([
        'resultado' => 1,
        'mensaje' => 'El comprobante fue enviado correctamente.'
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('Error al reenviar factura ' . $id . ': ' . $e->getMessage());
    responderReenvio(502, [
        'resultado' => 0,
        'mensaje' => 'No se pudo enviar el comprobante.'
    ]);
}
?>