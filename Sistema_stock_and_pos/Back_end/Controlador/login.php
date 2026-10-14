
<?php

ini_set('display_errors', '0');
error_reporting(E_ALL);

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function responder($resultado, $mensaje, $codigo = 200)
{
    http_response_code($codigo);

    echo json_encode([
        'resultado' => $resultado,
        'mensaje' => $mensaje
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(0, 'Método no permitido.', 405);
}

$email = trim($_POST['Email_usuario'] ?? '');
$contrasena = $_POST['Contrasena_usuario'] ?? '';

if ($email === '' || $contrasena === '') {
    responder(0, 'Ingresa tu correo y contraseña.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(0, 'Credenciales inválidas.', 401);
}

try {
    require_once __DIR__ . '/../Modelo/Usuarios.php';

    $modelo = new UsuarioModel();

    // Buscar únicamente por correo electrónico.
    $usuario = $modelo->buscarUsuarioPorEmail($email);

    // Comprobar usuario, estado y contraseña.
    if (
        !$usuario ||
        (int)$usuario['Estado_usuario'] !== 1 ||
        !password_verify(
            $contrasena,
            $usuario['Contrasena_usuario']
        )
    ) {
        responder(0, 'Credenciales inválidas.', 401);
    }

    // Crear la sesión después de validar las credenciales.
    if (session_status() !== PHP_SESSION_ACTIVE) {
        $https = isset($_SERVER['HTTPS'])
            && $_SERVER['HTTPS'] !== 'off';

        session_set_cookie_params([
            'lifetime' => 0,
            'path' => '/',
            'secure' => $https,
            'httponly' => true,
            'samesite' => 'Lax'
        ]);

        session_start();
    }

    session_regenerate_id(true);

    $_SESSION['autenticado'] = true;
    $_SESSION['usuario_nombre'] = $usuario['Nombre_usuario'];
    $_SESSION['usuario_email'] = $usuario['Email_usuario'];

    responder(1, 'Inicio de sesión exitoso.');

} catch (Throwable $e) {
    error_log('Error en Login_Usuarios.php: ' . $e->getMessage());

    responder(
        0,
        'Ocurrió un error interno. Intenta nuevamente.',
        500
    );
}
?>
