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

"use strict";

const URL_DEJAR_PRODUCTO =
    "/Sistema_Stock_And_Pos/Back_end/Controlador/Dejar_producto.php";


async function AlertaDejarProducto(idProducto, boton = null) {

    if (!idProducto || !Number.isInteger(Number(idProducto))) {
        Swal.fire({
            title: "Error",
            text: "No se pudo identificar el producto.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });

        return;
    }

    const confirmacion = await Swal.fire({
        title: "¿Está seguro?",
        text: "¿Seguro que desea dejar de vender este producto?",
        icon: "question",
        showCancelButton: true,
        confirmButtonColor: "#30d638",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí, seguro",
        cancelButtonText: "No, cancelar"
    });

    // Si cancela, no se modifica nada.
    if (!confirmacion.isConfirmed) {
        return;
    }

    try {
        const datos = new FormData();

        datos.append("id_producto", idProducto);

        const respuesta = await fetch(URL_DEJAR_PRODUCTO, {
            method: "POST",
            body: datos
        });

        const resultado = await respuesta.json();

        if (!respuesta.ok || Number(resultado.resultado) !== 1) {
            await Swal.fire({
                title: "No se pudo actualizar",
                text: resultado.mensaje ||
                    "No fue posible cambiar el estado del producto.",
                icon: "error",
                confirmButtonText: "Aceptar",
                confirmButtonColor: "#30d638",
            });

            return;
        }

        // Actualizar inmediatamente el estado del botón, si existe.
        if (boton) {
            boton.dataset.estadoProducto = "0";

            const fila = boton.closest("tr");

            if (fila) {
                fila.dataset.estadoProducto = "0";
            }
        }

        await Swal.fire({
            title: "¡Producto desactivado!",
            text: resultado.mensaje ||
                "Se ha quitado el producto de tu inventario.",
            icon: "success",
            confirmButtonText: "Aceptar",
            confirmButtonColor: "#30d638",
        });

        // Recargar después de cerrar la alerta de éxito.
        // Redirigir al inventario después de cerrar la alerta.
        window.location.href = "/Sistema_Stock_And_Pos/Front_end/stock.html";

    } catch (error) {
        console.error("Error al desactivar producto:", error);

        Swal.fire({
            title: "Error",
            text: "No fue posible conectar con el servidor.",
            icon: "error",
            confirmButtonText: "Aceptar"
        });
    }
}
