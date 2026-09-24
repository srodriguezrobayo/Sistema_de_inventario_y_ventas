"use strict";

let modal_1_body = '<div>';
modal_1_body += '<form id="formRegistrarproducto">';

/* =====================================================
   FILA 1: Nombre y Código
   ===================================================== */
modal_1_body += '<div class="row">';

/* Nombre producto */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="text" class="form-control" id="Nombreproducto" name="Nombrep" placeholder="Nombre producto" required>';
modal_1_body += '<label for="Nombreproducto">Nombre producto <span style="color: red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

/* Código producto */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="text" class="form-control" id="Codigoproducto" name="codigop" placeholder="Código producto" required>';
modal_1_body += '<label for="Codigoproducto">Código producto <span style="color: red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>'; // Fin Fila 1


/* =====================================================
   FILA 2: Valor unitario y Cantidad
   ===================================================== */
modal_1_body += '<div class="row">';

/* Valor unitario */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="Valoruniproducto" name="Valorunip" placeholder="Valor unitario producto" min="1" required>';
modal_1_body += '<label for="Valoruniproducto">Valor unitario producto <span style="color: red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

/* Cantidad */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="Cantidadproducto" name="cantidap" placeholder="Cantidad producto" min="1" required>';
modal_1_body += '<label for="Cantidadproducto">Cantidad producto <span style="color: red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>'; // Fin Fila 2


/* =====================================================
   FILA 3: Distribución basada en tu imagen
   ===================================================== */
modal_1_body += '<div class="row">';

/* -----------------------------------------------------
   COLUMNA IZQUIERDA: Unidad + ¿Desea registrar fecha?
   ----------------------------------------------------- */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';

/* 1. Unidad de medida */
modal_1_body += '<div class="mb-3">';
modal_1_body += '<label for="exampleDataList" class="form-label">Unidad de medida <span style="color: red;">*</span></label>';
modal_1_body += '<input class="form-control" list="datalistOptions" id="exampleDataList" name="unidad" placeholder="Seleccione una unidad" required>';
modal_1_body += '<datalist id="datalistOptions">';
modal_1_body += '<option value="Unidad">';
modal_1_body += '<option value="Libra">';
modal_1_body += '<option value="Kilogramos">';
modal_1_body += '<option value="Mililitros">';
modal_1_body += '<option value="Litros">';
modal_1_body += '<option value="Centímetros">';
modal_1_body += '<option value="Metros">';
modal_1_body += '</datalist>';
modal_1_body += '</div>';

/* 2. ¿Desea registrar fecha de vencimiento? (Debajo de Unidad de medida) */
modal_1_body += '<div id="segundoRadio" class="mb-3" style="display: none;">';
modal_1_body += '<label class="form-label">¿Conoce la fecha de vencimiento? <span style="color: red;">*</span></label>';
modal_1_body += '<div class="row">';
modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="RegistrarFecha" id="registrarFechaSi" value="Si">';
modal_1_body += '<label class="form-check-label" for="registrarFechaSi">Si</label>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="RegistrarFecha" id="registrarFechaNo" value="No">';
modal_1_body += '<label class="form-check-label" for="registrarFechaNo">No</label>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>'; // Fin Columna Izquierda


/* -----------------------------------------------------
   COLUMNA DERECHA: ¿Tiene fecha? + Calendario
   ----------------------------------------------------- */
modal_1_body += '<div class="col-12 col-md-6 mb-3">';

/* 1. ¿Tiene fecha de vencimiento? (Al lado de Unidad de medida) */
modal_1_body += '<div class="mb-3">';
modal_1_body += '<label class="form-label">¿Tiene fecha de vencimiento? <span style="color: red;">*</span></label>';
modal_1_body += '<br>';
modal_1_body += '<div class="row">';
modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="TieneFV" id="radioSi" value="Si" required>';
modal_1_body += '<label class="form-check-label" for="radioSi">Si</label>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="TieneFV" id="radioNo" value="No">';
modal_1_body += '<label class="form-check-label" for="radioNo">No</label>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '</div>';

/* 2. Campo Fecha de Vencimiento (Al lado derecho de ¿Desea registrar...?) */
modal_1_body += '<br>';
modal_1_body += '<div id="campoFecha" class="mb-3" style="display: none;">';
modal_1_body += '<label for="FechaVencimiento" class="form-label">Fecha de vencimiento <span style="color: red;">*</span></label>';
modal_1_body += '<input type="text" class="form-control datepicker" id="FechaVencimiento" name="FechaVencimiento">';
modal_1_body += '</div>';

modal_1_body += '</div>'; // Fin Columna Derecha

modal_1_body += '</div>'; // Fin Fila 3

/*fila y columna 5*/

modal_1_body += '<div class="row">';
modal_1_body += '<div class="col-12 col-md-6 mb-3">'
modal_1_body += '<label for="Fotoproducto" class="form-label">Foto producto </label>';
modal_1_body += '<input type="file" class="form-control" id="Fotoproducto" name="Fotoproducto" placeholder="Foto producto">';
modal_1_body += '</div>';


modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<br>';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="avisolowstockproducto" name="avisolowstockproducto" placeholder="Cantidad minima en stock" min="1" required>';
modal_1_body += '<label for="avisolowstockproducto">Cantidad minima en stock <span style="color: red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</form>';
modal_1_body += '</div>';


/* =====================================================
   MODAL
   ===================================================== */
$(".trigger-modal-producto").fireModal({
  title: 'Formulario para productos',
  body: modal_1_body,
  buttons: [
    {
      text: 'Subir información',
      class: 'btn btn-success btn-shadow',
      handler: function (modal) {
        let formulario = document.getElementById("formRegistrarproducto");

        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        modal.modal('hide');

        iziToast.success({
          title: 'Información subida',
          message: 'La información ha sido cargada con éxito'
        });

        setTimeout(function () {
          location.reload();
        }, 2000);
      }
    }
  ]
});


/* =====================================================
   EVENTOS JQUERY
   ===================================================== */

/* Primer Radio: ¿Tiene Fecha de Vencimiento? */
$(document).on('change', 'input[name="TieneFV"]', function () {
  if ($('#radioSi').is(':checked')) {
    $('#segundoRadio').slideDown();
    $('input[name="RegistrarFecha"]').prop('required', true);
  } else if ($('#radioNo').is(':checked')) {
    $('#segundoRadio').slideUp();
    $('#campoFecha').slideUp();

    $('input[name="RegistrarFecha"]').prop('required', false).prop('checked', false);
    $('#FechaVencimiento').prop('required', false).val('');
  }
});

/* Segundo Radio: ¿Desea Registrar Fecha? */
$(document).on('change', 'input[name="RegistrarFecha"]', function () {
  if ($('#registrarFechaSi').is(':checked')) {
    $('#campoFecha').slideDown();
    $('#FechaVencimiento').prop('required', true);
  } else if ($('#registrarFechaNo').is(':checked')) {
    $('#campoFecha').slideUp();
    $('#FechaVencimiento').prop('required', false).val('');
  }
});

let modal_2_body = '<div>';
modal_2_body += '<form id="formactcantproduct">';
modal_2_body += '<div class="row">';
modal_2_body += '<div class="mb-3">';
modal_2_body += '<label for="FechaRecibimiento" class="form-label">Fecha de llegada <span style="color: red;">*</span></label>';
modal_2_body += '<input type="text" class="form-control datepicker" id="FechaRecibimiento" name="FechaRecibimiento" required>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '<div class="row">';
modal_2_body += '<div class="mb-3">';
modal_2_body += '<div class="form-floating">'
modal_2_body += '<input type="number" class="form-control" id="Cantidadprod" name="Cantidadprod" placeholder="Subir cantidad" min="1" required>';
modal_2_body += '<label for="Cantidadprod">Subir cantidad <span style="color: red;">*</span></label>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '</form>'
modal_2_body +='</div>';
$(".modal-2").fireModal({
  title: 'Actualizar cantidad de producto',

  body: modal_2_body,

  buttons: [
    {
      text: 'Actualizar producto',
      class: 'btn btn-success btn-shadow',

      handler: function (modal) {

        let formulario = document.getElementById("formactcantproduct");

        // Validar campos obligatorios
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        // Cerrar modal
        modal.modal('hide');

        // Mostrar mensaje de éxito
        iziToast.success({
          title: 'Inventario actualizado',
          message: 'El inventario se actualizó correctamente.'
        });

        // Recargar la página después de 2 segundos
        setTimeout(function () {
          location.reload();
        }, 2000);
      }
    }
  ]

});


let modal_3_body = '<div>';
modal_3_body += '<form id="formRestablecerPassword">';

modal_3_body += '<div class="form-floating">';
modal_3_body += '<input type="email" class="form-control" id="correoRestablecer" name="correo" placeholder="Name@example.com" required>';
modal_3_body += '<label for="correoRestablecer">Correo Electronico<span style="color: red;">*</span></label>';
modal_3_body += '</div>';

modal_3_body += '<br>';

modal_3_body += '<div class="form-floating">';
modal_3_body += '<input type="password" class="form-control" id="nuevaPassword" name="nuevaPassword" placeholder="Contraseña" required>';
modal_3_body += '<label for="nuevaPassword">Nueva contrase&ntilde;a<span style="color: red;">*</span></label>';
modal_3_body += '</div>';

modal_3_body += '<br>';

modal_3_body += '<div class="form-floating">';
modal_3_body += '<input type="password" class="form-control" id="confirmarPassword" name="confirmarPassword" placeholder="Contraseña" required>';
modal_3_body += '<label for="confirmarPassword">Confirme contrase&ntilde;a<span style="color: red;">*</span></label>';
modal_3_body += '</div>';

modal_3_body += '</form>';
modal_3_body += '</div>';


$("#modal-3").fireModal({
  title: 'Restablecer contraseña',

  body: modal_3_body,

  buttons: [
    {
      text: 'Cambiar contraseña',
      class: 'btn btn-success btn-shadow',

      handler: function (modal) {

        let formulario = document.getElementById("formRestablecerPassword");

        // Validar campos obligatorios
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        // Obtener contraseñas
        let nuevaPassword = document.getElementById("nuevaPassword").value;
        let confirmarPassword = document.getElementById("confirmarPassword").value;

        // Verificar que las contraseñas coincidan
        if (nuevaPassword !== confirmarPassword) {

          iziToast.error({
            title: 'Error',
            message: 'Las contraseñas no coinciden.'
          });

          return;
        }

        // Cerrar modal
        modal.modal('hide');

        // Mostrar mensaje de éxito
        iziToast.success({
          title: 'Contraseña actualizada',
          message: 'La contraseña se actualizó correctamente.'
        });

        // Recargar la página después de 2 segundos
        setTimeout(function () {
          location.reload();
        }, 2000);
      }
    }
  ]
});

$("#modal-4").fireModal({
  footerClass: 'bg-whitesmoke',
  body: 'Add the <code>bg-whitesmoke</code> class to the <code>footerClass</code> option.',
  buttons: [
    {
      text: 'No Action!',
      class: 'btn btn-primary btn-shadow',
      handler: function (modal) {
      }
    }
  ]
});

$("#modal-5").fireModal({
  title: 'Login',
  body: $("#modal-login-part"),
  footerClass: 'bg-whitesmoke',
  autoFocus: false,
  onFormSubmit: function (modal, e, form) {
    // Form Data
    let form_data = $(e.target).serialize();
    console.log(form_data)

    // DO AJAX HERE
    let fake_ajax = setTimeout(function () {
      form.stopProgress();
      modal.find('.modal-body').prepend('<div class="alert alert-info">Please check your browser console</div>')

      clearInterval(fake_ajax);
    }, 1500);

    e.preventDefault();
  },
  shown: function (modal, form) {
    console.log(form)
  },
  buttons: [
    {
      text: 'Login',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function (modal) {
      }
    }
  ]
});

$("#modal-6").fireModal({
  body: '<p>Now you can see something on the left side of the footer.</p>',
  created: function (modal) {
    modal.find('.modal-footer').prepend('<div class="mr-auto"><a href="#">I\'m a hyperlink!</a></div>');
  },
  buttons: [
    {
      text: 'No Action',
      submit: true,
      class: 'btn btn-primary btn-shadow',
      handler: function (modal) {
      }
    }
  ]
});

$('.oh-my-modal').fireModal({
  title: 'My Modal',
  body: 'This is cool plugin!'
});