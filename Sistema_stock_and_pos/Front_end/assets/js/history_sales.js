"use strict";

$(document).ready(function () {
    const table = $("#table-1").DataTable();

    function escapar(valor) {
        return $("<div>").text(valor == null ? "" : String(valor)).html();
    }

    function formatearFecha(fecha) {
        return String(fecha || "")
            .slice(0, 16)
            .replace(/^([0-9]{4})-([0-9]{2})-([0-9]{2})/, "$1/$2/$3");
    }

    async function cargarHistorial() {
        try {
            const respuesta = await fetch(
                "../Back_end/Controlador/Historial_ventas.php",
                { credentials: "same-origin" }
            );
            const datos = await respuesta.json();

            if (!respuesta.ok || datos.resultado !== 1) {
                throw new Error(datos.mensaje || "No se pudo cargar el historial.");
            }

            const filas = datos.ventas.map(function (venta, indice) {
                const devolucion = venta.accion === "Devolucion";
                const operacion = devolucion ? "Devolucion" : "Venta";
                const claseOperacion = devolucion ? "badge-warning" : "badge-info";
                const estado = venta.enviada
                    ? '<span class="badge badge-success">Factura enviada</span>'
                    : '<span class="badge badge-secondary">Factura sin enviar</span>';
                const enlace = '<a href="send_bill.html?id=' +
                    encodeURIComponent(Number(venta.id)) +
                    '" class="btn btn-light"><i class="fas fa-eye"></i> Ver factura</a>';

                return [
                    '<span class="text-center">' + (indice + 1) + '</span>',
                    escapar(venta.factura),
                    '<span class="badge ' + claseOperacion + '">' + operacion + '</span>',
                    escapar(formatearFecha(venta.fecha)),
                    estado,
                    enlace
                ];
            });

            table.clear().rows.add(filas).draw();
        } catch (error) {
            console.error("Error al cargar el historial de ventas:", error);
            window.alert(error.message || "No se pudo cargar el historial de ventas.");
        }
    }

    cargarHistorial();
});