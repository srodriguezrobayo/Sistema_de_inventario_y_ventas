document.addEventListener("DOMContentLoaded", function () {


    /* =====================================================
       MOSTRAR / OCULTAR CONTRASEÑA
    ====================================================== */

    const togglePassword =
        document.getElementById("togglePassword");

    const password =
        document.getElementById("password");


    togglePassword.addEventListener("click", function () {

        const icon =
            this.querySelector("i");


        if (password.type === "password") {

            password.type = "text";

            icon.classList.remove("fa-eye");

            icon.classList.add("fa-eye-slash");

        } else {

            password.type = "password";

            icon.classList.remove("fa-eye-slash");

            icon.classList.add("fa-eye");
        }

    });


    /* =====================================================
       FORMULARIO
    ====================================================== */

    const loginForm =
        document.getElementById("loginForm");

    const loginButton =
        document.getElementById("loginButton");

    const buttonText =
        document.getElementById("buttonText");

    const buttonIcon =
        document.getElementById("buttonIcon");


    loginForm.addEventListener("submit", function (event) {

        event.preventDefault();


        /* ================================================
           ESTADO DE CARGA
        ================================================= */

        loginButton.disabled = true;

        buttonText.innerHTML =
            "Verificando...";

        buttonIcon.className =
            "fa-solid fa-spinner fa-spin";


        /*
         * Aquí posteriormente puedes colocar
         * tu fetch / AJAX hacia el backend.
         */


        setTimeout(function () {

            buttonText.innerHTML =
                "Acceso correcto";

            buttonIcon.className =
                "fa-solid fa-check";


            loginButton.style.background =
                "linear-gradient(135deg,#3d9970,#26734d)";


            /*
             * Aquí podrías redirigir:
             *
             * window.location.href = "principal.html";
             *
             */


            setTimeout(function () {

                loginButton.disabled = false;

                buttonText.innerHTML =
                    "Iniciar sesión";

                buttonIcon.className =
                    "fa-solid fa-arrow-right";

                loginButton.style.background =
                    "linear-gradient(135deg,#387276,#24565a)";

            }, 1800);


        }, 1200);

    });

});