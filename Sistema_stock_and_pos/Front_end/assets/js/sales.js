
"use strict";

$(document).ready(function () {

    // =====================================================
    // 1. INICIALIZAR SELECT2
    // =====================================================

    $(".select2-enable").select2({
        placeholder: "Buscar o seleccionar producto...",
        allowClear: true,
        width: "100%"
    });

    let carrito = [];

    // =====================================================
    // 2. IDENTIFICAR LA OPERACIÓN
    // =====================================================

    function esDevolucion() {
        return $('input[name="value"]:checked').val() === "Devolucion";
    }

    function formatearMoneda(valor) {
        const numero = Number(valor) || 0;
        const importe = Math.abs(numero).toFixed(2);

        if (esDevolucion() && numero !== 0) {
            return "-$" + importe;
        }

        return "$" + importe;
    }

    // =====================================================
    // 3. ACTUALIZAR PRECIO UNITARIO
    // =====================================================

    $("#selectProducto").on("change", function () {

        const opcion = $(this).find("option:selected");
        const precio = parseFloat(opcion.data("precio")) || 0;

        $("#precioUnitario").text(formatearMoneda(precio));
    });

    // =====================================================
    // 4. CAMBIAR EL BOTÓN SEGÚN LA OPERACIÓN
    // =====================================================

    function actualizarTipoOperacion() {

        if (esDevolucion()) {

            $("#btnCheckout").html(
                '<i class="fas fa-undo me-1"></i> Realizar devolución'
            );

            $(".summary-title").html(
                '<i class="fas fa-receipt me-2"></i>Resumen de devolución'
            );

            $(".total-price-label").text("Total de devolución:");

        } else {

            $("#btnCheckout").html(
                '<i class="fas fa-check-circle me-1"></i> Realizar Venta'
            );

            $(".summary-title").html(
                '<i class="fas fa-receipt me-2"></i>Resumen de Cobro'
            );

            $(".total-price-label").text("Total a pagar:");
        }

        actualizarTabla();

        const opcion = $("#selectProducto").find("option:selected");

        if ($("#selectProducto").val()) {
            const precio = parseFloat(opcion.data("precio")) || 0;
            $("#precioUnitario").text(formatearMoneda(precio));
        } else {
            $("#precioUnitario").text("$0.00");
        }
    }

    $('input[name="value"]').on("change", function () {
        actualizarTipoOperacion();
    });

    // =====================================================
    // 5. AGREGAR PRODUCTOS AL CARRITO
    // =====================================================

    $("#btnAdd").on("click", function () {

        const opcion = $("#selectProducto").find("option:selected");
        const id = $("#selectProducto").val();

        if (!id) {
            Swal.fire({
                icon: "info",
                title: "Atención",
                text: "Por favor selecciona un producto.",
                confirmButtonColor: "#224247"
            });

            return;
        }

        const nombre = opcion.data("nombre") || opcion.text();
        const precio = parseFloat(opcion.data("precio")) || 0;
        const cantidad = Number($("#inputCantidad").val());

        if (!Number.isInteger(cantidad) || cantidad <= 0) {
            Swal.fire({
                icon: "warning",
                title: "Cantidad inválida",
                text: "Ingresa una cantidad entera mayor que cero.",
                confirmButtonColor: "#224247"
            });

            return;
        }

        const itemExistente = carrito.find(function (item) {
            return String(item.id) === String(id);
        });

        if (itemExistente) {

            itemExistente.cantidad += cantidad;

            itemExistente.subtotal =
                itemExistente.precio * itemExistente.cantidad;

        } else {

            carrito.push({
                id: String(id),
                nombre: String(nombre),
                precio: precio,
                cantidad: cantidad,
                subtotal: precio * cantidad
            });
        }

        actualizarTabla();
        resetCampos();
    });

    // =====================================================
    // 6. QUITAR EL ÚLTIMO PRODUCTO
    // =====================================================

    $("#btnRemove").on("click", function () {

        if (carrito.length > 0) {
            carrito.pop();
            actualizarTabla();
        }
    });

    // =====================================================
    // 7. ELIMINAR PRODUCTO INDIVIDUAL
    // =====================================================

    $(document).on("click", ".btn-delete-row", function () {

        const indice = Number($(this).attr("data-index"));

        if (
            Number.isInteger(indice) &&
            indice >= 0 &&
            indice < carrito.length
        ) {
            carrito.splice(indice, 1);
            actualizarTabla();
        }
    });

    // =====================================================
    // 8. ACTUALIZAR TABLA Y TOTALES
    // =====================================================

    function actualizarTabla() {

        const tbody = $("#cartTableBody");
        tbody.empty();

        if (carrito.length === 0) {

            tbody.append(`
                <tr id="emptyRow">
                    <td colspan="5"
                        class="text-center text-muted py-3">
                        No hay productos agregados
                    </td>
                </tr>
            `);

            $("#subtotalVal").text("$0.00");
            $("#totalVal").text("$0.00");

            return;
        }

        let total = 0;

        carrito.forEach(function (item, index) {

            item.subtotal = item.precio * item.cantidad;
            total += item.subtotal;

            // Crear elementos de forma segura para evitar
            // insertar nombres de productos directamente como HTML.
            const fila = $("<tr></tr>");

            $("<td></td>")
                .addClass("fw-semibold")
                .text(item.nombre)
                .appendTo(fila);

            $("<td></td>")
                .addClass("text-center")
                .text(item.cantidad)
                .appendTo(fila);

            $("<td></td>")
                .addClass("text-end")
                .text(formatearMoneda(item.precio))
                .appendTo(fila);

            $("<td></td>")
                .addClass("text-end fw-bold")
                .text(formatearMoneda(item.subtotal))
                .appendTo(fila);

            const celdaEliminar = $("<td></td>")
                .addClass("text-center");

            $("<button></button>")
                .attr("type", "button")
                .attr("data-index", index)
                .addClass(
                    "btn btn-sm text-danger border-0 btn-delete-row"
                )
                .html('<i class="fas fa-times"></i>')
                .appendTo(celdaEliminar);

            fila.append(celdaEliminar);
            tbody.append(fila);
        });

        $("#subtotalVal").text(formatearMoneda(total));
        $("#totalVal").text(formatearMoneda(total));
    }

    // =====================================================
    // 9. REINICIAR CAMPOS
    // =====================================================

    function resetCampos() {

        $("#selectProducto").val(null).trigger("change");
        $("#precioUnitario").text("$0.00");
        $("#inputCantidad").val("1");
    }

    // =====================================================
    // 10. SOLICITAR CORREO Y FINALIZAR OPERACIÓN
    // =====================================================

    $("#btnCheckout").on("click", async function () {

        if (carrito.length === 0) {

            Swal.fire({
                icon: "warning",
                title: "Carrito vacío",
                text: "Agrega productos antes de continuar.",
                confirmButtonColor: "#224247"
            });

            return;
        }

        const devolucion = esDevolucion();

        const totalNumerico = carrito.reduce(function (acumulado, item) {
            return acumulado + item.precio * item.cantidad;
        }, 0);

        const totalMostrar = formatearMoneda(totalNumerico);

        const tipoOperacion = devolucion ? "devolucion" : "venta";

        const resultado = await Swal.fire({
            title: devolucion
                ? "Realizar devolución"
                : "Realizar venta",

            text: devolucion
                ? `Total de devolución: ${totalMostrar}. Ingresa el correo del cliente para enviar el comprobante.`
                : `Total a cobrar: ${totalMostrar}. Ingresa el correo del cliente para enviar la factura.`,

            input: "email",
            inputLabel: "Correo electrónico del cliente",
            inputPlaceholder: "correo@cliente.com",

            inputValidator: function (valor) {
                if (!valor || !valor.trim()) {
                    return "Debes ingresar el correo electrónico del cliente.";
                }
            },

            showCancelButton: true,

            confirmButtonText: devolucion
                ? "Enviar comprobante y finalizar"
                : "Enviar factura y finalizar",

            cancelButtonText: "Cancelar",

            confirmButtonColor: "#10b981",
            cancelButtonColor: "#64748b"
        });

        // Si cancela, conservar el carrito.
        if (!resultado.isConfirmed) {
            return;
        }

        const correoCliente = resultado.value.trim();

        // Crear una copia de los datos de la operación.
        const objetoOperacion = {
            tipo: tipoOperacion,
            numFactura: $("#lblNumFactura").text(),
            cajero: $("#lblCajero").text(),
            fecha: $("#lblFechaExp").text(),

            items: carrito.map(function (item) {
                return {
                    id: item.id,
                    nombre: item.nombre,
                    precio: item.precio,
                    cantidad: item.cantidad,
                    subtotal: item.subtotal
                };
            }),

            // Las devoluciones se representan con un total negativo.
            total: devolucion ? -totalNumerico : totalNumerico,

            correoCliente: correoCliente
        };

        console.log("Datos de la operación:", objetoOperacion);

        /*
         * IMPORTANTE:
         * Este objeto todavía no se guarda en la base de datos.
         * Para registrar la venta/devolución, modificar el inventario
         * y enviar el correo, hay que enviarlo a un controlador PHP.
         */

        await Swal.fire({
            icon: "info",
            title: "Datos preparados",
            text: devolucion
                ? "El correo y los datos de la devolución están preparados, pero todavía falta conectarlos al controlador para registrar y enviar el comprobante."
                : "El correo y los datos de la venta están preparados, pero todavía falta conectarlos al controlador para registrar y enviar la factura.",
            confirmButtonColor: "#224247"
        });
    });

    // =====================================================
    // 11. ESTADO INICIAL
    // =====================================================

    actualizarTipoOperacion();

});
