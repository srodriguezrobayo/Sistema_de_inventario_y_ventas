
<?php

session_start();

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

// Verificar que exista una sesión autenticada
if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    responder(0, 'La sesión ha expirado. Inicia sesión nuevamente.', 401);
}

// Solo permitir solicitudes POST
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(0, 'Método de solicitud no permitido.', 405);
}

// Recibir los datos enviados por JavaScript
$contrasenaAnterior = $_POST['contrasena_anterior'] ?? '';
$nuevaContrasena = $_POST['nueva_contrasena'] ?? '';
$confirmarContrasena = $_POST['confirmar_contrasena'] ?? '';

// Validar que no falten campos
if (
    $contrasenaAnterior === '' ||
    $nuevaContrasena === '' ||
    $confirmarContrasena === ''
) {
    responder(0, 'Debes completar todos los campos.', 400);
}

// Validar longitud mínima
if (strlen($nuevaContrasena) < 8) {
    responder(0, 'La nueva contraseña debe tener al menos 8 caracteres.', 400);
}

// Validar coincidencia
if ($nuevaContrasena !== $confirmarContrasena) {
    responder(0, 'Las contraseñas nuevas no coinciden.', 400);
}

// Evitar reutilizar la contraseña anterior
if ($contrasenaAnterior === $nuevaContrasena) {
    responder(0, 'La nueva contraseña debe ser diferente a la anterior.', 400);
}

require_once __DIR__ . '/../Modelo/Usuarios.php';

try {
    // Usa el nombre de clase que tenga tu archivo Usuarios.php
    $modelo = new UsuarioModel();

    // El correo se obtiene de la sesión por seguridad
    $resultado = $modelo->cambiarContrasena(
        $_SESSION['usuario_email'],
        $contrasenaAnterior,
        $nuevaContrasena
    );

    switch ($resultado) {
        case 'correcto':
            responder(1, 'La contraseña se actualizó correctamente.');

        case 'contrasena_incorrecta':
            responder(0, 'La contraseña anterior es incorrecta.', 400);

        case 'usuario_no_encontrado':
            responder(0, 'No se encontró el usuario.', 404);

        default:
            responder(0, 'No se pudo actualizar la contraseña.', 500);
    }

} catch (Throwable $e) {
    error_log('Error al cambiar la contraseña: ' . $e->getMessage());

    responder(0, 'Ocurrió un error al actualizar la contraseña.', 500);
}