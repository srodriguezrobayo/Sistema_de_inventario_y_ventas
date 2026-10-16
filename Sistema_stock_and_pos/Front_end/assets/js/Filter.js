
// =====================================================
// BUSCADOR DE PRODUCTOS POR TARJETAS
// =====================================================

document.addEventListener('DOMContentLoaded', function () {

    const formulario = document.getElementById('formBuscarProducto');
    const buscador = document.getElementById('buscarProducto');

    if (!formulario || !buscador) {
        console.error('No se encontró el formulario o el campo de búsqueda.');
        return;
    }

    // Contenedor que agrupa las tarjetas
    const contenedor = document.querySelector('.row:has(.producto-card)');

    if (!contenedor) {
        console.error('No se encontró el contenedor de los productos.');
        return;
    }

    // Mensaje cuando no existen coincidencias
    const mensaje = document.createElement('div');
    mensaje.id = 'mensajeSinProductos';
    mensaje.className = 'col-12 text-center text-muted py-4';
    mensaje.textContent = 'No se encontraron productos.';
    mensaje.style.display = 'none';

    contenedor.appendChild(mensaje);

    // Normalizar texto para ignorar mayúsculas y tildes
    function normalizarTexto(texto) {
        return texto
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim();
    }

    function filtrarProductos() {
        const busqueda = normalizarTexto(buscador.value);
        const tarjetas = contenedor.querySelectorAll('.producto-card');

        let encontrados = 0;

        tarjetas.forEach(function (tarjeta) {
            const contenido = normalizarTexto(tarjeta.textContent);
            const coincide = contenido.includes(busqueda);

            tarjeta.style.display = coincide ? '' : 'none';

            if (coincide) {
                encontrados++;
            }
        });

        mensaje.style.display = encontrados === 0 ? '' : 'none';
    }

    // Filtrar mientras se escribe
    buscador.addEventListener('input', filtrarProductos);

    // También funciona al pulsar el botón de búsqueda
    formulario.addEventListener('submit', function (evento) {
        evento.preventDefault();
        filtrarProductos();
    });

});
