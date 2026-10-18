
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Ventas.php';

try {
    if (
        !isset($_SESSION['usuario_email']) ||
        empty($_SESSION['usuario_email'])
    ) {
        http_response_code(401);

        echo json_encode([
            "error" => "La sesión no está iniciada."
        ]);

        exit;
    }

    $usuario = $_SESSION['usuario_email'];

    $modelo = new VentasModel();

    $productos = $modelo->obtenerProductosVendidos($usuario);

    echo json_encode(
        $productos,
        JSON_UNESCAPED_UNICODE
    );

} catch (Throwable $e) {
    http_response_code(500);

    echo json_encode([
        "error" => "No se pudieron cargar los productos vendidos."
    ]);
}
