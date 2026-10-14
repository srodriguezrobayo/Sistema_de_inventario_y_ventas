"use strict";

$("#myEvent").fullCalendar({

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
      title: 'Vencen galletas Lote:110215',
      start: '2026-09-27',
      end: '2026-09-27',
      backgroundColor: "#d6a242",
      borderColor: "#fff",
      textColor: '#000'
    },

    {
      title: "John's Birthday",
      start: '2018-01-14',
      backgroundColor: "#007bff",
      borderColor: "#007bff",
      textColor: '#fff'
    },

    {
      title: 'Reporting',
      start: '2018-01-10T11:30:00',
      backgroundColor: "#f56954",
      borderColor: "#f56954",
      textColor: '#fff'
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