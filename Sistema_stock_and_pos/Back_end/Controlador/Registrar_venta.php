<?php

session_start();
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store, no-cache, must-revalidate');

function responderVenta(int $codigo, array $respuesta): void
{
    http_response_code($codigo);
    echo json_encode($respuesta, JSON_UNESCAPED_UNICODE);
    exit;
}

if (
    empty($_SESSION['autenticado']) ||
    $_SESSION['autenticado'] !== true ||
    empty($_SESSION['usuario_email'])
) {
    responderVenta(401, [
        'resultado' => 0,
        'mensaje' => 'Tu sesión expiró. Inicia sesión nuevamente.'
    ]);
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    responderVenta(405, [
        'resultado' => 0,
        'mensaje' => 'Método no permitido.'
    ]);
}

$entrada = json_decode(file_get_contents('php://input'), true);
$tipo = $entrada['tipo'] ?? '';
$correo = trim((string) ($entrada['correoCliente'] ?? ''));
$itemsEntrada = $entrada['items'] ?? null;

if (
    !in_array($tipo, ['Venta', 'Devolucion'], true) ||
    !filter_var($correo, FILTER_VALIDATE_EMAIL) ||
    !is_array($itemsEntrada) ||
    count($itemsEntrada) === 0
) {
    responderVenta(400, [
        'resultado' => 0,
        'mensaje' => 'Los datos de la venta o el correo no son válidos.'
    ]);
}

$itemsSolicitados = [];
foreach ($itemsEntrada as $item) {
    $id = filter_var($item['id'] ?? null, FILTER_VALIDATE_INT);
    $cantidad = filter_var($item['cantidad'] ?? null, FILTER_VALIDATE_INT);

    if (!$id || $id < 1 || !$cantidad || $cantidad < 1 || $cantidad > 100000) {
        responderVenta(400, [
            'resultado' => 0,
            'mensaje' => 'Hay productos o cantidades no válidos en el carrito.'
        ]);
    }

    $itemsSolicitados[$id] = ($itemsSolicitados[$id] ?? 0) + $cantidad;
}
ksort($itemsSolicitados, SORT_NUMERIC);

require_once __DIR__ . '/../Modelo/conexion.php';

$transaccionActiva = false;
$emailIntentado = false;
try {
    $stmtUsuario = $con->prepare(
        'SELECT Id_usuario, Nombre_usuario
         FROM Usuarios
         WHERE Email_usuario = ? AND Estado_usuario = 1
         LIMIT 1'
    );
    $stmtUsuario->bind_param('s', $_SESSION['usuario_email']);
    $stmtUsuario->execute();
    $usuario = $stmtUsuario->get_result()->fetch_assoc();
    $stmtUsuario->close();

    if (!$usuario) {
        responderVenta(401, [
            'resultado' => 0,
            'mensaje' => 'No se encontró un usuario activo para esta sesión.'
        ]);
    }

    $usuarioId = (int) $usuario['Id_usuario'];
    $nombreCajero = $usuario['Nombre_usuario'];
    $con->begin_transaction();
    $transaccionActiva = true;

    $stmtProducto = $con->prepare(
        'SELECT Nombre_producto, Valor_unitario_producto, Cantidad_Producto
         FROM Productos
         WHERE Id_productos = ?
           AND Usuario_id_usuario = ?
           AND Estado_producto = 1
         FOR UPDATE'
    );
    $stmtVenta = $con->prepare(
        'UPDATE Productos
         SET Cantidad_Producto = Cantidad_Producto - ?
         WHERE Id_productos = ?
           AND Usuario_id_usuario = ?
           AND Estado_producto = 1
           AND Cantidad_Producto >= ?'
    );
    $stmtDevolucion = $con->prepare(
        'UPDATE Productos
         SET Cantidad_Producto = Cantidad_Producto + ?
         WHERE Id_productos = ?
           AND Usuario_id_usuario = ?
           AND Estado_producto = 1'
    );

    $detalle = [];
    $total = 0;

    foreach ($itemsSolicitados as $idProducto => $cantidad) {
        $stmtProducto->bind_param('ii', $idProducto, $usuarioId);
        $stmtProducto->execute();
        $producto = $stmtProducto->get_result()->fetch_assoc();

        if (!$producto) {
            throw new DomainException('Uno de los productos ya no está disponible.');
        }

        $stock = (int) $producto['Cantidad_Producto'];
        if ($tipo === 'Venta' && $stock < $cantidad) {
            throw new DomainException(
                'Stock insuficiente para ' . $producto['Nombre_producto']
                . '. Disponible: ' . $stock . '.'
            );
        }

        $precio = (int) round((float) $producto['Valor_unitario_producto']);
        $subtotal = $precio * $cantidad;
        $total += $subtotal;

        if ($tipo === 'Venta') {
            $stmtVenta->bind_param(
                'iiii',
                $cantidad,
                $idProducto,
                $usuarioId,
                $cantidad
            );
            $stmtVenta->execute();

            if ($stmtVenta->affected_rows !== 1) {
                throw new DomainException(
                    'El stock cambió mientras se procesaba la venta. Intenta nuevamente.'
                );
            }
        } else {
            $stmtDevolucion->bind_param(
                'iii',
                $cantidad,
                $idProducto,
                $usuarioId
            );
            $stmtDevolucion->execute();
        }

        $detalle[] = [
            'id' => (int) $idProducto,
            'nombre' => $producto['Nombre_producto'],
            'precio' => $precio,
            'cantidad' => $cantidad,
            'subtotal' => $subtotal
        ];
    }

    $stmtProducto->close();
    $stmtVenta->close();
    $stmtDevolucion->close();

    if ($total < 1 || $total > 999999) {
        throw new DomainException(
            'El total debe estar entre $1 y $999.999 para poder registrarlo.'
        );
    }

    $fecha = date('Y-m-d H:i:s');
    $factura = 'SAP-' . date('YmdHis') . '-' . random_int(100, 999);
    $descripcion = json_encode([
        'factura' => $factura,
        'cajero' => $nombreCajero,
        'items' => $detalle
    ], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);

    if ($descripcion === false) {
        throw new RuntimeException('No se pudo crear el detalle de la venta.');
    }

    $stmtRegistro = $con->prepare(
        'INSERT INTO Ventas (
            Fecha_hora_venta,
            Descripcion_venta,
            Total_pagar_venta,
            Accion_venta,
            Estado_envio_venta,
            Correo_envio_venta,
            Estado_venta,
            Usuario_id_usuario
        ) VALUES (?, ?, ?, ?, 0, ?, 1, ?)'
    );
    $stmtRegistro->bind_param(
        'ssissi',
        $fecha,
        $descripcion,
        $total,
        $tipo,
        $correo,
        $usuarioId
    );
    $stmtRegistro->execute();
    $idVenta = (int) $stmtRegistro->insert_id;
    $stmtRegistro->close();

    $operacion = [
        'tipo' => $tipo,
        'factura' => $factura,
        'fecha' => $fecha,
        'cajero' => $nombreCajero,
        'total' => $total,
        'items' => $detalle
    ];

    $emailIntentado = true;
    require_once __DIR__ . '/../Modelo/EmailComprobante.php';
    enviarComprobanteVenta($correo, $operacion);

    $stmtEnvio = $con->prepare(
        'UPDATE Ventas SET Estado_envio_venta = 1 WHERE Id_ventas = ?'
    );
    $stmtEnvio->bind_param('i', $idVenta);
    $stmtEnvio->execute();
    $stmtEnvio->close();

    $con->commit();
    $transaccionActiva = false;

    responderVenta(200, [
        'resultado' => 1,
        'venta_id' => $idVenta,
        'factura' => $factura,
        'correo_enviado' => true,
        'mensaje' => 'La operación se registró y el comprobante fue enviado.'
    ]);
} catch (DomainException $e) {
    if ($transaccionActiva) {
        $con->rollback();
    }
    responderVenta(400, [
        'resultado' => 0,
        'mensaje' => $e->getMessage()
    ]);
} catch (Throwable $e) {
    if ($transaccionActiva) {
        $con->rollback();
    }
    error_log('Error al registrar venta: ' . $e->getMessage());

    if ($emailIntentado) {
        responderVenta(502, [
            'resultado' => 0,
            'mensaje' => 'No se pudo enviar el comprobante. La venta no se registró y el inventario no cambió. Revisa la instalación de PHPMailer y la configuración SMTP.'
        ]);
    }

    responderVenta(500, [
        'resultado' => 0,
        'mensaje' => 'No se pudo registrar la operación. No se modificó el inventario.'
    ]);
}
?>