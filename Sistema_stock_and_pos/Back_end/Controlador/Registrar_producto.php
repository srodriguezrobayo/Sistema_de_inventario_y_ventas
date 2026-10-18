
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/Producto.php';

function responder($resultado, $mensaje, $codigo = 200)
{
    http_response_code($codigo);

    echo json_encode([
        'resultado' => $resultado,
        'mensaje' => $mensaje
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {
    if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
        responder(0, 'Método no permitido.', 405);
    }

    // Datos del formulario
    $nombre = trim($_POST['Nombrep'] ?? '');
    $codigo = trim($_POST['codigop'] ?? '');
    $precio = $_POST['Valorunip'] ?? '';
    $cantidad = $_POST['cantidap'] ?? '';
    $unidad = trim($_POST['unidad'] ?? '');
    $cantidadMinima = $_POST['avisolowstockproducto'] ?? '';

    $tieneFV = $_POST['TieneFV'] ?? '';
    $conoceFV = $_POST['RegistrarFecha'] ?? '0';
    $fecha = trim($_POST['FechaVencimiento'] ?? '');

    if ( $tieneFV === 'Si'){
        $tieneFV = 1;
    }else{
        $tieneFV = 0;
    }

    if ( $conoceFV === 'Si'){
        $conoceFV = 1;
    }else{
        $conoceFV = 0;
    }

    // Ajusta esta clave al nombre real de tu sesión.
    $usuario = $_POST['Id_usuario'] ?? $_SESSION['usuario_id'] ?? null;

    if (!$usuario || !is_numeric($usuario)) {
        responder(0, 'Inicia sesión nuevamente.', 401);
    }

    // Validar campos obligatorios
    if (
        $nombre === '' || $codigo === '' || $unidad === '' ||
        $precio === '' || $cantidad === '' || $cantidadMinima === ''
    ) {
        responder(0, 'Completa los campos obligatorios.', 422);
    }

    if (
        !is_numeric($precio) || (float)$precio < 1 ||
        !is_numeric($cantidad) || (int)$cantidad < 1 ||
        (float)$cantidad != (int)$cantidad ||
        !is_numeric($cantidadMinima) || (int)$cantidadMinima < 1 ||
        (float)$cantidadMinima != (int)$cantidadMinima
    ) {
        responder(0, 'Verifica el precio, la cantidad y el stock mínimo.', 422);
    }

    // Validar vencimiento
    if (!in_array($tieneFV, [1, 0], true)) {
        responder(0, 'Indica si tiene fecha de vencimiento.', 422);
    }

    if ($tieneFV === 1) {
        if (!in_array($conoceFV, [1, 0], true)) {
            responder(0, 'Indica si conoces la fecha de vencimiento.', 422);
        }

        if ($conoceFV === 1) {
            $fechaValida = DateTime::createFromFormat('!Y-m-d', $fecha);

            if (!$fechaValida || $fechaValida->format('Y-m-d') !== $fecha) {
                responder(
                    0,
                    'La fecha debe tener el formato AAAA-MM-DD.',
                    422
                );
            }
        } else {
            $fecha = null;
        }
    } else {
        $conoceFV = 0;
        $fecha = null;
    }

    // Foto predeterminada
    $carpeta = dirname(__DIR__) . '/uploads/Fotos_producto/';
    $foto = '../Back_end/uploads/Fotos_producto/img08.jpg';

    if (!is_dir($carpeta) && !mkdir($carpeta, 0755, true)) {
        responder(0, 'No se pudo crear la carpeta de fotos.', 500);
    }

    if (
        !isset($_FILES['Fotoproducto']) ||
        $_FILES['Fotoproducto']['error'] === UPLOAD_ERR_NO_FILE
    ) {
        if (!is_file($carpeta . 'img08.jpg')) {
            responder(0, 'No se encuentra la imagen predeterminada img08.jpg.', 500);
        }
    } else {
        $archivo = $_FILES['Fotoproducto'];

        if (
            $archivo['error'] !== UPLOAD_ERR_OK ||
            $archivo['size'] > 5 * 1024 * 1024
        ) {
            responder(0, 'La imagen tiene un error o supera los 5 MB.', 422);
        }

        $finfo = new finfo(FILEINFO_MIME_TYPE);
        $mime = $finfo->file($archivo['tmp_name']);

        $tipos = [
            'image/jpeg' => 'jpg',
            'image/png' => 'png',
            'image/webp' => 'webp'
        ];

        if (!isset($tipos[$mime])) {
            responder(0, 'Solo se permiten imágenes JPG, PNG o WEBP.', 422);
        }

        $nombreFoto = bin2hex(random_bytes(12)) . '.' . $tipos[$mime];

        if (!move_uploaded_file($archivo['tmp_name'], $carpeta . $nombreFoto)) {
            responder(0, 'No se pudo guardar la imagen.', 500);
        }

        $foto = '../Back_end/uploads/Fotos_producto/' . $nombreFoto;
    }

    // Valores finales
    $precio = (float)$precio;
    $cantidad = (int)$cantidad;
    $cantidadMinima = (int)$cantidadMinima;
    $usuario = (int)$usuario;
    $estado = 1;

    // Guardar en la base de datos
    $modelo = new ProductoModel();

    $resultado = $modelo->registrarProducto(
        $nombre,
        $codigo,
        $precio,
        $cantidad,
        $unidad,
        $tieneFV,
        $conoceFV,
        $fecha,
        $foto,
        $cantidadMinima,
        $estado,
        $usuario
    );

    // Si el procedimiento devuelve resultado y mensaje,
    // respetar el resultado informado.
    if (
        isset($resultado['resultado']) &&
        (int)$resultado['resultado'] === 0
    ) {
        responder(
            0,
            $resultado['mensaje'] ?? 'No se pudo registrar el producto.',
            400
        );
    }

    responder(1, $resultado['mensaje'] ?? 'Producto registrado correctamente.');

} catch (Throwable $e) {
    error_log('Registrar producto: ' . $e->getMessage());

    responder(
        0,
        'No se pudo registrar el producto. Verifica el procedimiento almacenado y la conexión.',
        500
    );
}
?>
