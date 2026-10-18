
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

try {

    // Obtener el correo con el nombre correcto de la sesión
    $correo = $_SESSION['usuario_email'] ?? null;

    if (empty($correo)) {
        http_response_code(401);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'No se encontró el correo en la sesión.'
        ]);

        exit;
    }

    // Consultar el conteo mediante el modelo
    $modelo = new ProductoModel();

    $total = $modelo->contarProductosBajoStock($correo);

    echo json_encode([
        'resultado' => 1,
        'Productos_bajo_stock' => $total
    ]);

} catch (Throwable $e) {

    error_log(
        'Error al consultar productos con stock bajo: ' .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Error al consultar los productos.'
    ]);
}
