
"use strict";

/* =========================================================
   CONFIGURACIÓN
   ========================================================= */

const URL_CONSULTAR_PRODUCTOS =
    "/Sistema_Stock_And_Pos/Back_end/Controlador/Consultar_producto.php";

let paginaActual = 1;
let solicitudProductos = null;


/* =========================================================
   INICIALIZACIÓN
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) {
        console.error('No se encontró #contenedorProductos.');
        return;
    }

    consultarProductos(1);
});


/* =========================================================
   CONSULTAR PRODUCTOS
   ========================================================= */

async function consultarProductos(pagina = 1) {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    paginaActual = pagina;

    if (solicitudProductos) {
        solicitudProductos.abort();
    }

    solicitudProductos = new AbortController();

    contenedor.innerHTML = `
        <div class="col-12 text-center">
            <div class="spinner-border" role="status">
                <span class="sr-only">Cargando productos...</span>
            </div>
            <p>Cargando productos...</p>
        </div>
    `;

    try {
        const respuesta = await fetch(
            `${URL_CONSULTAR_PRODUCTOS}?pagina=${encodeURIComponent(pagina)}`,
            {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json"
                },
                signal: solicitudProductos.signal
            }
        );

        if (respuesta.status === 401) {
            contenedor.innerHTML = `
                <div class="col-12">
                    <div class="alert alert-warning">
                        Tu sesión ha expirado. Inicia sesión nuevamente.
                    </div>
                </div>
            `;
            return;
        }

        if (!respuesta.ok) {
            throw new Error(
                `Error HTTP ${respuesta.status} al consultar los productos.`
            );
        }

        const datos = await respuesta.json();

        if (Number(datos.resultado) !== 1) {
            throw new Error(
                datos.mensaje || "No fue posible consultar los productos."
            );
        }

        generarProductos(
            Array.isArray(datos.productos) ? datos.productos : []
        );

        generarPaginacion(
            Number(datos.pagina) || pagina,
            Number(datos.totalPaginas) || 0
        );

    } catch (error) {
        if (error.name === "AbortError") return;

        console.error("Error al consultar productos:", error);

        contenedor.innerHTML = `
            <div class="col-12">
                <div class="alert alert-danger">
                    No fue posible cargar los productos.
                    <button type="button"
                            class="btn btn-outline-danger"
                            id="btnReintentarProductos">
                        <i class="fas fa-redo"></i>
                        Reintentar
                    </button>
                </div>
            </div>
        `;

        document
            .getElementById("btnReintentarProductos")
            ?.addEventListener("click", function () {
                consultarProductos(paginaActual);
            });
    }
}


/* =========================================================
   GENERAR CARDS
   Diseño original conservado.
   ========================================================= */

function generarProductos(productos) {
    const contenedor = document.getElementById("contenedorProductos");

    if (!contenedor) return;

    if (productos.length === 0) {
        contenedor.innerHTML = `
            <div class="col-12 text-center">
                <p>No hay productos registrados.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = productos.map(function (producto, indice) {
        const id = producto.Id_productos;

        const nombre = escaparHTML(
            producto.Nombre_producto || ""
        );

        const codigo = escaparHTML(
            producto.Codigo_producto || ""
        );

        const stock = Number(producto.Cantidad_Producto) || 0;

        const cantidadVendida = Number(
            producto.Cantidad_vendida ??
            producto.Cantidad_vendida_producto ??
            0
        );

        const stockMinimo = Number(producto.Cantidad_minima) || 0;
        const precio = Number(producto.Valor_unitario_producto) || 0;
        const precioFormateado = new Intl.NumberFormat("es-CO", {
            style: "currency",
            currency: "COP",
            maximumFractionDigits: 0
        }).format(precio);
        const unidad = escaparHTML(producto.Unidad_medida_producto || "");

        // Imagen almacenada en la base de datos.
        const imagen = escaparHTML(
            obtenerRutaImagen(producto.Foto_producto)
        );

        // Mantiene las clases del diseño original.
        const claseCard =
            stockMinimo > 0 && stock <= stockMinimo
                ? "card h-100 stock-product-card bg-warning-subtle text-warning-emphasis border border-light-subtle"
                : "card h-100 stock-product-card";

        const numeroCard = indice + 1;

        return `
            <div class="col-12 col-sm-6 col-lg-4 mb-4 stock-product-column">
                <div class="${claseCard}">

                    <div class="card-header text-center stock-product-image-frame">
                        <img
                            src="${imagen}"
                            class="img-fluid stock-product-image"
                            alt="${nombre}"
                        >
                    </div>

                    <a
                        class="btn btn-light stock-product-view"
                        href="View_product.html?id=${encodeURIComponent(id)}"
                    >
                        <i class="far fa-eye"></i>
                        Ver producto
                    </a>

                    <div class="card-body stock-product-body">

                        <div class="mb-3 stock-product-identity">
                            <h6 class="mb-1 text-break stock-product-name" title="${nombre}">${nombre}</h6>
                            <small class="text-muted stock-product-code" title="Código: ${codigo || "Sin código"}">Código: ${codigo || "Sin código"}</small>
                        </div>

                        <div class="row g-2 mb-3 stock-product-metrics">
                            <div class="col-6">
                                <div class="p-2 bg-light rounded stock-product-metric">
                                    <small class="d-block text-muted">Stock disponible</small>
                                    <strong>${stock}${unidad ? " " + unidad : ""}</strong>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded stock-product-metric">
                                    <small class="d-block text-muted">Vendidas netas</small>
                                    <strong>${cantidadVendida}</strong>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded stock-product-metric">
                                    <small class="d-block text-muted">Stock mínimo</small>
                                    <strong>${stockMinimo}${unidad ? " " + unidad : ""}</strong>
                                </div>
                            </div>
                            <div class="col-6">
                                <div class="p-2 bg-light rounded stock-product-metric">
                                    <small class="d-block text-muted">Precio unitario</small>
                                    <strong>${escaparHTML(precioFormateado)}</strong>
                                </div>
                            </div>
                        </div>

                        <div class="stock-product-actions">
                        <hr>

<button
    class="btn btn-warning w-100 formEditarproducto formEditarproducto_${numeroCard}"
    type="button"
    data-id-producto="${escaparHTML(id)}"
    data-nombre="${escaparHTML(producto.Nombre_producto || '')}"
    data-codigo="${escaparHTML(producto.Codigo_producto || '')}"
    data-valor="${escaparHTML(producto.Valor_unitario_producto ?? '')}"
    data-cantidad="${escaparHTML(producto.Cantidad_Producto ?? 0)}"
    data-unidad="${escaparHTML(producto.Unidad_medida_producto || '')}"
    data-stock-minimo="${escaparHTML(producto.Cantidad_minima ?? 0)}"
>
    <i class="fas fa-edit"></i> Editar producto
</button>


                        <button
                            type="button"
                            class="btn btn-danger w-100 mt-2 btn-dejar-vender"
                            data-id-producto="${escaparHTML(id)}"
                            onclick="AlertaDejarProducto(this.dataset.idProducto, this)"
                        >
                            <i class="fas fa-ban"></i>
                            Dejar de vender
                        </button>

                        <button
                            type="button"
                            class="btn btn-info w-100 mt-2 modal-2"
                            data-id-producto="${escaparHTML(id)}"
                        >
                            <i class="fas fa-truck"></i>
                            Actualizar cantidad
                        </button>
                        </div>

                    </div>
                </div>
            </div>
        `;
    }).join("");
}


/* =========================================================
   PAGINACIÓN
   ========================================================= */

function generarPaginacion(pagina, totalPaginas) {
    const contenedor = document.getElementById("paginacionProductos");

    if (!contenedor) return;

    if (totalPaginas <= 1) {
        contenedor.innerHTML = "";
        return;
    }

    let html = `
        <div class="buttons">
            <nav aria-label="Page navigation example">
                <ul class="pagination">

                    <li class="page-item ${pagina <= 1 ? "disabled" : ""}">
                        <a class="page-link"
                           href="#"
                           data-pagina="${pagina - 1}"
                           aria-label="Previous">
                            <span aria-hidden="true">&laquo;</span>
                            <span class="sr-only">Previous</span>
                        </a>
                    </li>
    `;

    for (let i = 1; i <= totalPaginas; i++) {
        html += `
            <li class="page-item ${i === pagina ? "active" : ""}">
                <a class="page-link"
                   href="#"
                   data-pagina="${i}">${i}</a>
            </li>
        `;
    }

    html += `
                    <li class="page-item ${pagina >= totalPaginas ? "disabled" : ""}">
                        <a class="page-link"
                           href="#"
                           data-pagina="${pagina + 1}"
                           aria-label="Next">
                            <span aria-hidden="true">&raquo;</span>
                            <span class="sr-only">Next</span>
                        </a>
                    </li>

                </ul>
            </nav>
        </div>
    `;

    contenedor.innerHTML = html;
}


/* =========================================================
   EVENTO DE PAGINACIÓN
   ========================================================= */

document.addEventListener("click", function (evento) {
    const enlace = evento.target.closest(
        "#paginacionProductos a[data-pagina]"
    );

    if (!enlace) return;

    evento.preventDefault();

    const elemento = enlace.closest(".page-item");

    if (elemento?.classList.contains("disabled")) return;

    const pagina = Number(enlace.dataset.pagina);

    if (pagina >= 1 && pagina !== paginaActual) {
        consultarProductos(pagina);
    }
});


/* =========================================================
   EVENTOS DE LOS BOTONES
   ========================================================= */

document.addEventListener("click", function (evento) {
    const botonEditar = evento.target.closest(".formEditarproducto");

    if (botonEditar) {
        const idProducto = botonEditar.dataset.idProducto;

        document.dispatchEvent(
            new CustomEvent("editarProductoSolicitado", {
                detail: {
                    id: idProducto,
                    idProducto: idProducto
                }
            })
        );

        return;
    }

    const botonActualizar = evento.target.closest(".modal-2");

    if (botonActualizar) {
        const idProducto = botonActualizar.dataset.idProducto;

        document.dispatchEvent(
            new CustomEvent("actualizarCantidadSolicitada", {
                detail: {
                    id: idProducto,
                    idProducto: idProducto,
                    boton: botonActualizar
                }
            })
        );

        return;
    }

    const botonDejarVender = evento.target.closest(".btn-dejar-vender");

    if (botonDejarVender) {
        const idProducto = botonDejarVender.dataset.idProducto;

        document.dispatchEvent(
            new CustomEvent("dejarVenderProductoSolicitado", {
                detail: {
                    id: idProducto,
                    idProducto: idProducto
                }
            })
        );
    }
});


/* =========================================================
   FUNCIONES AUXILIARES
   ========================================================= */

function obtenerRutaImagen(foto) {
    return foto ? String(foto).trim() : "";
}


function escaparHTML(valor) {
    return String(valor ?? "").replace(/[&<>"']/g, function (caracter) {
        const caracteres = {
            "&": "&amp;",
            "<": "&lt;",
            ">": "&gt;",
            '"': "&quot;",
            "'": "&#039;"
        };

        return caracteres[caracter];
    });
}

