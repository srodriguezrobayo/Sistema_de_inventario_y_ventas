<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
        http_response_code(405);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'Método no permitido.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $idProducto = filter_input(
        INPUT_GET,
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

    // Consultar información general.
    $producto = $modelo->obtenerDetalleVista($idProducto);

    if (!$producto) {
        http_response_code(404);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'No se encontró el producto.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    $tieneFV = (int) $producto['Tiene_FV'];
    $conoceFV = (int) $producto['Conoce_FV'];

    // Solo mostrar lotes y calendario si ambas validaciones son 1.
    $mostrarVencimientos = (
        $tieneFV === 1 && $conoceFV === 1
    );

    $lotes = [];

    if ($mostrarVencimientos) {
        $lotes = $modelo->obtenerLotesVista($idProducto);
    }

    echo json_encode([
        'resultado' => 1,
        'producto' => $producto,
        'mostrar_vencimientos' => $mostrarVencimientos,
        'lotes' => $lotes
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log(
        'Error al consultar detalle del producto: ' . $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No se pudo consultar la información del producto.'
    ], JSON_UNESCAPED_UNICODE);
}