
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        http_response_code(405);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'Método no permitido.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $idProducto = filter_input(
        INPUT_POST,
        'id_producto',
        FILTER_VALIDATE_INT
    );

    if (!$idProducto || $idProducto <= 0) {
        http_response_code(400);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'El ID del producto no es válido.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $modelo = new ProductoModel();

    $actualizado = $modelo->dejarDeVender($idProducto);

    if (!$actualizado) {
        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'El producto no existe o ya está inactivo.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    echo json_encode([
        'resultado' => 1,
        'mensaje' => 'El producto se ha quitado de tu inventario.',
        'id_producto' => $idProducto,
        'estado' => 0
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log('Error al desactivar producto: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Ocurrió un error al cambiar el estado del producto.'
    ], JSON_UNESCAPED_UNICODE);
}