<?php

session_start();
header('Content-Type: application/json; charset=utf-8');

if (
    empty($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    http_response_code(401);
    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'La sesión no está autenticada o ha expirado.'
    ], JSON_UNESCAPED_UNICODE);
    exit;
}

require_once __DIR__ . '/../Modelo/conexion.php';

try {
    $sql = "SELECT
                Id_productos,
                Nombre_producto,
                Codigo_producto,
                Valor_unitario_producto,
                Cantidad_Producto,
                Unidad_medida_producto
            FROM Productos
            WHERE Usuario_id_usuario = (
                SELECT Id_usuario
                FROM Usuarios
                WHERE Email_usuario = ? AND Estado_usuario = 1
                LIMIT 1
            )
              AND Estado_producto = 1
            ORDER BY Nombre_producto ASC";

    $stmt = $con->prepare($sql);
    $stmt->bind_param('s', $_SESSION['usuario_email']);
    $stmt->execute();
    $resultado = $stmt->get_result();
    $productos = $resultado->fetch_all(MYSQLI_ASSOC);
    $resultado->free();
    $stmt->close();

    echo json_encode([
        'resultado' => 1,
        'productos' => $productos,
        'usuario' => $_SESSION['usuario_nombre'] ?? ''
    ], JSON_UNESCAPED_UNICODE);
} catch (Throwable $e) {
    error_log('Error al consultar productos para venta: ' . $e->getMessage());
    http_response_code(500);
    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No fue posible cargar los productos del inventario.'
    ], JSON_UNESCAPED_UNICODE);
}
?>