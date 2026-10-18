
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

try {
    $modelo = new ProductoModel();

    /* =====================================================
       CONSULTAR DATOS DE VENCIMIENTO (GET)
       ===================================================== */

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
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

        $producto = $modelo->consultarDatosVencimiento(
            $idProducto
        );

        if (!$producto) {
            http_response_code(404);

            echo json_encode([
                'resultado' => 0,
                'mensaje' => 'El producto no existe o está inactivo.'
            ], JSON_UNESCAPED_UNICODE);

            exit;
        }

        echo json_encode([
            'resultado' => 1,
            'tiene_fv' => (int) $producto['Tiene_FV'],
            'conoce_fv' => (int) $producto['Conoce_FV']
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    /* =====================================================
       GUARDAR ACTUALIZACIÓN DE CANTIDAD (POST)
       ===================================================== */

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

    $fechaLlegada = trim(
        (string) ($_POST['FechaRecibimiento'] ?? '')
    );

    $cantidadNueva = filter_input(
        INPUT_POST,
        'Cantidadprod',
        FILTER_VALIDATE_INT
    );

    $lote = trim(
        (string) ($_POST['Lote'] ?? '')
    );

    $fechaVencimiento = trim(
        (string) ($_POST['FechaVencimiento'] ?? '')
    );

    /* Validar ID del producto. */
    if (!$idProducto || $idProducto <= 0) {
        http_response_code(400);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'El ID del producto no es válido.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    /* Validar cantidad. */
    if (
        $cantidadNueva === false ||
        $cantidadNueva === null ||
        $cantidadNueva <= 0
    ) {
        http_response_code(400);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'La cantidad debe ser un entero mayor que cero.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    /* Validar fecha de llegada. */
    $fecha = DateTime::createFromFormat(
        '!Y-m-d',
        $fechaLlegada
    );

    if (
        !$fecha ||
        $fecha->format('Y-m-d') !== $fechaLlegada
    ) {
        http_response_code(400);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'La fecha de llegada no es válida.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    /* Ejecutar actualización. */
    $respuesta = $modelo->actualizarCantidadProducto(
        $idProducto,
        $fechaLlegada,
        $cantidadNueva,
        $lote !== '' ? $lote : null,
        $fechaVencimiento !== '' ? $fechaVencimiento : null
    );

    echo json_encode(
        $respuesta,
        JSON_UNESCAPED_UNICODE
    );

} catch (Throwable $e) {
    error_log(
        'Error en Actualizar_cantidad_producto.php: ' .
        $e->getMessage()
    );

    $mensaje = $e->getMessage();

    if (
        strpos($mensaje, 'no existe') !== false ||
        strpos($mensaje, 'está inactivo') !== false
    ) {
        http_response_code(404);
    } elseif (
        strpos($mensaje, 'Debes ingresar') !== false ||
        strpos($mensaje, 'fecha de vencimiento') !== false ||
        strpos($mensaje, 'cantidad debe ser') !== false
    ) {
        http_response_code(400);
    } else {
        http_response_code(500);

        $mensaje =
            'No se pudo actualizar la cantidad del producto.';
    }

    echo json_encode([
        'resultado' => 0,
        'mensaje' => $mensaje
    ], JSON_UNESCAPED_UNICODE);
}
?>
