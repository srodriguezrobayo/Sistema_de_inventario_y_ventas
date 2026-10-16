
<?php

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Unidad_medida.php';

try {
    $modelo = new Unidad_medidaModel();
    $unidades = $modelo->ConsultarUnidades();

    echo json_encode([
        'resultado' => 1,
        'unidades' => $unidades
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log('Error en Consultar_unidades.php: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Error al consultar las unidades de medida.'
    ], JSON_UNESCAPED_UNICODE);
}
?>