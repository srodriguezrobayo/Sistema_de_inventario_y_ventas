
<?php
header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Usuarios.php';

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
    responder(0, 'Método de solicitud no permitido.', 405);
}

$correo = trim($_POST['correo'] ?? '');
$nuevaPassword = $_POST['nuevaPassword'] ?? '';
$confirmarPassword = $_POST['confirmarPassword'] ?? '';

if (
    $correo === '' ||
    $nuevaPassword === '' ||
    $confirmarPassword === ''
) {
    responder(0, 'Todos los campos son obligatorios.', 400);
}

if (!filter_var($correo, FILTER_VALIDATE_EMAIL)) {
    responder(0, 'Ingresa un correo electrónico válido.', 400);
}

if (strlen($nuevaPassword) < 8) {
    responder(0, 'La contraseña debe tener al menos 8 caracteres.', 400);
}

if ($nuevaPassword !== $confirmarPassword) {
    responder(0, 'Las contraseñas no coinciden.', 400);
}

try {
    $modelo = new UsuarioModel();

    $usuario = $modelo->buscarUsuarioParaRestablecer($correo);

    if (!$usuario) {
        responder(0, 'No existe una cuenta registrada con ese correo.', 404);
    }

    if ((int) $usuario['Estado_usuario'] !== 1) {
        responder(0, 'La cuenta se encuentra inactiva.', 403);
    }

    // Guardar la contraseña utilizando un hash seguro.
    $hash = password_hash($nuevaPassword, PASSWORD_DEFAULT);

    if ($hash === false) {
        responder(0, 'No se pudo procesar la contraseña.', 500);
    }

    $actualizado = $modelo->actualizarContrasena($correo, $hash);

    if (!$actualizado) {
        responder(0, 'No fue posible actualizar la contraseña.', 500);
    }

    responder(1, 'La contraseña se actualizó correctamente.');

} catch (Throwable $e) {
    error_log('Error al restablecer contraseña: ' . $e->getMessage());

    responder(0, 'Ocurrió un error interno. Inténtalo nuevamente.', 500);
}
