
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



public function consultarUsuarioPorEmail($email)
{
    $sql = "SELECT Id_usuario, Nombre_usuario, Email_usuario, Descripcion_usuario, Foto_usuario
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

public function cambiarContrasena($email, $contrasenaAnterior, $nuevaContrasena)
{
    // Consultar la contraseña almacenada del usuario
    $sql = "SELECT Contrasena_usuario
            FROM Usuarios
            WHERE Email_usuario = ?
            LIMIT 1";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("No se pudo preparar la consulta.");
    }

    $stmt->bind_param("s", $email);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    $stmt->close();

    if (!$usuario) {
        return "usuario_no_encontrado";
    }

    // Verificar la contraseña anterior
    if (!password_verify(
        $contrasenaAnterior,
        $usuario['Contrasena_usuario']
    )) {
        return "contrasena_incorrecta";
    }

    // Generar el hash seguro de la nueva contraseña
    $hash = password_hash($nuevaContrasena, PASSWORD_DEFAULT);

    if ($hash === false) {
        throw new Exception("No se pudo proteger la nueva contraseña.");
    }

    // Actualizar la contraseña en la base de datos
    $sql = "UPDATE Usuarios
            SET Contrasena_usuario = ?
            WHERE Email_usuario = ?
            LIMIT 1";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("No se pudo preparar la actualización.");
    }

    $stmt->bind_param("ss", $hash, $email);
    $stmt->execute();

    $actualizada = $stmt->affected_rows;
    $stmt->close();

    return $actualizada === 1
        ? "correcto"
        : "sin_cambios";
}


/**
 * Verifica que el usuario corresponda a la sesión iniciada.
 */
public function verificarUsuarioSesion($id, $email)
{
    $sql = "SELECT Id_usuario
            FROM Usuarios
            WHERE Id_usuario = ?
              AND Email_usuario = ?
            LIMIT 1";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al preparar la consulta del usuario.");
    }

    $stmt->bind_param("is", $id, $email);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $usuario = $resultado->fetch_assoc();

    $stmt->close();

    return $usuario !== null;
}


/**
 * Actualiza la información del perfil del usuario.
 *
 * $id: ID del usuario.
 * $emailSesion: correo electrónico de la sesión actual.
 * $nombre: nuevo nombre.
 * $email: nuevo correo electrónico.
 * $descripcion: descripción del perfil.
 * $foto: nueva ruta de fotografía o null si no cambia.
 */
public function actualizarInformacionUsuario(
    $id,
    $emailSesion,
    $nombre,
    $email,
    $descripcion,
    $foto = null
) {
    // Verificar que el ID pertenezca a la sesión actual
    if (!$this->verificarUsuarioSesion($id, $emailSesion)) {
        return "no_autorizado";
    }

    // Comprobar si el correo nuevo pertenece a otro usuario
    $sql = "SELECT Id_usuario
            FROM Usuarios
            WHERE Email_usuario = ?
              AND Id_usuario <> ?
            LIMIT 1";

    $stmt = $this->conexion->prepare($sql);

    if (!$stmt) {
        throw new Exception("Error al comprobar el correo electrónico.");
    }

    $stmt->bind_param("si", $email, $id);
    $stmt->execute();

    $resultado = $stmt->get_result();
    $correoExistente = $resultado->fetch_assoc();

    $stmt->close();

    if ($correoExistente) {
        return "correo_existente";
    }

    // Si no se envía una nueva foto, conservar la actual
    if ($foto !== null) {
        $sql = "UPDATE Usuarios
                SET Nombre_usuario = ?,
                    Email_usuario = ?,
                    Descripcion_usuario = ?,
                    Foto_usuario = ?
                WHERE Id_usuario = ?
                  AND Email_usuario = ?
                LIMIT 1";

        $stmt = $this->conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception("Error al preparar la actualización del perfil.");
        }

        $stmt->bind_param(
            "ssssis",
            $nombre,
            $email,
            $descripcion,
            $foto,
            $id,
            $emailSesion
        );

    } else {
        $sql = "UPDATE Usuarios
                SET Nombre_usuario = ?,
                    Email_usuario = ?,
                    Descripcion_usuario = ?
                WHERE Id_usuario = ?
                  AND Email_usuario = ?
                LIMIT 1";

        $stmt = $this->conexion->prepare($sql);

        if (!$stmt) {
            throw new Exception("Error al preparar la actualización del perfil.");
        }

        $stmt->bind_param(
            "sssis",
            $nombre,
            $email,
            $descripcion,
            $id,
            $emailSesion
        );
    }

    $stmt->execute();

    // affected_rows puede ser 0 si los datos ya eran iguales
    $error = $stmt->errno;
    $stmt->close();

    if ($error !== 0) {
        throw new Exception("No se pudo actualizar el perfil.");
    }

    return "correcto";
}


}
?>
