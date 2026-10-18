
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

     /* =====================================================
       REGISTRAR PRODUCTO
       ===================================================== */

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
            "ssdisiissiii",
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
            $datos = $resultado
                ? $resultado->fetch_assoc()
                : null;

            if ($resultado) {
                $resultado->free();
            }

            $consulta->close();

            // Liberar los resultados pendientes del procedimiento.
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

    /* =====================================================
       CONSULTAR PRODUCTOS POR USUARIO
       ===================================================== */

    public function ConsultarProductosPorUsuario(
        int $usuarioId,
        int $limite,
        int $offset
    ): array {
        $sqlTotal = "
            SELECT COUNT(*) AS total
            FROM Productos
            WHERE Usuario_id_usuario = ?
        ";

        $stmt = $this->conexion->prepare($sqlTotal);
        $stmt->bind_param("i", $usuarioId);
        $stmt->execute();

        $resultadoTotal = $stmt->get_result();
        $filaTotal = $resultadoTotal->fetch_assoc();
        $total = (int) $filaTotal['total'];

        $resultadoTotal->free();
        $stmt->close();

        $sql = "
            SELECT *
            FROM Productos
            WHERE Usuario_id_usuario = ?
            ORDER BY Nombre_producto ASC
            LIMIT ? OFFSET ?
        ";

        $stmt = $this->conexion->prepare($sql);
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

    /* =====================================================
       OBTENER PRODUCTO POR ID
       ===================================================== */

    public function obtenerPorId(
        int $idProducto,
        string $correo
    ): ?array {
        $sql = "
            SELECT p.*
            FROM Productos p
            INNER JOIN usuarios u
                ON u.Id_usuario = p.Usuario_id_usuario
            WHERE p.Id_productos = ?
              AND u.Email_usuario = ?
            LIMIT 1
        ";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("is", $idProducto, $correo);
        $stmt->execute();

        $resultado = $stmt->get_result();
        $producto = $resultado->fetch_assoc();

        $resultado->free();
        $stmt->close();

        return $producto ?: null;
    }

    /* =====================================================
       ACTUALIZAR PRODUCTO
       ===================================================== */

    public function actualizar(
        int $idProducto,
        string $correo,
        string $nombre,
        string $codigo,
        float $valorUnitario,
        string $unidad,
        int $cantidadMinima,
        ?string $foto = null
    ): bool {
        $sql = "
            UPDATE Productos p
            INNER JOIN usuarios u
                ON u.Id_usuario = p.Usuario_id_usuario
            SET
                p.Nombre_producto = ?,
                p.Codigo_producto = ?,
                p.Valor_unitario_producto = ?,
                p.Unidad_medida_producto = ?,
                p.Cantidad_minima = ?,
                p.Foto_producto = COALESCE(?, p.Foto_producto)
            WHERE p.Id_productos = ?
              AND u.Email_usuario = ?
        ";

        $stmt = $this->conexion->prepare($sql);

        $stmt->bind_param(
            "ssdsisis",
            $nombre,
            $codigo,
            $valorUnitario,
            $unidad,
            $cantidadMinima,
            $foto,
            $idProducto,
            $correo
        );

        $stmt->execute();
        $actualizado = $stmt->affected_rows >= 0;
        $stmt->close();

        return $actualizado;
    }

    /* =====================================================
       DEJAR DE VENDER PRODUCTO
       ===================================================== */

    public function dejarDeVender($idProducto)
    {
        $sql = "
            UPDATE Productos
            SET Estado_producto = 0
            WHERE Id_productos = ?
              AND Estado_producto = 1
        ";

        $stmt = $this->conexion->prepare($sql);
        $stmt->bind_param("i", $idProducto);
        $stmt->execute();

        $actualizado = $stmt->affected_rows > 0;
        $stmt->close();

        return $actualizado;
    }

    /* =====================================================
       CONSULTAR DATOS DE VENCIMIENTO
       Ya no necesita el correo de la sesión.
       ===================================================== */

    public function consultarDatosVencimiento(
        int $idProducto
    ): ?array {
        $sql = "
            SELECT Tiene_FV, Conoce_FV
            FROM Productos
            WHERE Id_productos = ?
              AND Estado_producto = 1
            LIMIT 1
        ";

        $stmt = $this->conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception($this->conexion->error);
        }

        $stmt->bind_param("i", $idProducto);
        $stmt->execute();

        $resultado = $stmt->get_result();
        $producto = $resultado->fetch_assoc();

        $resultado->free();
        $stmt->close();

        return $producto ?: null;
    }

    /* =====================================================
       ACTUALIZAR CANTIDAD Y REGISTRAR LOTE
       Ya no necesita el correo de la sesión.
       ===================================================== */

    public function actualizarCantidadProducto(
        int $idProducto,
        string $fechaLlegada,
        int $cantidadNueva,
        ?string $lote,
        ?string $fechaVencimiento
    ): array {
        if ($cantidadNueva <= 0) {
            throw new Exception(
                'La cantidad debe ser mayor que cero.'
            );
        }

        $this->conexion->begin_transaction();

        try {
            $sql = "
                SELECT Cantidad_Producto, Tiene_FV, Conoce_FV
                FROM Productos
                WHERE Id_productos = ?
                  AND Estado_producto = 1
                FOR UPDATE
            ";

            $stmt = $this->conexion->prepare($sql);

            if (!$stmt) {
                throw new Exception($this->conexion->error);
            }

            $stmt->bind_param("i", $idProducto);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $producto = $resultado->fetch_assoc();

            $resultado->free();
            $stmt->close();

            if (!$producto) {
                throw new Exception(
                    'El producto no existe o está inactivo.'
                );
            }

            $tieneFV = (int) $producto['Tiene_FV'];
            $conoceFV = (int) $producto['Conoce_FV'];

            if ($tieneFV === 1 && $conoceFV === 1) {
                if (
                    trim((string) $lote) === '' ||
                    trim((string) $fechaVencimiento) === ''
                ) {
                    throw new Exception(
                        'Debes ingresar el lote y la fecha de vencimiento.'
                    );
                }

                $fecha = DateTime::createFromFormat(
                    '!Y-m-d',
                    $fechaVencimiento
                );

                if (
                    !$fecha ||
                    $fecha->format('Y-m-d') !== $fechaVencimiento
                ) {
                    throw new Exception(
                        'La fecha de vencimiento no es válida.'
                    );
                }

                if ($fechaVencimiento < $fechaLlegada) {
                    throw new Exception(
                        'La fecha de vencimiento no puede ser anterior a la fecha de llegada.'
                    );
                }
            }

            /* Sumar al stock existente. */
            $sqlActualizar = "
                UPDATE Productos
                SET Cantidad_Producto = Cantidad_Producto + ?
                WHERE Id_productos = ?
            ";

            $stmtActualizar = $this->conexion->prepare(
                $sqlActualizar
            );

            $stmtActualizar->bind_param(
                "ii",
                $cantidadNueva,
                $idProducto
            );

            if (!$stmtActualizar->execute()) {
                throw new Exception($stmtActualizar->error);
            }

            $stmtActualizar->close();

            /*
             * Registrar el lote cuando el producto maneja
             * fecha de vencimiento conocida.
             */
            if ($tieneFV === 1 && $conoceFV === 1) {
                $estadoLog = 1;
                $cantidadTexto = (string) $cantidadNueva;

                $sqlLog = "
                    INSERT INTO Log_producto (
                        Fecha_llegada_producto,
                        Cantidad_llegada_producto,
                        Lote_producto,
                        Fecha_vencimiento,
                        Producto_id_producto,
                        Estado_log_producto
                    ) VALUES (?, ?, ?, ?, ?, ?)
                ";

                $stmtLog = $this->conexion->prepare($sqlLog);

                $stmtLog->bind_param(
                    "ssssii",
                    $fechaLlegada,
                    $cantidadTexto,
                    $lote,
                    $fechaVencimiento,
                    $idProducto,
                    $estadoLog
                );

                if (!$stmtLog->execute()) {
                    throw new Exception($stmtLog->error);
                }

                $stmtLog->close();
            }

            $this->conexion->commit();

            return [
                'resultado' => 1,
                'mensaje' => 'La cantidad del producto se actualizó correctamente.'
            ];

        } catch (Throwable $e) {
            $this->conexion->rollback();
            error_log(
                'Error al actualizar cantidad: ' . $e->getMessage()
            );

            throw $e;
        }
    }
    /* =====================================================
   CONSULTAR INFORMACIÓN COMPLETA DEL PRODUCTO
   ===================================================== */

public function obtenerDetalleVista(int $idProducto): ?array
{
    $sql = "
        SELECT
            Id_productos,
            Nombre_producto,
            Codigo_producto,
            Valor_unitario_producto,
            Cantidad_Producto,
            Unidad_medida_producto,
            Tiene_FV,
            Conoce_FV,
            Fecha_vencimiento,
            Foto_producto,
            Cantidad_minima,
            Creacion_registro,
            Estado_producto
        FROM Productos
        WHERE Id_productos = ?
        LIMIT 1
    ";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception($this->conexion->error);
    }

    $stmt->bind_param("i", $idProducto);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $producto = $resultado->fetch_assoc();

    $resultado->free();
    $stmt->close();

    return $producto ?: null;
}


/* =====================================================
   CONSULTAR LOTES Y VENCIMIENTOS DEL PRODUCTO
   ===================================================== */

public function obtenerLotesVista(int $idProducto): array
{
    $sql = "
        SELECT
            Id_log_producto,
            Fecha_llegada_producto,
            Cantidad_llegada_producto,
            Lote_producto,
            Fecha_vencimiento
        FROM Log_producto
        WHERE Producto_id_producto = ?
          AND Estado_log_producto = 1
          AND Fecha_vencimiento IS NOT NULL
        ORDER BY Fecha_vencimiento ASC
    ";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception($this->conexion->error);
    }

    $stmt->bind_param("i", $idProducto);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $lotes = $resultado->fetch_all(MYSQLI_ASSOC);

    $resultado->free();
    $stmt->close();

    return $lotes;
}
    public function contarProductosBajoStock($correo)
    {
        try {
            $sql = "CALL C_CONTEO_STOCK_BAJO(?)";

            $stmt = $this->conexion->prepare($sql);

            if (!$stmt) {
                throw new Exception(
                    "Error al preparar la consulta: " .
                    $this->conexion->error
                );
            }

            $stmt->bind_param("s", $correo);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $fila = $resultado->fetch_assoc();

            $total = (int) ($fila['Productos_bajo_stock'] ?? 0);

            $resultado->free();
            $stmt->close();

            // Liberar posibles resultados pendientes del procedimiento.
            while (
                $this->conexion->more_results() &&
                $this->conexion->next_result()
            ) {
                $pendiente = $this->conexion->store_result();

                if ($pendiente instanceof mysqli_result) {
                    $pendiente->free();
                }
            }

            return $total;

        } catch (Throwable $e) {
            error_log(
                "Error en contarProductosBajoStock: " .
                $e->getMessage()
            );

            throw $e;
        }
    }
        public function obtenerFechasVencimiento($correo)
    {
        $sql = "SELECT
                    p.Nombre_producto,
                    l.Lote_producto,
                    COALESCE(l.Fecha_vencimiento, p.Fecha_vencimiento)
                        AS Fecha_vencimiento
                FROM Productos p
                INNER JOIN Usuarios u
                    ON u.Id_usuario = p.Usuario_id_usuario
                LEFT JOIN Log_producto l
                    ON l.Producto_id_producto = p.Id_productos
                   AND l.Estado_log_producto = 1
                   AND l.Fecha_vencimiento IS NOT NULL
                WHERE u.Email_usuario = ?
                  AND u.Estado_usuario = 1
                  AND p.Estado_producto = 1
                  AND COALESCE(l.Fecha_vencimiento, p.Fecha_vencimiento)
                      IS NOT NULL
                ORDER BY Fecha_vencimiento ASC";

        $stmt = $this->conexion->prepare($sql);
        if (!$stmt) {
            throw new Exception($this->conexion->error);
        }

        $stmt->bind_param('s', $correo);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $productos = $resultado->fetch_all(MYSQLI_ASSOC);
        $resultado->free();
        $stmt->close();

        return $productos;
    }
}
?>
