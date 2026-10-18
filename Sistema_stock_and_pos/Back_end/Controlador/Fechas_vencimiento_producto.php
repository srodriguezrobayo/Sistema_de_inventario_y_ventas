
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

try {
    $correo = $_SESSION['usuario_email'] ?? null;

    if (empty($correo)) {
        http_response_code(401);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'No se encontró el correo en la sesión.'
        ]);

        exit;
    }

    $modelo = new ProductoModel();
    $productos = $modelo->obtenerFechasVencimiento($correo);

    $eventos = [];

    $hoy = new DateTimeImmutable('today');

    foreach ($productos as $producto) {
        if (empty($producto['Fecha_vencimiento'])) {
            continue;
        }

        $fecha = $producto['Fecha_vencimiento'];

        // Validar que la fecha sea válida
        $fechaObjeto = DateTimeImmutable::createFromFormat(
            '!Y-m-d',
            $fecha
        );

        if (!$fechaObjeto || $fechaObjeto->format('Y-m-d') !== $fecha) {
            continue;
        }

        $nombre = $producto['Nombre_producto'] ?? 'Producto';
        $lote = $producto['Lote_producto'] ?? 'Sin lote';

        if ($fechaObjeto < $hoy) {
            // Producto vencido
            $color = '#dc3545';
        } elseif ($fechaObjeto <= $hoy->modify('+30 days')) {
            // Vence en los próximos 30 días
            $color = '#ffc107';
        } else {
            // Vencimiento futuro
            $color = '#28a745';
        }

        $eventos[] = [
            'title' => $nombre . ' - Lote: ' . $lote,
            'start' => $fecha,
            'allDay' => true,
            'backgroundColor' => $color,
            'borderColor' => $color,
            'textColor' => $color === '#ffc107' ? '#000000' : '#ffffff',
            'description' => 'Vencimiento: ' . $fecha
        ];
    }

    echo json_encode([
        'resultado' => 1,
        'events' => $eventos
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log(
        'Error al consultar fechas de vencimiento: ' . $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No se pudieron consultar los vencimientos.'
    ]);
}
