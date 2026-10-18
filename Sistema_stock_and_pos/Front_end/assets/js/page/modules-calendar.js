"use strict";


$(document).ready(function () {

  $("#myEvent").fullCalendar({

    height: 'auto',

    header: {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay,listWeek'
    },

    buttonText: {
      today: 'Hoy',
      month: 'Mes',
      week: 'Semana',
      day: 'Día',
      list: 'Lista'
    },

    // Los eventos se consultan desde PHP
    events: function (start, end, timezone, callback) {

      $.ajax({
        url: '/Sistema_Stock_And_Pos/Back_end/Controlador/Fechas_vencimiento_producto.php',
        type: 'GET',
        dataType: 'json',

        success: function (respuesta) {

          if (
            respuesta.resultado === 1 &&
            Array.isArray(respuesta.events)
          ) {
            callback(respuesta.events);
          } else {
            console.error(
              'No se pudieron cargar los vencimientos:',
              respuesta.mensaje
            );

            callback([]);
          }
        },

        error: function (xhr, estado, error) {
          console.error(
            'Error al cargar vencimientos:',
            xhr.status,
            error,
            xhr.responseText
          );

          callback([]);
        }
      });
    },

    // Evita mover eventos sin actualizar la base de datos
    editable: false,

    eventRender: function (event, element) {

      element.css('cursor', 'pointer');

      element.attr('data-toggle', 'tooltip');
      element.attr('data-placement', 'top');
      element.attr('title', event.title);

      element.tooltip({
        container: 'body'
      });
    },

    eventAfterAllRender: function () {
      $('[data-toggle="tooltip"]').tooltip();
    },

    eventClick: function (event) {
      alert(
        event.title +
        '\n' +
        'Fecha de vencimiento: ' +
        moment(event.start).format('YYYY-MM-DD')
      );
    }

  });

});


$("#myEvent-1").fullCalendar({

  height: 'auto',

  header: {
    left: 'prev,next today',
    center: 'title',
    right: 'month,agendaWeek,agendaDay,listWeek'
  },

  buttonText: {
    today: 'Hoy'
  },

  editable: true,

  events: [

    {
      title: 'Vence: Lote:986520',
      start: '2026-09-24',
      end: '2026-09-24',
      backgroundColor: "#ffa600",
      borderColor: "#fff",
      textColor: '#000'
    },

    {
      title: "Vence: Lote:145893",
      start: '2026-10-01',
      backgroundColor: "#ffa600",
      borderColor: "#fff",
      textColor: '#000'
    },

    {
      title: 'Vence: Lote:596321',
      start: '2026-10-25',
      backgroundColor: "#ffa600",
      borderColor: "#fff",
      textColor: '#000'
    },

    {
      title: 'Starting New Project',
      start: '2018-01-11',
      backgroundColor: "#ffc107",
      borderColor: "#ffc107",
      textColor: '#fff'
    },

    {
      title: 'Social Distortion Concert',
      start: '2018-01-24',
      end: '2018-01-27',
      backgroundColor: "#000",
      borderColor: "#000",
      textColor: '#fff'
    },

    {
      title: 'Lunch',
      start: '2018-01-24T13:15:00',
      backgroundColor: "#fff",
      borderColor: "#fff",
      textColor: '#000'
    },

    {
      title: 'Company Trip',
      start: '2018-01-28',
      end: '2018-01-31',
      backgroundColor: "#fff",
      borderColor: "#fff",
      textColor: '#000'
    }

  ],

  // Renderizado del evento con Bootstrap Tooltip
  eventRender: function (event, element) {

    // Cursor de mano
    element.css('cursor', 'pointer');

    // Atributos para Bootstrap Tooltip
    element.attr('data-toggle', 'tooltip');
    element.attr('data-placement', 'top');
    element.attr('title', event.title);

    // Inicialización del Tooltip de Bootstrap
    element.tooltip({
      container: 'body'
    });

  }

});