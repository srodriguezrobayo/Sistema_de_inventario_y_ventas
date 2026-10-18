"use strict";

document.addEventListener("DOMContentLoaded", function () {
    const parametros = new URLSearchParams(window.location.search);
    const id = Number(parametros.get("id"));
    const detalle = document.getElementById("facturaDetalle");
    const botonEnviar = document.getElementById("btnEnviar");
    let facturaActual = null;

    function moneda(valor, devolucion) {
        const formato = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        });
        const texto = formato.format(Number(valor) || 0);
        return devolucion && Number(valor) > 0 ? "-" + texto : texto;
    }

    function agregarCelda(fila, valor, clase) {
        const celda = document.createElement("td");
        if (clase) {
            celda.className = clase;
        }
        celda.textContent = valor;
        fila.appendChild(celda);
    }

    async function cargarFactura() {
        if (!Number.isInteger(id) || id < 1) {
            throw new Error("No se indico una factura valida.");
        }

        const respuesta = await fetch(
            "../Back_end/Controlador/Consultar_factura.php?id=" + encodeURIComponent(id),
            { credentials: "same-origin" }
        );
        const datos = await respuesta.json();

        if (!respuesta.ok || datos.resultado !== 1) {
            throw new Error(datos.mensaje || "No se pudo cargar la factura.");
        }

        facturaActual = datos.factura;
        const devolucion = facturaActual.accion === "Devolucion";
        document.getElementById("facturaCajero").textContent = facturaActual.cajero;
        document.getElementById("facturaNumero").textContent = facturaActual.numero;
        document.getElementById("facturaFecha").textContent =
            "Fecha expedicion factura: " + facturaActual.fecha;
        document.getElementById("facturaTotalLabel").textContent = devolucion
            ? "Total de devolucion:"
            : "Total a pagar:";
        const total = document.getElementById("facturaTotal");
        total.textContent = moneda(facturaActual.total, devolucion);
        total.classList.toggle("text-danger", devolucion);
        total.classList.toggle("text-success", !devolucion);

        detalle.replaceChildren();
        facturaActual.items.forEach(function (item) {
            const fila = document.createElement("tr");
            fila.className = "border-bottom";
            agregarCelda(fila, item.nombre, "font-weight-bold text-dark");
            agregarCelda(fila, String(item.cantidad), "text-center text-muted");
            agregarCelda(
                fila,
                moneda(item.precio, devolucion),
                "text-right text-muted"
            );
            agregarCelda(
                fila,
                moneda(item.subtotal, devolucion),
                "text-right font-weight-bold text-dark"
            );
            detalle.appendChild(fila);
        });

        if (facturaActual.items.length === 0) {
            const fila = document.createElement("tr");
            agregarCelda(fila, "Esta factura no tiene detalle de productos.", "text-muted");
            fila.firstElementChild.colSpan = 4;
            detalle.appendChild(fila);
        }
    }

    botonEnviar.addEventListener("click", async function () {
        if (!facturaActual) {
            return;
        }

        const resultado = await Swal.fire({
            title: "Enviar factura",
            text: "Ingresa el correo del cliente.",
            input: "email",
            inputValue: facturaActual.correo || "",
            inputPlaceholder: "correo@cliente.com",
            inputValidator: function (valor) {
                if (!valor || !valor.trim()) {
                    return "Ingresa un correo valido.";
                }
            },
            showCancelButton: true,
            confirmButtonText: "Enviar",
            cancelButtonText: "Cancelar",
            confirmButtonColor: "#28a745"
        });

        if (!resultado.isConfirmed) {
            return;
        }

        botonEnviar.disabled = true;
        try {
            const respuesta = await fetch(
                "../Back_end/Controlador/Reenviar_factura.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({ id: id, correo: resultado.value.trim() })
                }
            );
            const datos = await respuesta.json();

            if (!respuesta.ok || datos.resultado !== 1) {
                throw new Error(datos.mensaje || "No se pudo enviar la factura.");
            }

            facturaActual.correo = resultado.value.trim();
            await Swal.fire({
                icon: "success",
                title: "Factura enviada",
                text: datos.mensaje,
                confirmButtonColor: "#28a745"
            });
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "No se pudo enviar",
                text: error.message,
                confirmButtonColor: "#28a745"
            });
        } finally {
            botonEnviar.disabled = false;
        }
    });

    cargarFactura().catch(function (error) {
        console.error("Error al cargar factura:", error);
        Swal.fire({
            icon: "error",
            title: "No se pudo abrir la factura",
            text: error.message,
            confirmButtonText: "Volver al historial",
            allowOutsideClick: false
        }).then(function () {
            window.location.href = "History_sales.html";
        });
    });
});