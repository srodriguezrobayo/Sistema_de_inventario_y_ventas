$('.fc-today-button').text('Hoy');

$(document).ready(function () {
    let fechaActual = moment().format('YYYY-MM-DD HH:mm');
    $('#Fechaexpedicion').val(fechaActual);
});

document.getElementById('btnGuardarUsuario').addEventListener('click', function () {

    // Reemplaza idUsuario por la variable que ya contiene el ID real.
    localStorage.setItem('id_usuario', id_usuario);

    console.log(
        'ID guardado:',
        localStorage.getItem('Id_usuario')
    );

});