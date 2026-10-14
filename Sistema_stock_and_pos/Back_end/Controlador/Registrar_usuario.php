
<?php

require_once __DIR__ . '/../Modelo/Usuarios.php';

header('Content-Type: application/json; charset=utf-8');

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

$nombre = trim($_POST['Nombre_usuario'] ?? '');
$email = trim($_POST['Email_usuario'] ?? '');
$contrasena = $_POST['Contrasena_usuario'] ?? '';

// Validar campos
if ($nombre === '' || $email === '' || $contrasena === '') {
    responder(0, 'Todos los campos son obligatorios.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(0, 'El correo electrónico no es válido.', 400);
}

if (strlen($nombre) > 100 || strlen($email) > 500) {
    responder(0, 'El nombre o el correo superan la longitud permitida.', 400);
}

// Validar longitud de la contraseña antes de cifrarla
if (strlen($contrasena) > 72) {
    responder(0, 'La contraseña no puede superar los 72 bytes.', 400);
}

try {
    // Guardar únicamente el hash, nunca la contraseña original
    $contrasenaHash = password_hash(
        $contrasena,
        PASSWORD_DEFAULT
    );

    $usuario = new UsuarioModel();

    $datos = $usuario->registrarUsuario(
        $nombre,
        $email,
        $contrasenaHash
    );

    if (!$datos || !isset($datos['resultado'])) {
        responder(0, 'No se recibió una respuesta válida de la base de datos.', 500);
    }

    responder(
        (int) $datos['resultado'],
        $datos['mensaje'] ?? 'Operación finalizada.'
    );

} catch (Throwable $e) {
    error_log($e->getMessage());

    responder(
        0,
        'Ocurrió un error interno al registrar el usuario.',
        500
    );
}
?>
