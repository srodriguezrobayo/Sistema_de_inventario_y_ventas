
<?php

session_start();

header('Content-Type: application/json; charset=utf-8');

// =====================================================
// 1. VALIDAR SESIÓN
// =====================================================

if (
    !isset($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    !isset($_SESSION['usuario_email'])
) {
    http_response_code(401);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'La sesión ha expirado. Inicia sesión nuevamente.',
        'productos' => [],
        'total' => 0
    ], JSON_UNESCAPED_UNICODE);

    exit;
}

try {

    // =====================================================
    // 2. CONECTAR A LA BASE DE DATOS
    // =====================================================

    require_once __DIR__ . '/../Modelo/conexion.php';

    if (!isset($con) || !($con instanceof mysqli)) {
        throw new Exception(
            'La conexión $con no se creó correctamente.'
        );
    }

    // =====================================================
    // 3. OBTENER CORREO DEL USUARIO AUTENTICADO
    // =====================================================

    $correoUsuario = $_SESSION['usuario_email'];

    // =====================================================
    // 4. EJECUTAR PROCEDIMIENTO ALMACENADO
    // =====================================================
    $consulta = mysqli_prepare(
        $con,
        "CALL C_Producto_Bajo(?)"
    );

    if (!$consulta) {
        throw new Exception(
            "No fue posible preparar la consulta."
        );
    }

    mysqli_stmt_bind_param(
        $consulta,
        "s",
        $correoUsuario
    );

    if (!mysqli_stmt_execute($consulta)) {
        throw new Exception(
            "No fue posible ejecutar el procedimiento."
        );
    }

    // =====================================================
    // 5. OBTENER RESULTADOS
    // =====================================================

    $resultado = mysqli_stmt_get_result($consulta);

    $productos = [];

    if ($resultado) {
        while ($fila = mysqli_fetch_assoc($resultado)) {
            $productos[] = $fila;
        }

        mysqli_free_result($resultado);
    }

    mysqli_stmt_close($consulta);

    // =====================================================
    // 6. LIBERAR RESULTADOS PENDIENTES DEL PROCEDIMIENTO
    // =====================================================

    while (mysqli_more_results($con)) {

        if (!mysqli_next_result($con)) {
            break;
        }

        $resultadoPendiente = mysqli_store_result($con);

        if ($resultadoPendiente) {
            mysqli_free_result($resultadoPendiente);
        }
    }

    // =====================================================
    // 7. DEVOLVER RESPUESTA JSON
    // =====================================================

    echo json_encode([
        'resultado' => 1,
        'mensaje' => 'Productos con poco stock consultados correctamente.',
        'productos' => $productos,
        'total' => count($productos)
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

} catch (Throwable $e) {

    error_log(
        'Error al filtrar productos por stock: ' .
        $e->getMessage()
    );

    http_response_code(500);

    echo json_encode([
        'resultado' => 0,
        'mensaje' => 'Ocurrió un error al consultar los productos con poco stock.',
        'productos' => [],
        'total' => 0
    ], JSON_UNESCAPED_UNICODE);

} finally {

    if (isset($con) && $con instanceof mysqli) {
        mysqli_close($con);
    }
}
?>
