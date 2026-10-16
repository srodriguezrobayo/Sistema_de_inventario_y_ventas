<?php

require_once __DIR__ . '/conexion.php';

class Unidad_medidaModel
{
    private $conexion;

    public function __construct()
    {
        global $con;
        $this->conexion = $con;
    }

public function ConsultarUnidades()
{
    $sql = "CALL C_Unidad_Medida()";

    $consulta = $this->conexion->prepare($sql);

    if (!$consulta) {
        throw new Exception(
            "Error al preparar la consulta: " .
            $this->conexion->error
        );
    }

    if (!$consulta->execute()) {
        $error = $consulta->error;
        $consulta->close();

        throw new Exception(
            "Error al ejecutar la consulta: " . $error
        );
    }

    $resultado = $consulta->get_result();

    if ($resultado === false) {
        $error = $consulta->error;
        $consulta->close();

        throw new Exception(
            "Error al obtener los resultados: " . $error
        );
    }

    $unidades = $resultado->fetch_all(MYSQLI_ASSOC);
    $resultado->free();

    // Limpiar resultados pendientes del procedimiento almacenado.
    while ($consulta->more_results()) {
        if (!$consulta->next_result()) {
            break;
        }

        $pendiente = $consulta->get_result();

        if ($pendiente instanceof mysqli_result) {
            $pendiente->free();
        }
    }

    $consulta->close();

    return $unidades;
}

}
?>