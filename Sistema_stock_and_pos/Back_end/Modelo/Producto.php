
<?php

require_once __DIR__ . '/conexion.php';

class ProductoModel
{
    private $conexion;

    public function __construct()
    {
        global $con;
        $this->conexion = $con;
    }

    public function registrarProducto(
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
    ) {
        $sql = "CALL I_Producto_Unidad(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        $consulta = $this->conexion->prepare($sql);

        if (!$consulta) {
            throw new Exception($this->conexion->error);
        }

        $consulta->bind_param(
            "ssdisssssisi",
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

        try {
            $consulta->execute();

            $resultado = $consulta->get_result();
            $datos = $resultado ? $resultado->fetch_assoc() : null;

            if ($resultado) {
                $resultado->free();
            }

            $consulta->close();

            // Liberar resultados pendientes del procedimiento.
            while ($this->conexion->more_results()) {
                if (!$this->conexion->next_result()) {
                    break;
                }

                $pendiente = $this->conexion->store_result();

                if ($pendiente) {
                    $pendiente->free();
                }
            }

            return $datos;

        } catch (Throwable $e) {
            $consulta->close();
            throw $e;
        }
    }

    
public function ConsultarProductosPorUsuario(
    int $usuarioId,
    int $limite,
    int $offset
): array {
    // Consultar cuántos productos tiene el usuario.
    $sqlTotal = "
        SELECT COUNT(*) AS total
        FROM productos
        WHERE Usuario_id_usuario = ?
    ";

    $stmtTotal = $this->conexion->prepare($sqlTotal);

    if (!$stmtTotal) {
        throw new Exception($this->conexion->error);
    }

    $stmtTotal->bind_param("i", $usuarioId);
    $stmtTotal->execute();

    $resultadoTotal = $stmtTotal->get_result();
    $total = (int) $resultadoTotal->fetch_assoc()['total'];

    $resultadoTotal->free();
    $stmtTotal->close();

    // Consultar únicamente los productos de la página solicitada.
    $sql = "
        SELECT
            Id_productos
            Nombre_producto,
            Codigo_producto,
            Valor_unitario_producto,
            Cantidad_Producto,
            Unidad_medida_producto,
            Foto_producto,
            Cantidad_minima,
            Estado_producto
        FROM productos
        WHERE Usuario_id_usuario = ?
        ORDER BY Nombre_producto ASC
        LIMIT ? OFFSET ?
    ";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception($this->conexion->error);
    }

    $stmt->bind_param("iii", $usuarioId, $limite, $offset);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $productos = $resultado->fetch_all(MYSQLI_ASSOC);

    $resultado->free();
    $stmt->close();

    return [
        'productos' => $productos,
        'total' => $total
    ];
}

}
?>
