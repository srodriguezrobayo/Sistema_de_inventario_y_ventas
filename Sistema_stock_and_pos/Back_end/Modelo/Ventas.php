
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
        $sql = "CALL C_graficaproductos_vendidos(?)";

        $stmt = $this->conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception(
                "Error al preparar la consulta: " .
                $this->conexion->error
            );
        }

        $stmt->bind_param("s", $usuario);

        if (!$stmt->execute()) {
            $error = $stmt->error;
            $stmt->close();

            throw new Exception(
                "Error al ejecutar el procedimiento: " . $error
            );
        }

        $resultado = $stmt->get_result();
        $productos = [];

        if ($resultado) {
            while ($fila = $resultado->fetch_assoc()) {
                $productos[] = [
                    "Nombre_producto" => $fila["Nombre_producto"],
                    "Codigo_producto" => $fila["Codigo_producto"],
                    "Cantidad_salida" => (int) $fila["Cantidad_salida"]
                ];
            }

            $resultado->free();
        }

        $stmt->close();

        return $productos;
    }
}
