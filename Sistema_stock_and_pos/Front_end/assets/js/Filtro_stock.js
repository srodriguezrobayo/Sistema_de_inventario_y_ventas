
"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const filtro = document.getElementById("filtroPocoStock");

    if (!filtro) {
        console.error("No se encontró el filtro de poco stock.");
        return;
    }

    // Guardar la función original de consulta.
    const urlProductos =
        "/Sistema_Stock_And_Pos/Back_end/Controlador/Filtrar_producto_bajo.php";

    filtro.addEventListener("change", async function () {
        if (!this.checked) {
            // Volver a mostrar todos los productos desde el controlador original.
            if (typeof consultarProductos === "function") {
                consultarProductos(1);
            }
            return;
        }

        try {
            filtro.disabled = true;

            const respuesta = await fetch(urlProductos, {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json"
                }
            });

            if (!respuesta.ok) {
                throw new Error("No se pudieron consultar los productos.");
            }

            const datos = await respuesta.json();

            if (Number(datos.resultado) !== 1) {
                throw new Error(
                    datos.mensaje || "Error al consultar el stock."
                );
            }

            if (typeof generarProductos !== "function") {
                throw new Error("No se encontró la función generarProductos().");
            }

            // Mostrar únicamente los productos con poco stock.
            generarProductos(datos.productos || []);

            // Ocultar la paginación mientras se muestran los resultados filtrados.
            const paginacion =
                document.getElementById("paginacionProductos");

            if (paginacion) {
                paginacion.innerHTML = "";
            }

        } catch (error) {
            console.error("Error en el filtro de stock:", error);
            alert(error.message);
            filtro.checked = false;

        } finally {
            filtro.disabled = false;
        }
    });
});
