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

for (let i = 0; i <= 4; i++) {
  let modal_1_5_body = '<div>';
  modal_1_5_body += '<form id="formEditarproducto_' + i + '">';

  /* =====================================================
     FILA 1: Nombre y Código
     ===================================================== */
  modal_1_5_body += '<div class="row">';

  /* Nombre producto */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';
  modal_1_5_body += '<input type="text" class="form-control" id="NombreproductoEditar" name="Nombrep" placeholder="Nombre producto" required>';
  modal_1_5_body += '<label for="NombreproductoEditar">Nombre producto <span style="color: red;">*</span></label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  /* Código producto */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';
  modal_1_5_body += '<input type="text" class="form-control" id="CodigoproductoEditar" name="codigop" placeholder="Código producto" required>';
  modal_1_5_body += '<label for="CodigoproductoEditar">Código producto <span style="color: red;">*</span></label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';


  /* =====================================================
     FILA 2: Valor unitario y Cantidad
     ===================================================== */
  modal_1_5_body += '<div class="row">';

  /* Valor unitario */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';
  modal_1_5_body += '<input type="number" class="form-control" id="ValoruniproductoEditar" name="Valorunip" placeholder="Valor unitario producto" min="1" required>';
  modal_1_5_body += '<label for="ValoruniproductoEditar">Valor unitario producto <span style="color: red;">*</span></label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  /* Cantidad */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';
  modal_1_5_body += '<input type="number" class="form-control" id="CantidadproductoEditar" name="cantidap" placeholder="Cantidad producto" min="1" required>';
  modal_1_5_body += '<label for="CantidadproductoEditar">Cantidad producto <span style="color: red;">*</span></label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';


  /* =====================================================
     FILA 3
     ===================================================== */
  modal_1_5_body += '<div class="row">';

  /* -----------------------------------------------------
     COLUMNA IZQUIERDA
     ----------------------------------------------------- */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';

  /* Unidad de medida */
  modal_1_5_body += '<div class="mb-3">';
  modal_1_5_body += '<label for="exampleDataListEditar" class="form-label">Unidad de medida <span style="color: red;">*</span></label>';

  modal_1_5_body += '<input class="form-control" list="datalistOptionsEditar" id="exampleDataListEditar" name="unidad" placeholder="Seleccione una unidad" required>';

  modal_1_5_body += '<datalist id="datalistOptionsEditar">';
  modal_1_5_body += '<option value="Unidad">';
  modal_1_5_body += '<option value="Libra">';
  modal_1_5_body += '<option value="Kilogramos">';
  modal_1_5_body += '<option value="Mililitros">';
  modal_1_5_body += '<option value="Litros">';
  modal_1_5_body += '<option value="Centímetros">';
  modal_1_5_body += '<option value="Metros">';
  modal_1_5_body += '</datalist>';

  modal_1_5_body += '</div>';


  /* ¿Conoce fecha? */
  modal_1_5_body += '<div id="segundoRadioEditar_' + i + '" class="mb-3" style="display: none;">';

  modal_1_5_body += '<label class="form-label">¿Conoce la fecha de vencimiento? <span style="color: red;">*</span></label>';

  modal_1_5_body += '<div class="row">';

  modal_1_5_body += '<div class="col-6">';
  modal_1_5_body += '<div class="form-check">';
  modal_1_5_body += '<input class="form-check-input" type="radio" name="RegistrarFechaEditar" id="registrarFechaSiEditar_' + i + '" value="Si">';
  modal_1_5_body += '<label class="form-check-label" for="registrarFechaSiEditar">Si</label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '<div class="col-6">';
  modal_1_5_body += '<div class="form-check">';
  modal_1_5_body += '<input class="form-check-input" type="radio" name="RegistrarFechaEditar" id="registrarFechaNoEditar" value="No">';
  modal_1_5_body += '<label class="form-check-label" for="registrarFechaNoEditar">No</label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';


  /* -----------------------------------------------------
     COLUMNA DERECHA
     ----------------------------------------------------- */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';

  /* ¿Tiene fecha? */
  modal_1_5_body += '<div class="mb-3">';

  modal_1_5_body += '<label class="form-label">¿Tiene fecha de vencimiento? <span style="color: red;">*</span></label>';

  modal_1_5_body += '<br>';

  modal_1_5_body += '<div class="row">';

  modal_1_5_body += '<div class="col-6">';
  modal_1_5_body += '<div class="form-check">';
  modal_1_5_body += '<input class="form-check-input" type="radio" name="TieneFVEditar" id="radioSiEditar_' + i + '" value="Si" required>';
  modal_1_5_body += '<label class="form-check-label" for="radioSiEditar_' + i + '">Si</label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '<div class="col-6">';
  modal_1_5_body += '<div class="form-check">';
  modal_1_5_body += '<input class="form-check-input" type="radio" name="TieneFVEditar" id="radioNoEditar_' + i + '" value="No">';
  modal_1_5_body += '<label class="form-check-label" for="radioNoEditar">No</label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';


  /* Fecha de vencimiento */
  modal_1_5_body += '<br>';

  modal_1_5_body += '<div id="campoFechaEditar_' + i + '" class="mb-3" style="display: none;">';

  modal_1_5_body += '<label for="FechaVencimientoEditar" class="form-label">Fecha de vencimiento <span style="color: red;">*</span></label>';

  modal_1_5_body += '<input type="text" class="form-control datepicker FechaVencimientoEditar" id="FechaVencimientoEditar_' + i + '" name="FechaVencimientoEditar">';

  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';


  /* =====================================================
     FILA 4: Foto y Stock mínimo
     ===================================================== */
  modal_1_5_body += '<div class="row">';

  /* Foto */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<label for="FotoproductoEditar" class="form-label">Foto producto</label>';
  modal_1_5_body += '<input type="file" class="form-control" id="FotoproductoEditar" name="Fotoproducto" placeholder="Foto producto">';
  modal_1_5_body += '</div>';


  /* Stock mínimo */
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<br>';
  modal_1_5_body += '<div class="form-floating">';
  modal_1_5_body += '<input type="number" class="form-control" id="avisolowstockproductoEditar" name="avisolowstockproducto" placeholder="Cantidad minima en stock" min="1" required>';
  modal_1_5_body += '<label for="avisolowstockproductoEditar">Cantidad minima en stock <span style="color: red;">*</span></label>';
  modal_1_5_body += '</div>';
  modal_1_5_body += '</div>';

  modal_1_5_body += '</div>';

  modal_1_5_body += '</form>';
  modal_1_5_body += '</div>';


  /* =====================================================
     MODAL EDITAR
     ===================================================== */

  $(".formEditarproducto_" + i).fireModal({

    title: 'Editar producto',

    body: modal_1_5_body,

    buttons: [
      {
        text: 'Guardar cambios',

        class: 'btn btn-success btn-shadow',

        handler: function (modal) {

          let formulario = document.getElementById("formEditarproducto_" + i);

          if (!formulario.checkValidity()) {
            formulario.reportValidity();
            return;
          }

          modal.modal('hide');

          iziToast.success({
            title: 'Producto actualizado',
            message: 'La información del producto ha sido actualizada con éxito'
          });

          setTimeout(function () {
            location.reload();
          }, 2000);
        }
      }
    ]
  });


  /* =====================================================
     EVENTOS JQUERY - EDITAR
     ===================================================== */

  /* Tiene fecha de vencimiento */
  $(document).on('change', 'input[name="TieneFVEditar"]', function () {

    if ($('#radioSiEditar_' + i + '').is(':checked')) {

      $('#segundoRadioEditar_' + i).slideDown();

      $('input[name="RegistrarFechaEditar"]')
        .prop('required', true);

    } else if ($('#radioNoEditar_' + i).is(':checked')) {

      $('#segundoRadioEditar_' + i).slideUp();

      $('#campoFechaEditar_' + i).slideUp();

      $('input[name="RegistrarFechaEditar"]')
        .prop('required', false)
        .prop('checked', false);

      $('#FechaVencimientoEditar_' + i)
        .prop('required', false)
        .val('');
    }
  });


  /* Desea registrar fecha */
  $(document).on('change', 'input[name="RegistrarFechaEditar"]', function () {

    if ($('#registrarFechaSiEditar_' + i).is(':checked')) {

      $('#campoFechaEditar_' + i).slideDown();

      $('#FechaVencimientoEditar_' + i)
        .prop('required', true);

    } else if ($('#registrarFechaNoEditar').is(':checked')) {

      $('#campoFechaEditar_' + i).slideUp();

      $('#FechaVencimientoEditar_' + i)
        .prop('required', false)
        .val('');
    }
  });
}


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
modal_2_body += '</form>';
modal_2_body += '<p><span style="color:red;">*</span>Nota: En caso de que sea un producto percedero y se conozca fecha de vencimiento se pedira lote y fecha de vencimiento<span style="color:red;">*</span></p>'
modal_2_body += '<div class="row">';
modal_2_body += '<div class="mb-3">';
modal_2_body += '<div class="form-floating">'
modal_2_body += '<input type="text" class="form-control" id="Lote" name="Lote" placeholder="Lote producto" disabled>';
modal_2_body += '<label for="Cantidadprod">Lote producto <span style="color: red;">*</span></label>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '<div class="row">';
modal_2_body += '<div class="mb-3">';
modal_2_body += '<label for="FechaVencimiento" class="form-label">Fecha de Vencimiento <span style="color: red;">*</span></label>';
modal_2_body += '<input type="text" class="form-control datepicker" id="FechaVencimiento" name="FechaVencimiento" disabled>';
modal_2_body += '</div>';
modal_2_body += '</div>';
modal_2_body += '</div>';
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

let modal_4_body = '<div>';
modal_4_body += '<form id="formRestablecerPassword_user">';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="Contraseñaanti" name="Contraseñaanti" placeholder="Contraseña antigua" required>';
modal_4_body += '<label for="Contraseñaanti">Contraseña anterior<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '<br>';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="nuevaPassword_u" name="nuevaPassword_u" placeholder="Contraseña" required>';
modal_4_body += '<label for="nuevaPassword_u">Nueva contrase&ntilde;a<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '<br>';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="confirmarPassword_u" name="confirmarPassword_u" placeholder="Contraseña" required>';
modal_4_body += '<label for="confirmarPassword_u">Confirme contrase&ntilde;a<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '</form>';
modal_4_body += '</div>';

$("#modal-4").fireModal({
  title: 'Actualizar contraseña',

  body: modal_4_body,

  buttons: [
    {
      text: 'Cambiar contraseña',
      class: 'btn btn-success btn-shadow',

      handler: function (modal) {

        let formulario = document.getElementById("formRestablecerPassword_user");

        // Validar campos obligatorios
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        // Obtener contraseñas
        let nuevaPassword = document.getElementById("nuevaPassword_u").value;
        let confirmarPassword = document.getElementById("confirmarPassword_u").value;

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

let modal_5_body = '<div>';
modal_5_body += '<form id="Actu_user">';
modal_5_body += '<img class="img-fluid" src="assets/img/avatar-4.png" alt="Picture_actal_user">';
modal_5_body += '<br> <br>';
modal_5_body += '<label for="formFile" class="form-label">Foto de usuario</label>';
modal_5_body += '<input class="form-control" type="file" id="formFile">';
modal_5_body += '<br>';
modal_5_body += '<label for="basic-addon1" class="form-label">Nombre de usuario</label>';
modal_5_body += '<div class="input-group mb-3">';
modal_5_body += '<span class="input-group-text" id="basic-addon1"><i class="fas fa-user"></i></span>';
modal_5_body += '<input type="text" class="form-control" placeholder="Nombre de usuario" aria-label="Username" aria-describedby="basic-addon1" required>';
modal_5_body += '</div>';
modal_5_body += '<label for="basic-addon2" class="form-label">Correo electrónico</label>';
modal_5_body += '<div class="input-group mb-3">';
modal_5_body += '<span class="input-group-text" id="basic-addon2"><i class="fas fa-at"></i></span>';
modal_5_body += '<input type="email" class="form-control" placeholder="Correo electrónico" aria-label="Username" aria-describedby="basic-addon1" required>';
modal_5_body += '</div>';
modal_5_body += '<span>Descripción</span>';
modal_5_body += '<div class="form-floating">';
modal_5_body += '  <textarea class="form-control" placeholder="Descripcion" id="floatingTextarea" maxlength="5000"></textarea>';
/* modal_5_body += '  <label for="floatingTextarea">Descripción</label>'; */
modal_5_body += '</div>';
// Contenedor del contador
modal_5_body += '<div class="text-right text-muted mt-1" style="font-size: 12px;">';
modal_5_body += '  <span id="charCounter">0</span> / 5000 caracteres';
modal_5_body += '</div>';
modal_5_body += '</form>';
modal_5_body += '</div>';

// 1. Escuchador de contador GLOBAL (se ejecuta dinámicamente apenas el usuario escriba)
$(document).on('input keyup paste', '#floatingTextarea', function () {
  var longitudActual = $(this).val().length;
  $('#charCounter').text(longitudActual);
});

// 2. Definición del modal Stisla
$("#modal-5").fireModal({
  title: 'Actualizar Información',
  body: modal_5_body,
  buttons: [
    {
      text: 'Actualizar Información',
      class: 'btn btn-success btn-shadow',
      handler: function (modal) {
        let formulario = document.getElementById("Actu_user");

        // Validar campos obligatorios del HTML
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        // Cerrar modal
        modal.modal('hide');

        // Mostrar mensaje de éxito
        iziToast.success({
          title: 'Información actualizada',
          message: 'Se actualizaron los datos correctamente.'
        });

        // Recargar la página después de 2 segundos
        setTimeout(function () {
          location.reload();
        }, 2000);
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