
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

    async function cargarProductos() {
        try {
            const respuesta = await fetch(
                "../Back_end/Controlador/Productos_venta.php",
                { credentials: "same-origin" }
            );
            const datos = await respuesta.json();

            if (!respuesta.ok || datos.resultado !== 1) {
                throw new Error(datos.mensaje || "No se pudieron cargar los productos.");
            }

            const selector = $("#selectProducto").empty();
            selector.append($('<option value="" disabled selected></option>').text(
                datos.productos.length
                    ? "Buscar o seleccionar producto..."
                    : "No hay productos activos en el inventario"
            ));

            const productos = datos.productos;
            productos.forEach(function (producto) {
                const precio = Number(producto.Valor_unitario_producto) || 0;
                const stock = Number(producto.Cantidad_Producto) || 0;
                selector.append(
                    $("<option></option>")
                        .val(producto.Id_productos)
                        .data("precio", precio)
                        .data("nombre", producto.Nombre_producto)
                        .data("stock", stock)
                        .text(
                            producto.Nombre_producto + " - " +
                            formatearMoneda(precio) + " - Stock: " + stock
                        )
                );
            });

            if (datos.usuario) {
                $("#lblCajero").text(datos.usuario);
            }

            selector.trigger("change");
        } catch (error) {
            console.error("Error al cargar productos para venta:", error);
            Swal.fire({
                icon: "error",
                title: "No se cargó el inventario",
                text: error.message || "Comprueba tu sesión y vuelve a cargar la página.",
                confirmButtonColor: "#224247"
            });
        }
    }

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

        const stock = Number(opcion.data("stock")) || 0;
        const cantidadAcumulada = (itemExistente ? itemExistente.cantidad : 0) + cantidad;

        if (!esDevolucion() && cantidadAcumulada > stock) {
            Swal.fire({
                icon: "warning",
                title: "Stock insuficiente",
                text: "Disponible: " + stock + " unidades.",
                confirmButtonColor: "#224247"
            });
            return;
        }

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
                stock: stock,
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

        const botonCheckout = $("#btnCheckout");
        botonCheckout.prop("disabled", true);
        $("#btnAdd, #btnRemove, #selectProducto, #inputCantidad, .btn-delete-row")
            .prop("disabled", true);

        try {
            const respuesta = await fetch(
                "../Back_end/Controlador/Registrar_venta.php",
                {
                    method: "POST",
                    credentials: "same-origin",
                    headers: {
                        "Content-Type": "application/json",
                        "Accept": "application/json"
                    },
                    body: JSON.stringify({
                        tipo: tipoOperacion === "devolucion" ? "Devolucion" : "Venta",
                        correoCliente: correoCliente,
                        items: carrito.map(function (item) {
                            return {
                                id: Number(item.id),
                                cantidad: item.cantidad
                            };
                        })
                    })
                }
            );
            const datos = await respuesta.json();

            if (!respuesta.ok || datos.resultado !== 1) {
                throw new Error(datos.mensaje || "No se pudo registrar la operación.");
            }

            $("#lblNumFactura").text(datos.factura);
            $("#lblFechaExp").text(new Date().toLocaleString());

            await Swal.fire({
                icon: datos.correo_enviado ? "success" : "warning",
                title: datos.correo_enviado
                    ? "Operación completada"
                    : "Operación registrada",
                text: datos.mensaje,
                confirmButtonColor: "#224247"
            });

            carrito = [];
            actualizarTabla();
            await cargarProductos();
        } catch (error) {
            console.error("Error al registrar la operación:", error);
            Swal.fire({
                icon: "error",
                title: "No se pudo completar",
                text: error.message || "Comprueba la conexión y vuelve a intentarlo.",
                confirmButtonColor: "#224247"
            });
        } finally {
            botonCheckout.prop("disabled", false);
            $("#btnAdd, #btnRemove, #selectProducto, #inputCantidad")
                .prop("disabled", false);
            $(".btn-delete-row").prop("disabled", false);
        }
    });

    // =====================================================
    // 11. ESTADO INICIAL
    // =====================================================

    actualizarTipoOperacion();
    cargarProductos();
    window.addEventListener("focus", cargarProductos);

});
