function mostrarAlerta() {
    Swal.fire({
        title: "¡Registro exitoso!",
        text: "Tu cuenta fue creada correctamente.",
        icon: "success",
        confirmButtonText: "OK"
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "login.html";
        }
    });
}