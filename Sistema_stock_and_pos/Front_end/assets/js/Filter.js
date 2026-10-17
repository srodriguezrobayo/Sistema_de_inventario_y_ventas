
"use strict";

// =====================================================
// BUSCADOR DE PRODUCTOS POR TARJETAS
// Compatible con Generate_product.js
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    const formulario = document.getElementById("formBuscarProducto");
    const buscador = document.getElementById("buscarProducto");
    const contenedor = document.getElementById("contenedorProductos");

    if (!formulario || !buscador) {
        console.error(
            "No se encontró el formulario o el campo de búsqueda."
        );
        return;
    }

    if (!contenedor) {
        console.error(
            "No se encontró el contenedor #contenedorProductos."
        );
        return;
    }

    // Crear mensaje cuando no hay coincidencias
    let mensaje = document.getElementById("mensajeSinProductos");

    if (!mensaje) {
        mensaje = document.createElement("div");
        mensaje.id = "mensajeSinProductos";
        mensaje.className = "col-12 text-center text-muted py-4";
        mensaje.textContent = "No se encontraron productos.";
        mensaje.style.display = "none";

        contenedor.appendChild(mensaje);
    }

    // Normalizar texto: ignora mayúsculas y tildes
    function normalizarTexto(texto) {
        return String(texto || "")
            .toLowerCase()
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .trim();
    }

    // Filtrar tarjetas de productos
    function filtrarProductos() {
        const busqueda = normalizarTexto(buscador.value);

        // Las tarjetas se generan dinámicamente.
        // Seleccionamos las columnas que contienen cada tarjeta.
        const tarjetas = Array.from(contenedor.children).filter(function (elemento) {
            return elemento.querySelector(".card") !== null;
        });

        let encontrados = 0;

        tarjetas.forEach(function (tarjeta) {
            const contenido = normalizarTexto(tarjeta.textContent);
            const coincide = contenido.includes(busqueda);

            tarjeta.style.display = coincide ? "" : "none";

            if (coincide) {
                encontrados++;
            }
        });

        mensaje.style.display =
            encontrados === 0 && tarjetas.length > 0 ? "" : "none";
    }

    // Filtrar mientras se escribe
    buscador.addEventListener("input", filtrarProductos);

    // Filtrar al pulsar el botón Buscar
    formulario.addEventListener("submit", function (evento) {
        evento.preventDefault();
        filtrarProductos();
    });

    // Volver a filtrar cuando Generate_product.js
    // termine de cargar o cambiar los productos.
    const observador = new MutationObserver(function () {
        filtrarProductos();
    });

    observador.observe(contenedor, {
        childList: true
    });

});
