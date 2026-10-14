
<?php
session_start();

header('Content-Type: application/json; charset=utf-8');

if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    http_response_code(401);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'La sesión ha expirado.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

require_once __DIR__ . '/../Modelo/Usuarios.php';

try {
    $modelo = new UsuarioModel();

    // El correo se obtiene de la sesión iniciada.
    $usuario = $modelo->consultarUsuarioPorEmail(
        $_SESSION['usuario_email']
    );

    if (!$usuario) {
        http_response_code(404);

        echo json_encode([
            'resultado' => 0,
            'mensaje' => 'No se encontró la información del usuario.'
        ], JSON_UNESCAPED_UNICODE);

        exit;
    }

    echo json_encode([
        'resultado' => 1,
        'mensaje' => 'Información consultada correctamente.',
        'usuario' => $usuario
    ], JSON_UNESCAPED_UNICODE);

} catch (Throwable $e) {
    error_log('Error al consultar usuario: ' . $e->getMessage());

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Error al consultar la información.'
    ], JSON_UNESCAPED_UNICODE);
}
