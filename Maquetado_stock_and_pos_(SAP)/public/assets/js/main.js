$('.fc-today-button').text('Hoy');

$(document).ready(function () {
    let fechaActual = moment().format('YYYY-MM-DD HH:mm');
    $('#Fechaexpedicion').val(fechaActual);
});