
document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ====================================================== */

    const togglePassword = document.getElementById("togglePassword");
    const password = document.getElementById("password");

    if (togglePassword && password) {
        togglePassword.addEventListener("click", function () {

            const icon = this.querySelector("i");

            if (password.type === "password") {
                password.type = "text";

                if (icon) {
                    icon.classList.remove("fa-eye");
                    icon.classList.add("fa-eye-slash");
                }

                this.setAttribute("aria-label", "Ocultar contraseña");

            } else {
                password.type = "password";

                if (icon) {
                    icon.classList.remove("fa-eye-slash");
                    icon.classList.add("fa-eye");
                }

                this.setAttribute("aria-label", "Mostrar contraseña");
            }
        });
    }


    /* =====================================================
       ELEMENTOS DEL FORMULARIO
    ====================================================== */

    const loginForm = document.getElementById("loginForm");
    const loginButton = document.getElementById("loginButton");
    const buttonText = document.getElementById("buttonText");
    const buttonIcon = document.getElementById("buttonIcon");

    if (!loginForm || !loginButton) {
        console.error("No se encontró el formulario o botón del login.");
        return;
    }


    /* =====================================================
       NOTIFICACIONES IZIToast
    ====================================================== */

    function notificarError(mensaje) {

        if (typeof iziToast !== "undefined") {
            iziToast.error({
                title: "Error",
                message: mensaje,
                position: "bottomRight",
                timeout: 4000,
                close: true,
                progressBar: true
            });
        } else {
            console.error("iziToast no está cargado:", mensaje);
        }
    }


    /* =====================================================
       FORMULARIO DE INICIO DE SESIÓN
    ====================================================== */

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        if (loginButton.disabled) {
            return;
        }

        // Guardar el estado original del botón.
        const textoOriginal = buttonText
            ? buttonText.textContent
            : loginButton.textContent;

        const iconoOriginal = buttonIcon
            ? buttonIcon.className
            : "";

        const fondoOriginal = loginButton.style.background;

        // Mostrar estado de carga.
        loginButton.disabled = true;

        if (buttonText) {
            buttonText.textContent = "Verificando...";
        }

        if (buttonIcon) {
            buttonIcon.className = "fas fa-spinner fa-spin";
        }

        try {

            // Enviar las credenciales al controlador PHP.
            const respuesta = await fetch(loginForm.action, {
                method: "POST",
                body: new FormData(loginForm),
                headers: {
                    "Accept": "application/json"
                },
                credentials: "same-origin"
            });

            // Leer la respuesta sin navegar a Login.php.
            const textoRespuesta = await respuesta.text();

            let datos;

            try {
                datos = JSON.parse(textoRespuesta);
            } catch (error) {
                console.error(
                    "Respuesta no válida del servidor:",
                    textoRespuesta
                );

                notificarError(
                    "Error al procesar la respuesta del servidor."
                );

                return;
            }

            // Credenciales incorrectas, cuenta inactiva u otro error.
            if (!respuesta.ok || Number(datos.resultado) !== 1) {
                notificarError(
                    datos.mensaje || "Credenciales inválidas."
                );

                return;
            }

            // Acceso correcto.
            if (buttonText) {
                buttonText.textContent = "Acceso correcto";
            }

            if (buttonIcon) {
                buttonIcon.className = "fas fa-check";
            }

            loginButton.style.background =
                "linear-gradient(135deg, #3d9970, #26734d)";

            // Ir directamente a Main.html, sin alertas de éxito.
            window.location.replace("Main.html");

        } catch (error) {

            console.error("Error durante el inicio de sesión:", error);

            notificarError(
                "No fue posible conectar con el servidor. Intenta nuevamente."
            );

        } finally {

            // Restaurar el botón para permitir otro intento.
            loginButton.disabled = false;

            if (buttonText) {
                buttonText.textContent = textoOriginal;
            }

            if (buttonIcon) {
                buttonIcon.className = iconoOriginal;
            }

            loginButton.style.background = fondoOriginal;
        }
    });

});
