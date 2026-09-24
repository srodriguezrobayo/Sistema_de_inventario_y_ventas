function mostrarAlerta() {
    Swal.fire({
        title: "¡Registro exitoso!",
        text: "Tu cuenta fue creada correctamente.",
        icon: "success",
        confirmButtonText: "OK",
        confirmButtonColor: '#28a745'
    }).then((result) => {
        if (result.isConfirmed) {
            window.location.href = "login.html";
        }
    });
}

function AlertaDejarProducto() {
    Swal.fire({
        title: "¿Esta seguro?",
        text: "¿Seguro que desea dejar de vender este producto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#30d638",
        cancelButtonColor: "#d33",
        confirmButtonText: "Si, seguro",
        cancelButtonText: "No, cancelar"
    }).then((result) => {
        if (result.isConfirmed) Swal.fire({
            title: "Bajado",
            text: "Se ha quitado el producto de tu inventario",
            icon: "success"
        });
    });
}