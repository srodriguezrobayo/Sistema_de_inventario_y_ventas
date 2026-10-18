
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Ventas.php';

try {
    // Usar el nombre real de la sesión de tu proyecto
    $correo = $_SESSION['usuario_email'] ?? null;

    if (empty($correo)) {
        http_response_code(401);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'No se encontró el correo en la sesión.'
        ]);

        exit;
    }

    $modelo = new VentasModel();

    $total = $modelo->obtenerTotalNetoHoy($correo);

    echo json_encode([
        'resultado' => 1,
        'Total_neto' => $total
    ]);

} catch (Throwable $e) {
    error_log(
        'Error al consultar suma de ventas de hoy: ' .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No se pudo consultar el total de ventas de hoy.'
    ]);
}
