
"use strict";

$(document).ready(function () {

    // =====================================================
    // CONFIGURACIÓN INICIAL
    // =====================================================

    const parametros = new URLSearchParams(window.location.search);
    const idProducto = parametros.get("id");

    const urlControlador =
        "../Back_end/Controlador/Consultar_detalle_producto.php";

    let productoActual = null;

    // Validar el ID recibido en la URL.
    if (!idProducto || !/^[1-9]\d*$/.test(idProducto)) {
        mostrarError("No se recibió un ID de producto válido.");
        return;
    }

    // =====================================================
    // CONSULTAR PRODUCTO
    // =====================================================

    $.ajax({
        url: urlControlador,
        type: "GET",
        dataType: "json",

        data: {
            id_producto: idProducto
        },

        success: function (respuesta) {

            if (!respuesta || Number(respuesta.resultado) !== 1) {
                mostrarError(
                    respuesta?.mensaje ||
                    "No se pudo cargar la información del producto."
                );
                return;
            }

            const producto = respuesta.producto;

            if (!producto) {
                mostrarError(
                    "El controlador no devolvió la información del producto."
                );
                return;
            }

            productoActual = producto;

            // =====================================================
            // PREPARAR BOTÓN EDITAR
            // =====================================================

            prepararBotonEdicion(producto);

            // =====================================================
            // PREPARAR BOTÓN DESACTIVAR
            // =====================================================

            prepararBotonDesactivar(producto);

            // =====================================================
            // MOSTRAR INFORMACIÓN GENERAL
            // =====================================================

            $("#detalleProducto").show();
            $("#mensajeEstado").hide();

            // Nombre.
            $("#nombreProducto").text(
                producto.Nombre_producto || "Sin nombre"
            );

            // Código.
            $("#codigoProducto").text(
                "COD: " + (producto.Codigo_producto || "Sin código")
            );

            // Precio.
            const precio = Number(
                producto.Valor_unitario_producto || 0
            );

            $("#precioProducto").text(
                "$ " + precio.toLocaleString("es-CO")
            );

            // Cantidad y unidad.
            const cantidad = producto.Cantidad_Producto ?? 0;

            const unidad =
                producto.Descripcion_unidad_medida ??
                producto.Unidad_medida_producto ??
                "";

            $("#stockProducto").text(
                cantidad + (unidad ? " " + unidad : "")
            );

            // Cantidad mínima.
            $("#cantidadMinima").text(
                producto.Cantidad_minima ?? 0
            );

            // Unidad de medida.
            $("#unidadProducto").text(
                unidad || "No especificada"
            );

            // Fecha de registro.
            $("#fechaRegistro").text(
                formatearFecha(producto.Creacion_registro)
            );

            // =====================================================
            // ESTADO DEL PRODUCTO
            // =====================================================

            const activo = Number(producto.Estado_producto) === 1;

            $("#estadoProducto")
                .text(activo ? "Activo" : "Inactivo")
                .removeClass(
                    "badge-success badge-danger badge-warning"
                )
                .addClass(
                    activo
                        ? "badge badge-success"
                        : "badge badge-danger"
                );

            // Si ya está inactivo, ocultar o deshabilitar
            // la opción de desactivarlo nuevamente.
            const botonDesactivar =
                document.getElementById("btnDesactivarProducto");

            if (botonDesactivar) {
                botonDesactivar.disabled = !activo;

                if (!activo) {
                    botonDesactivar.title =
                        "Este producto ya está inactivo";
                }
            }

            // =====================================================
            // FOTO DEL PRODUCTO
            // =====================================================

            const foto = producto.Foto_producto;

            if (foto && String(foto).trim() !== "") {
                $("#fotoProducto").attr("src", foto);
            } else {
                $("#fotoProducto").attr(
                    "src",
                    "assets/img/images.png"
                );
            }

            $("#fotoProducto")
                .off("error")
                .on("error", function () {
                    $(this).attr("src", "assets/img/images.png");
                });

            // =====================================================
            // VALIDACIONES DE VENCIMIENTO
            // =====================================================

            const tieneFechaVencimiento =
                Number(producto.Tiene_FV) === 1;

            const conoceFechaVencimiento =
                Number(producto.Conoce_FV) === 1;

            const mostrarVencimientos =
                tieneFechaVencimiento &&
                conoceFechaVencimiento &&
                (
                    respuesta.mostrar_vencimientos === true ||
                    Number(respuesta.mostrar_vencimientos) === 1
                );

            // Si no cumple ambas validaciones,
            // mostrar únicamente la información general.
            if (!mostrarVencimientos) {
                $("#expirationBox").hide();
                $("#calendarioCard").hide();
                return;
            }

            // =====================================================
            // LISTA DE LOTES Y CALENDARIO
            // =====================================================

            $("#expirationBox").show();
            $("#calendarioCard").show();

            const lotes = Array.isArray(respuesta.lotes)
                ? respuesta.lotes
                : [];

            cargarListaVencimientos(lotes);
            cargarCalendario(lotes);
        },

        error: function (xhr) {

            console.error(
                "Error al consultar el producto:",
                xhr.status,
                xhr.responseText
            );

            let mensaje =
                "No se pudo cargar el producto. Revisa el controlador PHP.";

            if (xhr.status === 404) {
                mensaje =
                    "No se encontró el controlador de consulta del producto.";
            } else if (xhr.status === 500) {
                mensaje =
                    "Ocurrió un error en el servidor al consultar el producto.";
            }

            mostrarError(mensaje);
        }
    });

    // =====================================================
    // BOTÓN EDITAR
    // =====================================================

    function prepararBotonEdicion(producto) {

        const boton = document.getElementById("btnEditarProducto");

        if (!boton) {
            console.warn("No se encontró el botón btnEditarProducto.");
            return;
        }

        const id =
            producto.Id_productos ??
            producto.Id_producto ??
            producto.id_producto;

        if (!id || !/^[1-9]\d*$/.test(String(id))) {
            console.error("ID de producto inválido para editar:", id);
            return;
        }

        // Datos utilizados por el formulario de edición existente.
        boton.dataset.idProducto = String(id);
        boton.dataset.nombre = producto.Nombre_producto ?? "";
        boton.dataset.codigo = producto.Codigo_producto ?? "";
        boton.dataset.valor = producto.Valor_unitario_producto ?? "";
        boton.dataset.cantidad = producto.Cantidad_Producto ?? 0;

        boton.dataset.unidad =
            producto.Descripcion_unidad_medida ??
            producto.Unidad_medida_producto ??
            "";

        boton.dataset.stockMinimo =
            producto.Cantidad_minima ?? 0;

        // Inicializar el modal existente.
        if (typeof inicializarBotonesEdicion === "function") {
            inicializarBotonesEdicion();
        } else {
            console.error(
                "No se encontró inicializarBotonesEdicion(). " +
                "Comprueba que el script de edición esté cargado."
            );
        }
    }

    // =====================================================
    // BOTÓN DESACTIVAR
    // =====================================================

    function prepararBotonDesactivar(producto) {

        const boton = document.getElementById(
            "btnDesactivarProducto"
        );

        if (!boton) {
            console.warn(
                "No se encontró el botón btnDesactivarProducto."
            );
            return;
        }

        const id =
            producto.Id_productos ??
            producto.Id_producto ??
            producto.id_producto;

        if (!id || !/^[1-9]\d*$/.test(String(id))) {
            console.error("ID de producto inválido para desactivar:", id);
            return;
        }

        // Guardar el ID real del producto en el botón.
        boton.dataset.idProducto = String(id);

        // Enviar el ID a la función de desactivación.
        boton.onclick = function (evento) {
            evento.preventDefault();

            if (this.disabled) {
                return;
            }

            if (typeof AlertaDejarProducto === "function") {
                AlertaDejarProducto(
                    this.dataset.idProducto,
                    this
                );
            } else {
                console.error(
                    "No se encontró AlertaDejarProducto(). " +
                    "Comprueba que Dejar_producto.js esté cargado."
                );

                if (typeof Swal !== "undefined") {
                    Swal.fire({
                        title: "Error",
                        text: "No se pudo cargar la función para desactivar el producto.",
                        icon: "error",
                        confirmButtonText: "Aceptar"
                    });
                }
            }
        };
    }

    // =====================================================
    // LISTA DE LOTES CON VENCIMIENTO
    // =====================================================

    function cargarListaVencimientos(lotes) {

        const contenedor = document.getElementById(
            "listaVencimientos"
        );

        if (!contenedor) {
            console.warn("No se encontró listaVencimientos.");
            return;
        }

        contenedor.replaceChildren();

        if (lotes.length === 0) {
            const mensaje = document.createElement("p");

            mensaje.textContent =
                "No hay lotes con fechas de vencimiento registrados.";

            contenedor.appendChild(mensaje);
            return;
        }

        lotes.forEach(function (lote) {

            const fila = document.createElement("div");
            fila.className = "expiration-item";

            const nombreLote = document.createElement("span");

            nombreLote.textContent =
                "Lote #" + (lote.Lote_producto || "Sin lote");

            const fecha = document.createElement("strong");

            fecha.textContent =
                formatearFecha(lote.Fecha_vencimiento);

            fila.appendChild(nombreLote);
            fila.appendChild(fecha);

            contenedor.appendChild(fila);
        });
    }

    // =====================================================
    // CALENDARIO
    // =====================================================

    function cargarCalendario(lotes) {

        const calendario = $("#myEvent-1");

        if (!calendario.length) {
            console.warn("No se encontró el elemento #myEvent-1.");
            return;
        }

        const eventos = lotes
            .filter(function (lote) {
                return Boolean(lote.Fecha_vencimiento);
            })
            .map(function (lote) {

                return {
                    title:
                        "Lote #" + (lote.Lote_producto || "Sin lote"),

                    start: String(
                        lote.Fecha_vencimiento
                    ).substring(0, 10),

                    allDay: true
                };
            });

        // Evitar inicializar el calendario dos veces.
        if (calendario.data("fullCalendar")) {
            calendario.fullCalendar("destroy");
        }

        calendario.fullCalendar({
            locale: "es",
            height: "auto",
            defaultView: "month",

            header: {
                left: "prev,next today",
                center: "title",
                right: "month,agendaWeek,agendaDay"
            },

            buttonText: {
                today: "Hoy",
                month: "Mes",
                week: "Semana",
                day: "Día"
            },

            events: eventos,
            eventColor: "#ffa600",
            eventBorderColor: "#ffffff",
            eventTextColor: "#000000",

            eventRender: function (event, element) {

                element.css("cursor", "pointer");

                element.attr("data-toggle", "tooltip");
                element.attr("data-placement", "top");
                element.attr("title", event.title);

                if (typeof element.tooltip === "function") {
                    element.tooltip({
                        container: "body"
                    });
                }
            }
        });
    }

    // =====================================================
    // FORMATO DE FECHAS
    // =====================================================

    function formatearFecha(fecha) {

        if (!fecha) {
            return "No registrada";
        }

        const texto = String(fecha).substring(0, 10);
        const partes = texto.split("-");

        if (partes.length !== 3) {
            return texto;
        }

        return partes[2] + " / " +
            partes[1] + " / " +
            partes[0];
    }

    // =====================================================
    // MOSTRAR ERRORES
    // =====================================================

    function mostrarError(mensaje) {

        $("#mensajeEstado")
            .removeClass("alert-info")
            .addClass("alert-danger")
            .text(mensaje)
            .show();

        $("#detalleProducto").hide();
        $("#expirationBox").hide();
        $("#calendarioCard").hide();
    }

});
