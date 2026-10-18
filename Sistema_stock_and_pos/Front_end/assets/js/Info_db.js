
async function consultarUsuarioSesion() {
    try {
        const respuesta = await fetch(
            '../Back_end/Controlador/Consultar_usuario.php',
            {
                method: 'GET',
                credentials: 'same-origin',
                headers: {
                    'Accept': 'application/json'
                }
            }
        );

        const datos = await respuesta.json();

        // Verificar si la consulta fue exitosa
        if (!respuesta.ok || datos.resultado !== 1) {

            // Si la sesión expiró, regresar al login
            if (respuesta.status === 401) {
                window.location.replace('login.html');
                return;
            }

            if (typeof iziToast !== 'undefined') {
                iziToast.error({
                    title: 'Error',
                    message: datos.mensaje ||
                        'No fue posible consultar el usuario.',
                    position: 'bottomRight'
                });
            } else {
                console.error(datos.mensaje);
            }

            return;
        }

        // Información del usuario consultado
        const usuario = datos.usuario;

        // Elementos HTML
        const id_usuario = document.getElementById('Id_usuario');
        const nombre = document.getElementById('nombreUsuario');
        const nombre_nb = document.getElementById('nombreUsuario_nb');
        const correo = document.getElementById('correoUsuario');
        const descripcion = document.getElementById('descripcionUsuario');
        const foto = document.getElementById('fotoUsuario');
        const foto_nb = document.getElementById('fotoUsuario_nb');

        if (id_usuario) {
            if ('value' in id_usuario) {
                id_usuario.value = usuario.Id_usuario ?? '';
            }
        }

        if (id_usuario) {
            id_usuario.textContent = usuario.Id_usuario ?? 'Usuario';
        }
        // Mostrar nombre en el saludo principal
        if (nombre) {
            nombre.textContent = usuario.Nombre_usuario ?? 'Usuario';
        }

        // Mostrar nombre en el menú superior
        if (nombre_nb) {
            nombre_nb.textContent = usuario.Nombre_usuario ?? 'Usuario';
        }

        // Mostrar correo electrónico
        if (correo) {
            if ('value' in correo) {
                correo.value = usuario.Email_usuario ?? '';
            } else {
                correo.textContent = usuario.Email_usuario ?? '';
            }
        }

        // Mostrar descripción del usuario
        if (descripcion) {
            if ('value' in descripcion) {
                descripcion.value = usuario.Descripcion_usuario ?? '';
            } else {
                descripcion.textContent =
                    usuario.Descripcion_usuario ?? '';
            }
        }

        // Mostrar fotografía del usuario
        if (foto && usuario.Foto_usuario) {
            foto.src = usuario.Foto_usuario;
        }

        // Mostrar fotografía en el menú superior
        if (foto_nb && usuario.Foto_usuario) {
            foto_nb.src = usuario.Foto_usuario;
        }

    } catch (error) {
        console.error('Error al consultar el usuario:', error);

        if (typeof iziToast !== 'undefined') {
            iziToast.error({
                title: 'Error',
                message: 'No se pudo conectar con el servidor.',
                position: 'bottomRight'
            });
        }
    }
}

// Ejecutar cuando el HTML esté cargado
document.addEventListener(
    'DOMContentLoaded',
    consultarUsuarioSesion
);


/* =====================================================
   CONSULTAR UNIDADES DE MEDIDA
   ===================================================== */

async function ConsultarUnidades() {
    try {
        const respuesta = await fetch(
            '../Back_end/Controlador/Consultar_unidadesmedida.php',
            {
                method: 'GET',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'same-origin'
            }
        );

        const datos = await respuesta.json();

        if (!respuesta.ok || Number(datos.resultado) !== 1) {
            throw new Error(
                datos.mensaje || 'No fue posible cargar las unidades.'
            );
        }

        return datos.unidades;

    } catch (error) {
        console.error('Error al consultar las unidades:', error);

        notificarError(
            'Error',
            'No fue posible cargar las unidades de medida.'
        );

        return [];
    }
}


/* =====================================================
   LLENAR EL DATALIST
   ===================================================== */

/* =====================================================
   LLENAR EL DATALIST CON LAS UNIDADES DE MYSQL
   ===================================================== */

async function CargarUnidadesDatalist(formulario) {
    const datalist = formulario.querySelector('#datalistOptions');

    if (!datalist) {
        console.error('No se encontró el datalist de unidades.');
        return;
    }

    // Limpiar opciones anteriores.
    datalist.replaceChildren();

    // Consultar las unidades al controlador PHP.
    const unidades = await ConsultarUnidades();

    unidades.forEach(function (unidad) {
        const descripcion = unidad.Descripcion_unidad_medida;

        if (!descripcion) {
            return;
        }

        const opcion = document.createElement('option');
        opcion.value = descripcion;

        datalist.appendChild(opcion);
    });
}


document.addEventListener("DOMContentLoaded", function () {
    consultarConteoProductos();
});

async function consultarConteoProductos() {
    const elementoConteo = document.getElementById("totalProductos");

    if (!elementoConteo) {
        console.warn("No se encontró el elemento #totalProductos.");
        return;
    }

    try {
        const respuesta = await fetch(
            "/Sistema_Stock_And_Pos/Back_end/Controlador/Consultar_producto.php",
            {
                method: "GET",
                credentials: "same-origin",
                headers: {
                    "Accept": "application/json"
                }
            }
        );

        if (!respuesta.ok) {
            throw new Error("No se pudo consultar el conteo de productos.");
        }

        const datos = await respuesta.json();

        if (Number(datos.resultado) !== 1) {
            throw new Error(
                datos.mensaje || "Error al obtener el conteo."
            );
        }

        // Total de productos registrados por el usuario autenticado
        elementoConteo.textContent = Number(datos.total) || 0;

    } catch (error) {
        console.error("Error al consultar el conteo:", error);
        elementoConteo.textContent = "—";
    }
}
async function cargarTotalProductos() {
    const elemento = document.getElementById("totalProductos_bajostock");

    if (!elemento) return;

    try {
        const respuesta = await fetch(
            "../Back_end/Controlador/Contar_stock_bajo.php"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok || Number(datos.resultado) !== 1) {
            throw new Error(datos.mensaje || "Error al consultar productos");
        }

        elemento.textContent = datos.Productos_bajo_stock;

    } catch (error) {
        console.error("Error al cargar el total de productos:", error);
        elemento.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", cargarTotalProductos);


async function cargarTotalVentasHoy() {
    const elemento = document.getElementById("totalVentasHoy");

    if (!elemento) return;

    try {
        const respuesta = await fetch(
            "/Sistema_Stock_And_Pos/Back_end/Controlador/Suma_ventas_hoy.php"
        );

        const datos = await respuesta.json();

        if (!respuesta.ok || Number(datos.resultado) !== 1) {
            throw new Error(
                datos.mensaje || "No se pudo consultar el total de ventas."
            );
        }

        const total = Number(datos.Total_neto) || 0;

        elemento.textContent = total.toLocaleString("es-CO");

    } catch (error) {
        console.error("Error al cargar las ventas de hoy:", error);
        elemento.textContent = "0";
    }
}

document.addEventListener("DOMContentLoaded", cargarTotalVentasHoy);


(function () {
    function actualizarTituloProductos() {
        const titulo = document.getElementById(
            "tituloProductosVendidos"
        );

        if (!titulo) {
            return;
        }

        const fecha = new Date();
        const mesAnterior = new Date(
            fecha.getFullYear(),
            fecha.getMonth() - 1,
            1
        );

        const nombreMes = mesAnterior.toLocaleDateString(
            "es-CO",
            {
                month: "long",
                year: "numeric"
            }
        );

        titulo.textContent =
            "Productos vendidos en: " +
            nombreMes.charAt(0).toUpperCase() +
            nombreMes.slice(1);
    }

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            actualizarTituloProductos
        );
    } else {
        actualizarTituloProductos();
    }
})();

