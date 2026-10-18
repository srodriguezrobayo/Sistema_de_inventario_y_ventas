
<?php

require_once __DIR__ . '/conexion.php';

class VentasModel
{
    private $conexion;

    public function __construct()
    {
        global $con;
        $this->conexion = $con;
    }

    public function obtenerTotalNetoHoy($correo)
    {
        $sql = "CALL C_suma_ventas_hoy(?)";

        $stmt = $this->conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception(
                "Error al preparar la consulta: " .
                $this->conexion->error
            );
        }

        try {
            $stmt->bind_param("s", $correo);
            $stmt->execute();

            $resultado = $stmt->get_result();
            $fila = $resultado->fetch_assoc();

            // SUM() devuelve NULL cuando no hay ventas hoy
            $total = (float) ($fila['Total_neto'] ?? 0);

            $resultado->free();
            $stmt->close();

            // Limpiar posibles resultados pendientes del procedimiento
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
            if ($stmt instanceof mysqli_stmt) {
                $stmt->close();
            }

            throw $e;
        }
    }
     public function obtenerProductosVendidos($usuario)
    {
        $sql = "SELECT v.Descripcion_venta, v.Accion_venta
                FROM Ventas v
                INNER JOIN Usuarios u
                    ON u.Id_usuario = v.Usuario_id_usuario
                WHERE u.Email_usuario = ?
                  AND v.Estado_venta = 1
                  AND v.Accion_venta IN ('Venta', 'Devolucion')
                  AND v.Creacion_venta >= DATE_FORMAT(
                      CURRENT_DATE,
                      '%Y-%m-01'
                  )
                  AND v.Creacion_venta < DATE_FORMAT(
                      CURRENT_DATE + INTERVAL 1 MONTH,
                      '%Y-%m-01'
                  )";

        $stmt = $this->conexion->prepare($sql);
        if (!$stmt) {
            throw new Exception($this->conexion->error);
        }

        $stmt->bind_param('s', $usuario);
        $stmt->execute();
        $resultado = $stmt->get_result();
        $totales = [];

        while ($fila = $resultado->fetch_assoc()) {
            $detalle = json_decode($fila['Descripcion_venta'], true);
            if (!is_array($detalle) || !is_array($detalle['items'] ?? null)) {
                continue;
            }

            $signo = $fila['Accion_venta'] === 'Devolucion' ? -1 : 1;
            foreach ($detalle['items'] as $item) {
                $nombre = trim((string) ($item['nombre'] ?? ''));
                $cantidad = filter_var(
                    $item['cantidad'] ?? null,
                    FILTER_VALIDATE_INT
                );

                if ($nombre === '' || $cantidad === false || $cantidad < 1) {
                    continue;
                }

                $idProducto = (string) ($item['id'] ?? '');
                $clave = $idProducto !== ''
                    ? 'id:' . $idProducto
                    : 'nombre:' . strtolower($nombre);

                if (!isset($totales[$clave])) {
                    $totales[$clave] = [
                        'Nombre_producto' => $nombre,
                        'Codigo_producto' => (string) (
                            $item['codigo'] ?? $idProducto
                        ),
                        'Cantidad_salida' => 0
                    ];
                }

                $totales[$clave]['Cantidad_salida'] += $signo * $cantidad;
            }
        }

        $resultado->free();
        $stmt->close();

        return array_values($totales);
    }
}
