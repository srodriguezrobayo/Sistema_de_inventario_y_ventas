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


            this.setAttribute(
                "aria-label",
                "Ocultar contraseña"
            );


        } else {

            password.type = "password";


            icon.classList.remove("fa-eye-slash");


            icon.classList.add("fa-eye");


            this.setAttribute(
                "aria-label",
                "Mostrar contraseña"
            );

        }

    });



    /* =====================================================
       FORMULARIO LOGIN
    ====================================================== */

    const loginForm =
        document.getElementById("loginForm");


    const loginButton =
        document.getElementById("loginButton");


    const buttonText =
        document.getElementById("buttonText");


    const buttonIcon =
        document.getElementById("buttonIcon");



    loginForm.addEventListener(
        "submit",
        function (event) {

            event.preventDefault();


            /* =============================================
               ESTADO DE CARGA
            ============================================== */

            loginButton.disabled = true;


            buttonText.innerHTML =
                "Verificando...";


            buttonIcon.className =
                "fas fa-spinner fa-spin";



            /*
             * =================================================
             * AQUÍ PUEDES PONER TU FETCH / AJAX
             * =================================================
             *
             * Ejemplo:
             *
             * fetch("login.php", {
             *
             *     method: "POST",
             *
             *     body: new FormData(loginForm)
             *
             * });
             *
             */



            /* =============================================
               SIMULACIÓN DE LOGIN
            ============================================== */

            setTimeout(function () {


                buttonText.innerHTML =
                    "Acceso correcto";


                buttonIcon.className =
                    "fas fa-check";


                loginButton.style.background =
                    "linear-gradient(135deg,#3d9970,#26734d)";



                /* =========================================
                   RESTAURAR BOTÓN
                ========================================== */

                setTimeout(function () {


                    loginButton.disabled = false;


                    buttonText.innerHTML =
                        "Iniciar sesión";


                    buttonIcon.className =
                        "fas fa-arrow-right";


                    loginButton.style.background =
                        "linear-gradient(135deg,#387276,#24565a)";


                }, 1800);


            }, 1200);

        }
    );

});