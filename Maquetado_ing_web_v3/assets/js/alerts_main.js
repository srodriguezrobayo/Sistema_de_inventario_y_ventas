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

document.getElementById('formVenta').addEventListener('submit', function (e) {
    e.preventDefault(); // Evita que la página se recargue inmediatamente

    // Mostrar alerta de iziToast
    iziToast.success({
        title: '¡Éxito!',
        message: 'La venta se realizó con éxito',
        timeout: 2000 // Duración de la alerta en milisegundos
    });

    // Esperar 2 segundos antes de redireccionar
    setTimeout(function () {
        window.location.href = 'send_bill.html';
    }, 2000);
});