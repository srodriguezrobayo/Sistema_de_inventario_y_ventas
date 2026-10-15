
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

// =====================================================
// 1. Verificar la sesión
// =====================================================

if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    responder(0, 'La sesión ha expirado. Inicia sesión nuevamente.', 401);
}

// =====================================================
// 2. Verificar el método HTTP
// =====================================================

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responder(0, 'Método de solicitud no permitido.', 405);
}

// =====================================================
// 3. Recibir los datos del formulario
// =====================================================

$id = filter_input(INPUT_POST, 'Id_usuario', FILTER_VALIDATE_INT);

$nombre = trim($_POST['Nombre_usuario'] ?? '');
$email = trim($_POST['Email_usuario'] ?? '');
$descripcion = trim($_POST['Descripcion_usuario'] ?? '');

$emailSesion = $_SESSION['usuario_email'];

// =====================================================
// 4. Validar los datos
// =====================================================

if (!$id || $id <= 0) {
    responder(0, 'El identificador del usuario no es válido.', 400);
}

if ($nombre === '' || $email === '') {
    responder(0, 'El nombre y el correo electrónico son obligatorios.', 400);
}

if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    responder(0, 'El correo electrónico no tiene un formato válido.', 400);
}

if (mb_strlen($nombre) > 100) {
    responder(0, 'El nombre no puede superar los 100 caracteres.', 400);
}

if (mb_strlen($email) > 500) {
    responder(0, 'El correo electrónico es demasiado largo.', 400);
}

if (mb_strlen($descripcion) > 5000) {
    responder(0, 'La descripción no puede superar los 5000 caracteres.', 400);
}

// =====================================================
// 5. Procesar la foto, si se seleccionó una
// =====================================================

$rutaFoto = null;
$archivoGuardado = null;

if (
    isset($_FILES['Foto_usuario']) &&
    $_FILES['Foto_usuario']['error'] !== UPLOAD_ERR_NO_FILE
) {
    $archivo = $_FILES['Foto_usuario'];

    if ($archivo['error'] !== UPLOAD_ERR_OK) {
        responder(0, 'Ocurrió un error al recibir la imagen.', 400);
    }

    // Tamaño máximo: 5 MB
    $limiteBytes = 5 * 1024 * 1024;

    if ($archivo['size'] > $limiteBytes) {
        responder(0, 'La imagen no puede superar los 5 MB.', 400);
    }

    // Comprobar que sea una imagen válida
    $informacionImagen = @getimagesize($archivo['tmp_name']);

    if ($informacionImagen === false) {
        responder(0, 'El archivo seleccionado no es una imagen válida.', 400);
    }

    // Comprobar el tipo real de imagen
    $mimePermitidos = [
        'image/jpeg' => 'jpg',
        'image/png'  => 'png',
        'image/webp' => 'webp'
    ];

    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = $finfo->file($archivo['tmp_name']);

    if (!isset($mimePermitidos[$mime])) {
        responder(0, 'Solo se permiten imágenes JPG, PNG o WEBP.', 400);
    }

    // Directorio donde se guardarán las imágenes
    $directorio = __DIR__ . '/../uploads/Fotos_perfil/';

    if (
        !is_dir($directorio) &&
        !mkdir($directorio, 0755, true) &&
        !is_dir($directorio)
    ) {
        responder(0, 'No se pudo crear el directorio para las imágenes.', 500);
    }

    // Generar un nombre único para evitar conflictos
    try {
        $nombreArchivo = bin2hex(random_bytes(16))
            . '.'
            . $mimePermitidos[$mime];
    } catch (Throwable $e) {
        responder(0, 'No se pudo generar el nombre de la imagen.', 500);
    }

    $destino = $directorio . $nombreArchivo;

    if (!move_uploaded_file($archivo['tmp_name'], $destino)) {
        responder(0, 'No se pudo guardar la imagen en el servidor.', 500);
    }

    $archivoGuardado = $destino;

    // Ruta relativa que se guardará en la base de datos.
    // Ajusta esta ruta si tu proyecto utiliza otra estructura.
    $rutaFoto = '../Back_end/uploads/Fotos_perfil/' . $nombreArchivo;
}

// =====================================================
// 6. Cargar el modelo y actualizar el perfil
// =====================================================

try {
    require_once __DIR__ . '/../Modelo/Usuarios.php';

    // Debe coincidir con el nombre real de tu clase en Usuarios.php
    $modelo = new UsuarioModel();

    $actualizado = $modelo->actualizarInformacionUsuario(
        $id,
        $emailSesion,
        $nombre,
        $email,
        $descripcion,
        $rutaFoto
    );

    // El correo ya pertenece a otro usuario
    if ($actualizado === 'correo_existente') {
        if ($archivoGuardado !== null && file_exists($archivoGuardado)) {
            unlink($archivoGuardado);
        }

        responder(0, 'Este correo electrónico ya está registrado.', 409);
    }

    // El ID y el correo de sesión no corresponden
    if ($actualizado === 'no_autorizado') {
        if ($archivoGuardado !== null && file_exists($archivoGuardado)) {
            unlink($archivoGuardado);
        }

        responder(0, 'No tienes autorización para modificar este perfil.', 403);
    }

    if ($actualizado !== 'correcto') {
        throw new Exception('El modelo no confirmó la actualización.');
    }

    // Actualizar el correo de sesión si el usuario lo cambió
    $_SESSION['usuario_email'] = $email;

    responder(1, 'Tu perfil se ha actualizado correctamente.');

} catch (Throwable $e) {
    // Eliminar la nueva imagen si la actualización falla
    if ($archivoGuardado !== null && file_exists($archivoGuardado)) {
        unlink($archivoGuardado);
    }

    error_log('Error al actualizar el perfil: ' . $e->getMessage());

    responder(0, 'Ocurrió un error interno al actualizar el perfil.', 500);
}
