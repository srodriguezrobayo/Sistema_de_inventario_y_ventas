
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

require_once __DIR__ . '/../Modelo/conexion.php';

/* =====================================================
   1. VALIDAR LA SESIÓN
   ===================================================== */

if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    http_response_code(401);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'La sesión no está autenticada o ha expirado.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$emailUsuario = $_SESSION['usuario_email'];


/* =====================================================
   2. CONFIGURAR PAGINACIÓN
   ===================================================== */

$productosPorPagina = 16;

$pagina = isset($_GET['pagina'])
    ? (int) $_GET['pagina']
    : 1;

if ($pagina < 1) {
    $pagina = 1;
}

$inicio = ($pagina - 1) * $productosPorPagina;


/* =====================================================
   3. VALIDAR CONEXIÓN
   ===================================================== */

if (!isset($con) || !($con instanceof mysqli)) {
    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No se pudo establecer la conexión con la base de datos.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}


/* =====================================================
   4. CONTAR PRODUCTOS DEL USUARIO
   ===================================================== */

$sqlTotal = "
    SELECT COUNT(*) AS total
    FROM productos
    INNER JOIN usuarios
        ON productos.Usuario_id_usuario = usuarios.Id_usuario
    WHERE usuarios.Email_usuario = ?
";

$stmtTotal = $con->prepare($sqlTotal);

if (!$stmtTotal) {
    error_log('Error SQL al contar productos: ' . $con->error);

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Error al preparar la consulta de productos.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmtTotal->bind_param('s', $emailUsuario);

if (!$stmtTotal->execute()) {
    error_log('Error al contar productos: ' . $stmtTotal->error);

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No fue posible contar los productos.'
    ], JSON_UNESCAPED_UNICODE);

    $stmtTotal->close();
    exit;
}

$resultadoTotal = $stmtTotal->get_result();
$filaTotal = $resultadoTotal->fetch_assoc();

$totalProductos = (int) ($filaTotal['total'] ?? 0);

$stmtTotal->close();


/* =====================================================
   5. CONSULTAR PRODUCTOS
   ===================================================== */

$sqlProductos = "
    SELECT
        productos.Id_productos,
        productos.Nombre_producto,
        productos.Codigo_producto,
        productos.Valor_unitario_producto,
        productos.Cantidad_Producto,
        productos.Unidad_medida_producto,
        productos.Tiene_FV,
        productos.Conoce_FV,
        productos.Fecha_vencimiento,
        productos.Foto_producto,
        productos.Cantidad_minima,
        productos.Creacion_registro,
        productos.Estado_producto,
        productos.Usuario_id_usuario
    FROM productos
    INNER JOIN usuarios
        ON productos.Usuario_id_usuario = usuarios.Id_usuario
    WHERE usuarios.Email_usuario = ?
    ORDER BY productos.Id_productos DESC
    LIMIT ? OFFSET ?
";

$stmtProductos = $con->prepare($sqlProductos);

if (!$stmtProductos) {
    error_log('Error SQL al consultar productos: ' . $con->error);

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Error al preparar la consulta de productos.'
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

$stmtProductos->bind_param(
    'sii',
    $emailUsuario,
    $productosPorPagina,
    $inicio
);

if (!$stmtProductos->execute()) {
    error_log('Error al consultar productos: ' . $stmtProductos->error);

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'No fue posible consultar los productos.'
    ], JSON_UNESCAPED_UNICODE);

    $stmtProductos->close();
    exit;
}

$resultadoProductos = $stmtProductos->get_result();

$productos = [];

while ($fila = $resultadoProductos->fetch_assoc()) {
    $productos[] = $fila;
}

$stmtProductos->close();


/* =====================================================
   6. CALCULAR TOTAL DE PÁGINAS
   ===================================================== */

$totalPaginas = (int) ceil(
    $totalProductos / $productosPorPagina
);


/* =====================================================
   7. DEVOLVER RESPUESTA JSON
   ===================================================== */

echo json_encode([
    'resultado' => 1,
    'mensaje' => 'Productos consultados correctamente.',
    'productos' => $productos,
    'pagina' => $pagina,
    'productosPorPagina' => $productosPorPagina,
    'total' => $totalProductos,
    'totalPaginas' => $totalPaginas
], JSON_UNESCAPED_UNICODE);

exit;

?>
