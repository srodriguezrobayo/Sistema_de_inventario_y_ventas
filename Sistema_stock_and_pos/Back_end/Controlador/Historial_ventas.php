<?php

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function responderHistorial(int $codigo, array $respuesta): void
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
    responderHistorial(401, [
        'resultado' => 0,
        'mensaje' => 'Tu sesión expiró. Inicia sesión nuevamente.'
    ]);
}

require_once __DIR__ . '/../Modelo/conexion.php';

try {
    $stmt = $con->prepare(
        'SELECT Id_usuario
         FROM Usuarios
         WHERE Email_usuario = ? AND Estado_usuario = 1
         LIMIT 1'
    );
    $stmt->bind_param('s', $_SESSION['usuario_email']);
    $stmt->execute();
    $usuario = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    if (!$usuario) {
        responderHistorial(401, [
            'resultado' => 0,
            'mensaje' => 'No se encontró un usuario activo para esta sesión.'
        ]);
    }

    $stmt = $con->prepare(
        'SELECT Id_ventas, Fecha_hora_venta, Descripcion_VENTA,
                Total_pagar_venta, Accion_venta, Estado_envio_venta
         FROM Ventas
         WHERE Usuario_id_usuario = ? AND Estado_venta = 1
         ORDER BY Fecha_hora_venta DESC, Id_ventas DESC'
    );
    $usuarioId = (int) $usuario['Id_usuario'];
    $stmt->bind_param('i', $usuarioId);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $ventas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $id = (int) $fila['Id_ventas'];
        $detalle = json_decode($fila['Descripcion_VENTA'], true);

        $ventas[] = [
            'id' => $id,
            'factura' => is_array($detalle) && !empty($detalle['factura'])
                ? $detalle['factura']
                : 'SAP-' . $id,
            'accion' => $fila['Accion_venta'],
            'fecha' => $fila['Fecha_hora_venta'],
            'total' => (float) $fila['Total_pagar_venta'],
            'enviada' => (bool) $fila['Estado_envio_venta']
        ];
    }

    $resultado->free();
    $stmt->close();

    echo json_encode([
        'resultado' => 1,
        'ventas' => $ventas
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('Error al consultar historial de ventas: ' . $e->getMessage());
    responderHistorial(500, [
        'resultado' => 0,
        'mensaje' => 'No se pudo cargar el historial de ventas.'
    ]);
}
?>