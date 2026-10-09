document.addEventListener("DOMContentLoaded", function () {

    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ===================================================== */

    const passwordButtons =
        document.querySelectorAll(".password-toggle");

    passwordButtons.forEach(button => {

        button.addEventListener("click", function () {

            const targetId =
                this.getAttribute("data-target");

            const input =
                document.getElementById(targetId);

            const icon =
                this.querySelector("i");

            if (input.type === "password") {

                input.type = "text";

                icon.classList.remove("fa-eye");

                icon.classList.add("fa-eye-slash");

            } else {

                input.type = "password";

                icon.classList.remove("fa-eye-slash");

                icon.classList.add("fa-eye");
            }

        });

    });


    /* =====================================================
       SEGURIDAD DE CONTRASEÑA
    ===================================================== */

    const password =
        document.getElementById("password");

    const securityProgress =
        document.getElementById("securityProgress");

    const securityText =
        document.getElementById("securityText");


    password.addEventListener("input", function () {

        const value = this.value;

        let strength = 0;

        if (value.length >= 6) {
            strength++;
        }

        if (value.length >= 10) {
            strength++;
        }

        if (/[A-Z]/.test(value)) {
            strength++;
        }

        if (/[0-9]/.test(value)) {
            strength++;
        }

        if (/[^A-Za-z0-9]/.test(value)) {
            strength++;
        }


        if (value.length === 0) {

            securityProgress.style.width = "0%";

            securityText.textContent = "-";

        }

        else if (strength <= 2) {

            securityProgress.style.width = "30%";

            securityText.textContent = "Débil";

        }

        else if (strength <= 3) {

            securityProgress.style.width = "60%";

            securityText.textContent = "Media";

        }

        else {

            securityProgress.style.width = "100%";

            securityText.textContent = "Segura";

        }

    });


    /* =====================================================
       VALIDAR CONTRASEÑAS
    ===================================================== */

    const confirmPassword =
        document.getElementById("confirmPassword");

    confirmPassword.addEventListener("input", function () {

        if (
            this.value !== password.value &&
            this.value.length > 0
        ) {

            this.style.borderColor = "#dc3545";

        } else {

            this.style.borderColor = "#d8e0e1";

        }

    });


    /* =====================================================
       FORMULARIO
    ===================================================== */

    const form =
        document.getElementById("registerForm");

    const button =
        document.getElementById("registerButton");

    const buttonText =
        document.getElementById("buttonText");


    form.addEventListener("submit", function (event) {

        event.preventDefault();


        /* comprobar contraseñas */

        if (password.value !== confirmPassword.value) {

            confirmPassword.focus();

            confirmPassword.style.borderColor = "#dc3545";

            return;
        }


        /* animación del botón */

        button.disabled = true;

        buttonText.innerHTML =
            '<i class="fa-solid fa-spinner fa-spin"></i> Creando cuenta...';


        /*
         * Aquí posteriormente puedes colocar
         * tu petición AJAX / fetch hacia tu backend.
         */

        setTimeout(function () {

            buttonText.innerHTML =
                '<i class="fa-solid fa-check"></i> Cuenta creada';

            button.style.background =
                "linear-gradient(135deg,#3d9970,#26734d)";


            setTimeout(function () {

                form.reset();

                securityProgress.style.width = "0%";

                securityText.textContent = "-";

                button.disabled = false;

                buttonText.textContent =
                    "Crear mi cuenta";

                button.style.background =
                    "linear-gradient(135deg,#387276,#24565a)";

            }, 1800);

        }, 1500);

    });

});