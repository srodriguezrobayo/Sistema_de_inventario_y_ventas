
<?php

require_once __DIR__ . '/conexion.php';

class UsuarioModel
{
    private $conexion;

    public function __construct()
    {
        global $con;
        $this->conexion = $con;
    }

    public function registrarUsuario(
        $nombre,
        $email,
        $contrasena
    ) {
        $sql = "CALL I_Usuario(?, ?, ?)";

        $consulta = $this->conexion->prepare($sql);

        if (!$consulta) {
            throw new Exception(
                "Error al preparar el registro: " .
                $this->conexion->error
            );
        }

        $consulta->bind_param(
            "sss",
            $nombre,
            $email,
            $contrasena
        );

        if (!$consulta->execute()) {
            $mensaje = $consulta->error;
            $consulta->close();

            throw new Exception($mensaje);
        }

        // Obtener el resultado del procedimiento almacenado
        $resultado = $consulta->get_result();
        $datos = $resultado
            ? $resultado->fetch_assoc()
            : null;

        if ($resultado) {
            $resultado->free();
        }

        $consulta->close();

        // Liberar posibles resultados pendientes del CALL
        while ($this->conexion->more_results()) {
            if (!$this->conexion->next_result()) {
                break;
            }

            $pendiente = $this->conexion->store_result();

            if ($pendiente instanceof mysqli_result) {
                $pendiente->free();
            }
        }

        return $datos;
    }


public function buscarUsuarioPorEmail($email)
{
    // Ajusta $this->conexion si tu conexión usa otro nombre.
    $conexion = $this->conexion;

    $sql = "SELECT
                Nombre_usuario,
                Email_usuario,
                Contrasena_usuario,
                Estado_usuario
            FROM Usuarios
            WHERE Email_usuario = ?
            LIMIT 1";

    $consulta = $conexion->prepare($sql);
    $consulta->bind_param("s", $email);
    $consulta->execute();

    $resultado = $consulta->get_result();
    $usuario = $resultado->fetch_assoc();

    $consulta->close();

    return $usuario ?: null;
}


public function buscarUsuarioParaRestablecer($email)
{
    $sql = "SELECT Email_usuario, Estado_usuario
            FROM Usuarios
            WHERE Email_usuario = ?
            LIMIT 1";

    $stmt = $this->conexion->prepare($sql);
    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    $stmt->close();

    return $usuario ?: null;
}

public function actualizarContrasena($email, $hash)
{
    $sql = "UPDATE Usuarios
            SET Contrasena_usuario = ?
            WHERE Email_usuario = ?
              AND Estado_usuario = 1";

    $stmt = $this->conexion->prepare($sql);
    $stmt->bind_param("ss", $hash, $email);

    $ejecutado = $stmt->execute();
    $filasAfectadas = $stmt->affected_rows;

    $stmt->close();

    return $ejecutado && $filasAfectadas > 0;
}


}
?>
