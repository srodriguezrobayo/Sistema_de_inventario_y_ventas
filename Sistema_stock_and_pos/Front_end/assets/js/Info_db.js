
async function consultarUsuarioSesion() {
    try {
        const respuesta = await fetch(
            '../Back_end/Controlador/Consultar_usuario.php',
            {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const datos = await respuesta.json();

        // Verificar si la consulta fue exitosa
        if (!respuesta.ok || datos.resultado !== 1) {

            // Si la sesión expiró, regresar al login
            if (respuesta.status === 401) {
                window.location.replace('login.html');
                return;
            }

            if (typeof iziToast !== 'undefined') {
                iziToast.error({
                    title: 'Error',
                    message: datos.mensaje ||
                        'No fue posible consultar el usuario.',
                    position: 'bottomRight'
                });
            } else {
                console.error(datos.mensaje);
            }

            return;
        }

        // Información del usuario consultado
        const usuario = datos.usuario;

        // Elementos HTML
        const nombre = document.getElementById('nombreUsuario');
        const nombre_nb = document.getElementById('nombreUsuario_nb');
        const correo = document.getElementById('correoUsuario');
        const descripcion = document.getElementById('descripcionUsuario');
        const foto = document.getElementById('fotoUsuario');

        // Mostrar nombre en el saludo principal
        if (nombre) {
            nombre.textContent = usuario.Nombre_usuario ?? 'Usuario';
        }

        // Mostrar nombre en el menú superior
        if (nombre_nb) {
            nombre_nb.textContent = usuario.Nombre_usuario ?? 'Usuario';
        }

        // Mostrar correo electrónico
        if (correo) {
            if ('value' in correo) {
                correo.value = usuario.Email_usuario ?? '';
            } else {
                correo.textContent = usuario.Email_usuario ?? '';
            }
        }

        // Mostrar descripción del usuario
        if (descripcion) {
            if ('value' in descripcion) {
                descripcion.value = usuario.Descripcion_usuario ?? '';
            } else {
                descripcion.textContent =
                    usuario.Descripcion_usuario ?? '';
            }
        }

        // Mostrar fotografía del usuario
        if (foto && usuario.Foto_usuario) {
            foto.src = usuario.Foto_usuario;
        }

    } catch (error) {
        console.error('Error al consultar el usuario:', error);

        if (typeof iziToast !== 'undefined') {
            iziToast.error({
                title: 'Error',
                message: 'No se pudo conectar con el servidor.',
                position: 'bottomRight'
            });
        }
    }
}

// Ejecutar cuando el HTML esté cargado
document.addEventListener(
    'DOMContentLoaded',
    consultarUsuarioSesion
);
