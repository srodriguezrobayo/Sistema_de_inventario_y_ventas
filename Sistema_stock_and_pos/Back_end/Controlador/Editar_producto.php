
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

function responder(int $codigo, array $datos): void
{
    http_response_code($codigo);

    echo json_encode(
        $datos,
        JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES
    );

    exit;
}

// =====================================================
// VALIDAR SESIÓN
// =====================================================

if (
    ($_SESSION['autenticado'] ?? false) !== true ||
    empty($_SESSION['usuario_email'])
) {
    responder(401, [
        'resultado' => 0,
        'mensaje' => 'Tu sesión ha expirado.'
    ]);
}

require_once __DIR__ . '/../Modelo/Producto.php';

try {
    $modelo = new ProductoModel();
    $correo = (string) $_SESSION['usuario_email'];

    // =====================================================
    // CONSULTAR PRODUCTO
    // GET: Editar_producto.php?id=1
    // =====================================================

    if ($_SERVER['REQUEST_METHOD'] === 'GET') {
        $id = filter_input(
            INPUT_GET,
            'id',
            FILTER_VALIDATE_INT
        );

        if (!$id || $id < 1) {
            responder(400, [
                'resultado' => 0,
                'mensaje' => 'El ID del producto no es válido.'
            ]);
        }

        $producto = $modelo->obtenerPorId(
            (int) $id,
            $correo
        );

        if (!$producto) {
            responder(404, [
                'resultado' => 0,
                'mensaje' => 'No se encontró el producto.'
            ]);
        }

        responder(200, [
            'resultado' => 1,
            'producto' => $producto
        ]);
    }

    // =====================================================
    // VALIDAR MÉTODO HTTP
    // =====================================================

    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        header('Allow: GET, POST');

        responder(405, [
            'resultado' => 0,
            'mensaje' => 'Método no permitido.'
        ]);
    }

    // =====================================================
    // RECIBIR DATOS
    // =====================================================

    $id = filter_var(
        $_POST['Id_productos'] ?? null,
        FILTER_VALIDATE_INT
    );

    $nombre = trim((string) ($_POST['Nombrep'] ?? ''));
    $codigo = trim((string) ($_POST['codigop'] ?? ''));
    $valor = $_POST['Valorunip'] ?? '';
    $unidad = trim((string) ($_POST['unidad'] ?? ''));
    $stockMinimo = $_POST['avisolowstockproducto'] ?? '';

    if (!$id || $id < 1) {
        responder(400, [
            'resultado' => 0,
            'mensaje' => 'El ID del producto no es válido.'
        ]);
    }

    if (
        $nombre === '' ||
        $codigo === '' ||
        $unidad === ''
    ) {
        responder(400, [
            'resultado' => 0,
            'mensaje' => 'Completa todos los campos obligatorios.'
        ]);
    }

    if (
        !is_numeric($valor) ||
        !is_finite((float) $valor) ||
        (float) $valor <= 0 ||
        !is_numeric($stockMinimo) ||
        !is_finite((float) $stockMinimo) ||
        (float) $stockMinimo < 0 ||
        floor((float) $stockMinimo) != (float) $stockMinimo
    ) {
        responder(400, [
            'resultado' => 0,
            'mensaje' => 'El precio debe ser mayor que cero y el stock mínimo debe ser un entero no negativo.'
        ]);
    }

    // =====================================================
    // COMPROBAR PROPIEDAD DEL PRODUCTO
    // =====================================================

    $productoActual = $modelo->obtenerPorId(
        (int) $id,
        $correo
    );

    if (!$productoActual) {
        responder(404, [
            'resultado' => 0,
            'mensaje' => 'El producto no existe o no tienes permiso para editarlo.'
        ]);
    }

    // =====================================================
    // PROCESAR FOTO OPCIONAL
    // =====================================================

    $foto = null;
    $rutaFotoNueva = null;

    if (
        isset($_FILES['Fotoproducto']) &&
        $_FILES['Fotoproducto']['error'] !== UPLOAD_ERR_NO_FILE
    ) {
        $archivo = $_FILES['Fotoproducto'];

        if ($archivo['error'] !== UPLOAD_ERR_OK) {
            responder(400, [
                'resultado' => 0,
                'mensaje' => 'No se pudo recibir la imagen.'
            ]);
        }

        if (
            !is_uploaded_file($archivo['tmp_name']) ||
            $archivo['size'] <= 0 ||
            $archivo['size'] > 5 * 1024 * 1024
        ) {
            responder(400, [
                'resultado' => 400,
                'mensaje' => 'La imagen debe ser válida y no superar los 5 MB.'
            ]);
        }

        $tiposPermitidos = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp',
            'image/gif' => 'gif'
        ];

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $tipo = $finfo->file($archivo['tmp_name']);

        if (!isset($tiposPermitidos[$tipo])) {
            responder(400, [
                'resultado' => 0,
                'mensaje' => 'Formato de imagen no permitido.'
            ]);
        }

        /*
         * Ruta desde Back_end/Controlador/
         * Ajusta el destino si tu estructura es diferente.
         */
        $directorioFotos =
            __DIR__ . '/../../Back_end/uploads/Fotos_producto/';

        if (
            !is_dir($directorioFotos) &&
            !mkdir($directorioFotos, 0755, true) &&
            !is_dir($directorioFotos)
        ) {
            throw new RuntimeException(
                'No fue posible crear la carpeta de imágenes.'
            );
        }

        $nombreArchivo = bin2hex(random_bytes(16))
            . '.' . $tiposPermitidos[$tipo];

        $destino = $directorioFotos . $nombreArchivo;

        if (!move_uploaded_file($archivo['tmp_name'], $destino)) {
            throw new RuntimeException(
                'No fue posible guardar la imagen.'
            );
        }

        $foto = '../Back_end/uploads/Fotos_producto/' . $nombreArchivo;
        $rutaFotoNueva = $destino;
    }

    // =====================================================
    // EJECUTAR ACTUALIZACIÓN
    // =====================================================

    try {
        $actualizado = $modelo->actualizar(
            (int) $id,
            $correo,
            $nombre,
            $codigo,
            (float) $valor,
            $unidad,
            (int) $stockMinimo,
            $foto
        );
    } catch (Throwable $e) {
        // Evitar dejar una imagen nueva huérfana si falla el UPDATE.
        if (
            $rutaFotoNueva !== null &&
            is_file($rutaFotoNueva)
        ) {
            @unlink($rutaFotoNueva);
        }

        throw $e;
    }

    if (!$actualizado) {
        if (
            $rutaFotoNueva !== null &&
            is_file($rutaFotoNueva)
        ) {
            @unlink($rutaFotoNueva);
        }

        responder(404, [
            'resultado' => 0,
            'mensaje' => 'No fue posible actualizar el producto.'
        ]);
    }

    responder(200, [
        'resultado' => 1,
        'mensaje' => 'Producto actualizado correctamente.',
        'id' => (int) $id
    ]);

} catch (Throwable $e) {
    error_log(
        'Error al editar producto: ' . $e->getMessage()
    );

    responder(500, [
        'resultado' => 0,
        'mensaje' => 'Ocurrió un error al procesar la edición.'
    ]);
}
?>