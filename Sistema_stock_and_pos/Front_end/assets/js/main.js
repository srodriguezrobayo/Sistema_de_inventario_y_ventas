$('.fc-today-button').text('Hoy');

$(document).ready(function () {
    let fechaActual = moment().format('YYYY-MM-DD HH:mm');
    $('#Fechaexpedicion').val(fechaActual);
});

const botonGuardarUsuario = document.getElementById('btnGuardarUsuario');
const campoIdUsuario = document.getElementById('Id_usuario');

if (botonGuardarUsuario && campoIdUsuario) {
    botonGuardarUsuario.addEventListener('click', function () {
        const idUsuario = 'value' in campoIdUsuario
            ? campoIdUsuario.value
            : campoIdUsuario.textContent;

        if (idUsuario) {
            localStorage.setItem('id_usuario', idUsuario);
        }
    });
}