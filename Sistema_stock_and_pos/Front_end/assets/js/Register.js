
document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ===================================================== */

    document.querySelectorAll(".password-toggle").forEach(button => {
        button.addEventListener("click", function () {
            const input = document.getElementById(
                this.getAttribute("data-target")
            );
            const icon = this.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.replace("fa-eye", "fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.replace("fa-eye-slash", "fa-eye");
            }
        });
    });

    /* =====================================================
       SEGURIDAD DE CONTRASEÑA
    ===================================================== */

    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const securityProgress = document.getElementById("securityProgress");
    const securityText = document.getElementById("securityText");

    password.addEventListener("input", function () {
        const value = this.value;
        let strength = 0;

        if (value.length >= 6) strength++;
        if (value.length >= 10) strength++;
        if (/[A-Z]/.test(value)) strength++;
        if (/[0-9]/.test(value)) strength++;
        if (/[^A-Za-z0-9]/.test(value)) strength++;

        if (value.length === 0) {
            securityProgress.style.width = "0%";
            securityText.textContent = "-";
        } else if (strength <= 2) {
            securityProgress.style.width = "30%";
            securityText.textContent = "Débil";
        } else if (strength <= 3) {
            securityProgress.style.width = "60%";
            securityText.textContent = "Media";
        } else {
            securityProgress.style.width = "100%";
            securityText.textContent = "Segura";
        }

        // Volver a comprobar la confirmación cuando cambia la contraseña
        validarConfirmacion();
    });

    /* =====================================================
       VALIDAR CONTRASEÑAS
    ===================================================== */

    function validarConfirmacion() {
        if (confirmPassword.value === "") {
            confirmPassword.style.borderColor = "#d8e0e1";
            return false;
        }

        const coincide = password.value === confirmPassword.value;

        confirmPassword.style.borderColor = coincide
            ? "#3d9970"
            : "#dc3545";

        return coincide;
    }

    confirmPassword.addEventListener("input", validarConfirmacion);

    /* =====================================================
       REGISTRO REAL MEDIANTE FETCH
    ===================================================== */

    const form = document.getElementById("registerForm");
    const button = document.getElementById("registerButton");
    const buttonText = document.getElementById("buttonText");

    form.addEventListener("submit", async function (event) {
        event.preventDefault();

        // Comprobar contraseñas
        if (password.value !== confirmPassword.value) {
            validarConfirmacion();
            confirmPassword.focus();

            Swal.fire({
                title: "Contraseñas diferentes",
                text: "Las contraseñas ingresadas no coinciden.",
                icon: "warning",
                confirmButtonText: "Entendido"
            });

            return;
        }

        // Comprobar aceptación de términos
        if (!document.getElementById("terms").checked) {
            Swal.fire({
                title: "Términos y condiciones",
                text: "Debes aceptar los términos y condiciones.",
                icon: "warning",
                confirmButtonText: "Entendido"
            });

            return;
        }

        // Evitar envíos repetidos
        button.disabled = true;
        buttonText.innerHTML =
            '<i class="fas fa-circle-notch fa-spin"></i> Creando cuenta...';

        try {
            const respuesta = await fetch(form.action, {
                method: "POST",
                body: new FormData(form),
                headers: {
                    "Accept": "application/json"
                }
            });

            const datos = await respuesta.json();

            if (!respuesta.ok) {
                throw new Error(
                    datos.mensaje || "No fue posible completar el registro."
                );
            }

            if (datos.resultado === 1) {
                await Swal.fire({
                    title: "¡Registro exitoso!",
                    text: datos.mensaje,
                    icon: "success",
                    confirmButtonText: "Ir al inicio de sesión",
                    confirmButtonColor: "#28a745",
                    allowOutsideClick: false
                });

                window.location.href = "login.html";
            } else {
                await Swal.fire({
                    title: "No se pudo registrar",
                    text: datos.mensaje ||
                        "No fue posible crear la cuenta.",
                    icon: "error",
                    confirmButtonText: "Entendido"
                });
            }

        } catch (error) {
            console.error("Error en el registro:", error);

            Swal.fire({
                title: "Error",
                text: error.message ||
                    "No fue posible conectar con el servidor.",
                icon: "error",
                confirmButtonText: "Entendido"
            });

        } finally {
            button.disabled = false;
            buttonText.textContent = "Crear mi cuenta";
        }
    });

});
