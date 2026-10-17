"use strict";

/* =====================================================
   FORMULARIO DE REGISTRO DE PRODUCTOS
   ===================================================== */

let modal_1_body = '<div>';
modal_1_body += '<form id="formRegistrarproducto" enctype="multipart/form-data">';

/* =====================================================
   FILA 1: NOMBRE Y CÓDIGO
   ===================================================== */

modal_1_body += '<div class="row">';

// Nombre del producto
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<input type="hidden" name="Id_usuario" id="Id_usuario" value="' + (window.Id_usuario || '') + '">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="text" class="form-control" id="Nombreproducto" name="Nombrep" placeholder="Nombre producto" required>';
modal_1_body += '<label for="Nombreproducto">Nombre producto <span style="color:red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

// Código del producto
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="text" class="form-control" id="Codigoproducto" name="codigop" placeholder="Código producto" required>';
modal_1_body += '<label for="Codigoproducto">Código producto <span style="color:red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>';


/* =====================================================
   FILA 2: PRECIO Y CANTIDAD
   ===================================================== */

modal_1_body += '<div class="row">';

// Precio unitario
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="Valoruniproducto" name="Valorunip" placeholder="Valor unitario producto" min="1" step="any" required>';
modal_1_body += '<label for="Valoruniproducto">Valor unitario producto <span style="color:red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

// Cantidad
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="Cantidadproducto" name="cantidap" placeholder="Cantidad producto" min="1" step="1" required>';
modal_1_body += '<label for="Cantidadproducto">Cantidad producto <span style="color:red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>';


/* =====================================================
   FILA 3: UNIDAD Y FECHAS DE VENCIMIENTO
   ===================================================== */

modal_1_body += '<div class="row">';

// Columna izquierda
modal_1_body += '<div class="col-12 col-md-6 mb-3">';

// Unidad de medida

modal_1_body += '<div class="mb-3">';
modal_1_body += '<label for="exampleDataList" class="form-label">Unidad de medida <span style="color:red;">*</span></label>';

modal_1_body += '<input class="form-control" list="datalistOptions" id="exampleDataList" name="unidad" placeholder="Seleccione una unidad" autocomplete="off" required>';

modal_1_body += '<datalist id="datalistOptions"></datalist>';

modal_1_body += '</div>';

// ¿Conoce la fecha de vencimiento?
modal_1_body += '<div id="segundoRadio" class="mb-3" style="display:none;">';
modal_1_body += '<label class="form-label">¿Conoce la fecha de vencimiento? <span style="color:red;">*</span></label>';
modal_1_body += '<div class="row">';

modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="RegistrarFecha" id="registrarFechaSi" value="Si">';
modal_1_body += '<label class="form-check-label" for="registrarFechaSi">Sí</label>';
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

modal_1_body += '</div>';

// Columna derecha
modal_1_body += '<div class="col-12 col-md-6 mb-3">';

// ¿Tiene fecha de vencimiento?
modal_1_body += '<div class="mb-3">';
modal_1_body += '<label class="form-label">¿Tiene fecha de vencimiento? <span style="color:red;">*</span></label>';
modal_1_body += '<div class="row">';

modal_1_body += '<div class="col-6">';
modal_1_body += '<div class="form-check">';
modal_1_body += '<input class="form-check-input" type="radio" name="TieneFV" id="radioSi" value="Si" required>';
modal_1_body += '<label class="form-check-label" for="radioSi">Sí</label>';
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

// Fecha de vencimiento
modal_1_body += '<div id="campoFecha" class="mb-3" style="display:none;">';
modal_1_body += '<label for="FechaVencimiento" class="form-label">Fecha de vencimiento <span style="color:red;">*</span></label>';
modal_1_body += '<input type="text" class="form-control datepicker" id="FechaVencimiento" name="FechaVencimiento" placeholder="Seleccione una fecha">';
modal_1_body += '</div>';

modal_1_body += '</div>';
modal_1_body += '</div>';


/* =====================================================
   FILA 4: FOTO Y STOCK MÍNIMO
   ===================================================== */

modal_1_body += '<div class="row">';

// Foto del producto
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<label for="Fotoproducto" class="form-label">Foto del producto</label>';
modal_1_body += '<input type="file" class="form-control" id="Fotoproducto" name="Fotoproducto" accept="image/jpeg,image/png,image/webp">';
modal_1_body += '</div>';

// Cantidad mínima
modal_1_body += '<div class="col-12 col-md-6 mb-3">';
modal_1_body += '<div class="form-floating">';
modal_1_body += '<input type="number" class="form-control" id="avisolowstockproducto" name="avisolowstockproducto" placeholder="Cantidad mínima en stock" min="1" step="1" required>';
modal_1_body += '<label for="avisolowstockproducto">Cantidad mínima en stock <span style="color:red;">*</span></label>';
modal_1_body += '</div>';
modal_1_body += '</div>';

modal_1_body += '</div>';

modal_1_body += '</form>';
modal_1_body += '</div>';


/* =====================================================
   NOTIFICACIONES IZIToast
   ===================================================== */

function notificarError(titulo, mensaje) {
  iziToast.error({
    title: titulo,
    message: mensaje,
    position: 'bottomRight',
    timeout: 5000
  });
}

function notificarExito(titulo, mensaje) {
  iziToast.success({
    title: titulo,
    message: mensaje,
    position: 'bottomRight',
    timeout: 4000
  });
}


/* =====================================================
   EVENTOS: FECHA DE VENCIMIENTO
   ===================================================== */

// Primer grupo de radios: ¿Tiene fecha de vencimiento?
$(document).on('change', 'input[name="TieneFV"]', function () {
  const formulario = this.form;
  const tieneFecha = this.value === 'Si';

  const segundoRadio = $(formulario).find('#segundoRadio');
  const campoFecha = $(formulario).find('#campoFecha');
  const opcionesFecha = $(formulario).find(
    'input[name="RegistrarFecha"]'
  );
  const fechaVencimiento = $(formulario).find('#FechaVencimiento');

  if (tieneFecha) {
    segundoRadio.stop(true, true).slideDown();

    // Se exige elegir Sí o No en el segundo grupo.
    opcionesFecha.prop('required', true);
  } else {
    segundoRadio.stop(true, true).slideUp();
    campoFecha.stop(true, true).slideUp();

    opcionesFecha
      .prop('checked', false)
      .prop('required', false);

    fechaVencimiento
      .prop('required', false)
      .val('');
  }
});

// Segundo grupo de radios: ¿Conoce la fecha?
$(document).on('change', 'input[name="RegistrarFecha"]', function () {
  const formulario = this.form;
  const conoceFecha = this.value === 'Si';

  const campoFecha = $(formulario).find('#campoFecha');
  const fechaVencimiento = $(formulario).find('#FechaVencimiento');

  if (conoceFecha) {
    campoFecha.stop(true, true).slideDown();
    fechaVencimiento.prop('required', true);
  } else {
    campoFecha.stop(true, true).slideUp();

    fechaVencimiento
      .prop('required', false)
      .val('');
  }
});

$(document).on('click', '.trigger-modal-producto', async function () {
  // Esperar a que el complemento inserte el formulario en el DOM.
  setTimeout(async function () {
    const formulario = document.getElementById(
      'formRegistrarproducto'
    );

    if (formulario) {
      await CargarUnidadesDatalist(formulario);
    }
  }, 300);
});

/* =====================================================
   ABRIR MODAL Y REGISTRAR PRODUCTO
   ===================================================== */

$(".trigger-modal-producto").fireModal({
  title: 'Formulario para productos',
  body: modal_1_body,

  buttons: [
    {
      text: 'Subir información',
      class: 'btn btn-success btn-shadow',

      handler: async function (modal) {
        const formulario = modal.querySelector
          ? modal.querySelector('#formRegistrarproducto')
          : document.getElementById('formRegistrarproducto');

        if (!formulario) {
          notificarError(
            'Error',
            'No se encontró el formulario de productos.'
          );
          return;
        }

        // Evitar múltiples envíos simultáneos.
        if (formulario.dataset.enviando === 'true') {
          return;
        }

        // Validar campos HTML obligatorios.
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        // Validar selección de vencimiento.
        const tieneFecha = formulario.querySelector(
          'input[name="TieneFV"]:checked'
        );

        if (!tieneFecha) {
          notificarError(
            'Campo obligatorio',
            'Indica si el producto tiene fecha de vencimiento.'
          );
          return;
        }

        let conoceFecha = null;
        let fechaVencimiento = '';

        if (tieneFecha.value === 'Si') {
          conoceFecha = formulario.querySelector(
            'input[name="RegistrarFecha"]:checked'
          );

          if (!conoceFecha) {
            notificarError(
              'Campo obligatorio',
              'Indica si conoces la fecha de vencimiento.'
            );
            return;
          }

          if (conoceFecha.value === 'Si') {
            fechaVencimiento = formulario.querySelector(
              '#FechaVencimiento'
            ).value.trim();

            if (!fechaVencimiento) {
              notificarError(
                'Campo obligatorio',
                'Selecciona la fecha de vencimiento.'
              );
              return;
            }
          }
        }

        // Validar precio y cantidades.
        const precio = Number(
          formulario.querySelector('[name="Valorunip"]').value
        );

        const cantidad = Number(
          formulario.querySelector('[name="cantidap"]').value
        );

        const cantidadMinima = Number(
          formulario.querySelector(
            '[name="avisolowstockproducto"]'
          ).value
        );

        if (!Number.isFinite(precio) || precio < 1) {
          notificarError(
            'Precio no válido',
            'El precio unitario debe ser igual o mayor que 1.'
          );
          return;
        }

        if (!Number.isInteger(cantidad) || cantidad < 1) {
          notificarError(
            'Cantidad no válida',
            'La cantidad debe ser un número entero mayor que cero.'
          );
          return;
        }

        if (
          !Number.isInteger(cantidadMinima) ||
          cantidadMinima < 1
        ) {
          notificarError(
            'Stock mínimo no válido',
            'El stock mínimo debe ser un entero mayor que cero.'
          );
          return;
        }

        // Validar la imagen, si el usuario seleccionó una.
        const archivo = formulario.querySelector(
          '#Fotoproducto'
        ).files[0];

        if (archivo) {
          const tiposPermitidos = [
            'image/jpeg',
            'image/png',
            'image/webp'
          ];

          if (!tiposPermitidos.includes(archivo.type)) {
            notificarError(
              'Archivo no válido',
              'Selecciona una imagen JPG, PNG o WEBP.'
            );
            return;
          }

          if (archivo.size > 5 * 1024 * 1024) {
            notificarError(
              'Imagen demasiado grande',
              'La imagen no puede superar los 5 MB.'
            );
            return;
          }
        }

        // Preparar todos los campos y la imagen.
        const datosFormulario = new FormData(formulario);

        // Normalizar opciones de vencimiento para el backend.
        datosFormulario.set(
          'TieneFV',
          tieneFecha.value
        );

        datosFormulario.set(
          'RegistrarFecha',
          tieneFecha.value === 'Si'
            ? conoceFecha.value
            : 'No'
        );

        datosFormulario.set(
          'FechaVencimiento',
          tieneFecha.value === 'Si' &&
            conoceFecha.value === 'Si'
            ? fechaVencimiento
            : ''
        );

        // Encontrar el botón de envío del modal.
        const boton = $(modal).find('.btn-success');
        const textoOriginal = boton.length
          ? boton.first().text()
          : 'Subir información';

        formulario.dataset.enviando = 'true';

        boton
          .prop('disabled', true)
          .first()
          .text('Guardando...');

        try {
          const respuesta = await fetch(
            '../Back_end/Controlador/Registrar_producto.php',
            {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Accept': 'application/json'
              },
              body: datosFormulario
            }
          );

          const textoRespuesta = await respuesta.text();
          let resultado;

          // Convertir la respuesta a JSON.
          try {
            resultado = JSON.parse(textoRespuesta);
          } catch (error) {
            console.error(
              'Respuesta no válida del servidor:',
              textoRespuesta
            );

            notificarError(
              'Error del servidor',
              'PHP no devolvió JSON válido. Revisa la respuesta en la pestaña Red (Network).'
            );
            return;
          }

          // Comprobar el resultado del registro.
          if (
            !respuesta.ok ||
            Number(resultado.resultado) !== 1
          ) {
            notificarError(
              'No se pudo registrar',
              resultado.mensaje ||
              'No fue posible guardar el producto.'
            );
            return;
          }

          // Mostrar confirmación.
          notificarExito(
            'Producto registrado',
            resultado.mensaje ||
            'El producto se guardó correctamente.'
          );

          // Cerrar el modal.
          if (typeof $(modal).modal === 'function') {
            $(modal).modal('hide');
          }

          // Actualizar la lista de productos.
          setTimeout(function () {
            window.location.reload();
          }, 1500);

        } catch (error) {
          console.error(
            'Error al enviar el formulario:',
            error
          );

          notificarError(
            'Error de conexión',
            'No se pudo conectar con el servidor. Verifica que Apache y MySQL estén funcionando.'
          );

        } finally {
          formulario.dataset.enviando = 'false';

          boton
            .prop('disabled', false)
            .first()
            .text(textoOriginal);
        }
      }
    }
  ]
});

/* =====================================================
   BUCLE: CREAR LOS FORMULARIOS DE EDICIÓN
   ===================================================== */

for (let i = 0; i <= 4; i++) {

  let modal_1_5_body = '<div>';

  modal_1_5_body +=
    '<form id="formEditarproducto_' + i + '">';

  /* =====================================================
     FILA 1: NOMBRE Y CÓDIGO
     ===================================================== */

  modal_1_5_body += '<div class="row">';

  // Nombre del producto
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';

  modal_1_5_body +=
    '<input type="text" class="form-control" ' +
    'id="NombreproductoEditar_' + i + '" ' +
    'name="Nombrep" placeholder="Nombre producto" required>';

  modal_1_5_body +=
    '<label for="NombreproductoEditar_' + i + '">' +
    'Nombre producto <span style="color:red;">*</span></label>';

  modal_1_5_body += '</div></div>';

  // Código del producto
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';

  modal_1_5_body +=
    '<input type="text" class="form-control" ' +
    'id="CodigoproductoEditar_' + i + '" ' +
    'name="codigop" placeholder="Código producto" required>';

  modal_1_5_body +=
    '<label for="CodigoproductoEditar_' + i + '">' +
    'Código producto <span style="color:red;">*</span></label>';

  modal_1_5_body += '</div></div>';
  modal_1_5_body += '</div>';

  /* =====================================================
     FILA 2: VALOR UNITARIO Y CANTIDAD
     ===================================================== */

  modal_1_5_body += '<div class="row">';

  // Valor unitario
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';

  modal_1_5_body +=
    '<input type="number" class="form-control" ' +
    'id="ValoruniproductoEditar_' + i + '" ' +
    'name="Valorunip" placeholder="Valor unitario producto" ' +
    'min="1" required>';

  modal_1_5_body +=
    '<label for="ValoruniproductoEditar_' + i + '">' +
    'Valor unitario producto ' +
    '<span style="color:red;">*</span></label>';

  modal_1_5_body += '</div></div>';

  // Cantidad del producto
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="input-group">';

  modal_1_5_body += '<div class="form-floating flex-grow-1">';

  modal_1_5_body +=
    '<input type="number" class="form-control" ' +
    'id="CantidadproductoEditar_' + i + '" ' +
    'name="cantidap" placeholder="Cantidad producto" ' +
    'min="1" step="1" disabled>';

  modal_1_5_body +=
    '<label for="CantidadproductoEditar_' + i + '">' +
    'Cantidad producto</label>';

  modal_1_5_body += '</div>';

  // Botón de devolución
  modal_1_5_body +=
    '<button type="button" ' +
    'class="btn btn-outline-secondary btnDevolucionProducto" ' +
    'data-indice="' + i + '" ' +
    'title="Realizar devolución" ' +
    'aria-label="Realizar devolución de cantidad">' +
    '<i class="fas fa-info-circle"></i>' +
    '</button>';

  modal_1_5_body += '</div></div>';
  modal_1_5_body += '</div>';

  /* =====================================================
     FILA 3: UNIDAD DE MEDIDA Y STOCK MÍNIMO
     ===================================================== */

  modal_1_5_body += '<div class="row">';

  // Unidad de medida
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';

  modal_1_5_body +=
    '<label for="exampleDataListEditar_' + i + '" ' +
    'class="form-label">Unidad de medida ' +
    '<span style="color:red;">*</span></label>';

  modal_1_5_body +=
    '<input class="form-control" ' +
    'list="datalistOptionsEditar_' + i + '" ' +
    'id="exampleDataListEditar_' + i + '" ' +
    'name="unidad" placeholder="Seleccione una unidad" required>';

  modal_1_5_body +=
    '<datalist id="datalistOptionsEditar_' + i + '">';

  modal_1_5_body += '<option value="Unidad">';
  modal_1_5_body += '<option value="Libra">';
  modal_1_5_body += '<option value="Kilogramos">';
  modal_1_5_body += '<option value="Mililitros">';
  modal_1_5_body += '<option value="Litros">';
  modal_1_5_body += '<option value="Centímetros">';
  modal_1_5_body += '<option value="Metros">';

  modal_1_5_body += '</datalist>';
  modal_1_5_body += '</div>';

  // Cantidad mínima de stock
  modal_1_5_body += '<div class="col-12 col-md-6 mb-3">';
  modal_1_5_body += '<div class="form-floating">';

  modal_1_5_body +=
    '<input type="number" class="form-control" ' +
    'id="avisolowstockproductoEditar_' + i + '" ' +
    'name="avisolowstockproducto" ' +
    'placeholder="Cantidad mínima en stock" ' +
    'min="1" required>';

  modal_1_5_body +=
    '<label for="avisolowstockproductoEditar_' + i + '">' +
    'Cantidad mínima en stock ' +
    '<span style="color:red;">*</span></label>';

  modal_1_5_body += '</div></div>';
  modal_1_5_body += '</div>';

  /* =====================================================
     FILA 4: FOTO DEL PRODUCTO
     ===================================================== */

  modal_1_5_body += '<div class="mb-3">';

  modal_1_5_body +=
    '<label for="FotoproductoEditar_' + i + '" ' +
    'class="form-label">Foto producto</label>';

  modal_1_5_body +=
    '<input type="file" class="form-control" ' +
    'id="FotoproductoEditar_' + i + '" ' +
    'name="Fotoproducto" accept="image/*">';

  modal_1_5_body += '</div>';

  modal_1_5_body += '</form>';
  modal_1_5_body += '</div>';

  /* =====================================================
     MODAL EDITAR PRODUCTO
     ===================================================== */

  // Guardamos el índice en una constante para evitar
  // problemas de referencia dentro de los eventos.
  const indice = i;

  $(".formEditarproducto_" + indice).fireModal({

    title: 'Editar producto',

    body: modal_1_5_body,

    buttons: [
      {
        text: 'Guardar cambios',

        class: 'btn btn-success btn-shadow',

        handler: function (modal) {

          let formulario = document.getElementById(
            "formEditarproducto_" + indice
          );

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
}



/* =====================================================
   DEVOLUCIÓN DE PRODUCTOS CON SWEETALERT2
   ===================================================== */

$(document).on('click', '.btnDevolucionProducto', function () {

  const indice = $(this).data('indice');

  const campoCantidad = document.getElementById(
    'CantidadproductoEditar_' + indice
  );

  // Comprobar que el campo exista
  if (!campoCantidad) {
    console.error('No se encontró el campo de cantidad:', indice);
    return;
  }

  // Evitar que Bootstrap interfiera con el foco
  $(document).off('focusin.bs.modal');
  /* =====================================================
   SOLUCIÓN DE CONFLICTO ENTRE BOOTSTRAP Y SWEETALERT2
   ===================================================== */

  // Permitir que el foco se gestione fuera del modal Bootstrap.
  // Compatible con versiones de Bootstrap que utilizan
  // el evento focusin.bs.modal para mantener el foco.
  $(document).off('focusin.bs.modal');

  /* =====================================================
     ALERTA 1: CONFIRMAR DEVOLUCIÓN
     ===================================================== */

  Swal.fire({
    title: '¿Realizar devolución?',
    text: '¿Deseas registrar una devolución para este producto?',
    icon: 'question',

    showCancelButton: true,
    confirmButtonText: 'Sí, continuar',
    cancelButtonText: 'Cancelar',
    confirmButtonColor: '#198754', // Verde
    cancelButtonColor: '#dc3545',  // Rojo
    reverseButtons: true,

    allowOutsideClick: false,
    returnFocus: false

  }).then((resultado) => {

    if (!resultado.isConfirmed) {
      return;
    }

    /* =====================================================
       ALERTA 2: INGRESAR EL VALOR
       ===================================================== */

    Swal.fire({
      title: 'Registrar devolución',
      text: 'Ingresa el valor correspondiente a la devolución.',

      input: 'text',
      inputPlaceholder: 'Escribe aquí...',
      inputValue: '',

      inputAttributes: {
        autocomplete: 'off',
        autocapitalize: 'off',
        spellcheck: 'false'
      },

      showCancelButton: true,
      confirmButtonText: 'Confirmar devolución',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#198754', // Verde
      cancelButtonColor: '#dc3545',  // Rojo
      reverseButtons: true,

      allowOutsideClick: false,
      returnFocus: false,

      didOpen: () => {
        const input = Swal.getInput();

        if (input) {
          input.disabled = false;
          input.readOnly = false;
          input.focus();
        }
      },

      inputValidator: (valor) => {
        if (!valor || !valor.trim()) {
          return 'Debes ingresar un valor.';
        }
      }

    }).then((respuesta) => {

      // Si cancela, no modificar el campo
      if (!respuesta.isConfirmed) {
        return;
      }

      // Obtener el texto escrito en SweetAlert2
      const valorIngresado = respuesta.value.trim();

      // Colocar el valor en el campo correspondiente
      campoCantidad.value = valorIngresado;

      // Disparar eventos por si otros scripts escuchan cambios
      campoCantidad.dispatchEvent(
        new Event('input', { bubbles: true })
      );

      campoCantidad.dispatchEvent(
        new Event('change', { bubbles: true })
      );

      // Mantener el campo deshabilitado
      campoCantidad.disabled = true;

      console.log(
        'Valor asignado al producto ' + indice + ':',
        campoCantidad.value
      );

      // Confirmación
      Swal.fire({
        title: 'Devolución registrada',
        text: 'El valor se ha colocado correctamente.',
        icon: 'success',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#53b889', // Verde
        returnFocus: false
      });

    });

  });

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
modal_3_body += '<label for="correoRestablecer">Correo Electrónico<span style="color: red;">*</span></label>';
modal_3_body += '</div>';

modal_3_body += '<br>';

modal_3_body += '<div class="form-floating">';
modal_3_body += '<input type="password" class="form-control" id="nuevaPassword" name="nuevaPassword" placeholder="Contraseña" minlength="8" required>';
modal_3_body += '<label for="nuevaPassword">Nueva contraseña<span style="color: red;">*</span></label>';
modal_3_body += '</div>';

modal_3_body += '<br>';

modal_3_body += '<div class="form-floating">';
modal_3_body += '<input type="password" class="form-control" id="confirmarPassword" name="confirmarPassword" placeholder="Contraseña" minlength="8" required>';
modal_3_body += '<label for="confirmarPassword">Confirme contraseña<span style="color: red;">*</span></label>';
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
      handler: async function (modal) {

        const formulario = document.getElementById(
          'formRestablecerPassword_user'
        );

        // Validar campos obligatorios
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        const contraseñaAnterior = document.getElementById(
          'Contraseñaanti'
        ).value;

        const nuevaPassword = document.getElementById(
          'nuevaPassword_u'
        ).value;

        const confirmarPassword = document.getElementById(
          'confirmarPassword_u'
        ).value;

        // Validar longitud
        if (nuevaPassword.length < 8) {
          iziToast.error({
            title: 'Error',
            message: 'La nueva contraseña debe tener al menos 8 caracteres.',
            position: 'bottomRight'
          });
          return;
        }

        // Validar que la nueva contraseña sea diferente
        if (contraseñaAnterior === nuevaPassword) {
          iziToast.error({
            title: 'Error',
            message: 'La nueva contraseña debe ser diferente a la anterior.',
            position: 'bottomRight'
          });
          return;
        }

        // Verificar que las contraseñas coincidan
        if (nuevaPassword !== confirmarPassword) {
          iziToast.error({
            title: 'Error',
            message: 'Las contraseñas nuevas no coinciden.',
            position: 'bottomRight'
          });
          return;
        }

        try {
          const respuesta = await fetch(
            '../Back_end/Controlador/Cambiar_contrasena_usuario.php',
            {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              body: new URLSearchParams({
                contrasena_anterior: contraseñaAnterior,
                nueva_contrasena: nuevaPassword,
                confirmar_contrasena: confirmarPassword
              })
            }
          );

          const datos = await respuesta.json();

          // Si la sesión expiró, regresar al login
          if (respuesta.status === 401) {
            window.location.replace('login.html');
            return;
          }

          // Mostrar errores del servidor
          if (!respuesta.ok || datos.resultado !== 1) {
            iziToast.error({
              title: 'Error',
              message: datos.mensaje ||
                'No fue posible actualizar la contraseña.',
              position: 'bottomRight'
            });
            return;
          }

          // Limpiar el formulario
          formulario.reset();

          // Cerrar el modal
          modal.modal('hide');

          // Confirmar que la contraseña sí se actualizó
          iziToast.success({
            title: 'Contraseña actualizada',
            message: datos.mensaje,
            position: 'bottomRight'
          });

        } catch (error) {
          console.error('Error al actualizar la contraseña:', error);

          iziToast.error({
            title: 'Error',
            message: 'No se pudo conectar con el servidor.',
            position: 'bottomRight'
          });
        }
      }

    }
  ]
});



let modal_4_body = '<div>';
modal_4_body += '<form id="formRestablecerPassword_user">';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="Contraseñaanti" name="Contraseñaanti" placeholder="Contraseña anterior" autocomplete="current-password" required>';
modal_4_body += '<label for="Contraseñaanti">Contraseña anterior<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '<br>';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="nuevaPassword_u" name="nuevaPassword_u" placeholder="Nueva contraseña" minlength="8" autocomplete="new-password" required>';
modal_4_body += '<label for="nuevaPassword_u">Nueva contraseña<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '<br>';

modal_4_body += '<div class="form-floating">';
modal_4_body += '<input type="password" class="form-control" id="confirmarPassword_u" name="confirmarPassword_u" placeholder="Confirmar contraseña" minlength="8" autocomplete="new-password" required>';
modal_4_body += '<label for="confirmarPassword_u">Confirme contraseña<span style="color: red;">*</span></label>';
modal_4_body += '</div>';

modal_4_body += '<small class="text-muted d-block mt-2">';
modal_4_body += 'La nueva contraseña debe tener al menos 8 caracteres.';
modal_4_body += '</small>';

modal_4_body += '</form>';
modal_4_body += '</div>';

$("#modal-4").fireModal({
  title: 'Actualizar contraseña',

  body: modal_4_body,

  buttons: [
    {
      text: 'Cambiar contraseña',
      class: 'btn btn-success btn-shadow',

      handler: async function (modal) {

        const formulario = document.getElementById(
          'formRestablecerPassword_user'
        );

        // Validar campos obligatorios
        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        const contraseñaAnterior = document.getElementById(
          'Contraseñaanti'
        ).value;

        const nuevaPassword = document.getElementById(
          'nuevaPassword_u'
        ).value;

        const confirmarPassword = document.getElementById(
          'confirmarPassword_u'
        ).value;

        // Validar que la nueva contraseña sea diferente
        if (contraseñaAnterior === nuevaPassword) {
          iziToast.error({
            title: 'Error',
            message: 'La nueva contraseña debe ser diferente a la anterior.',
            position: 'bottomRight'
          });
          return;
        }

        // Validar coincidencia
        if (nuevaPassword !== confirmarPassword) {
          iziToast.error({
            title: 'Error',
            message: 'Las contraseñas nuevas no coinciden.',
            position: 'bottomRight'
          });
          return;
        }

        try {
          const respuesta = await fetch(
            '../Back_end/Controlador/Cambiar_contrasena_usuario.php',
            {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
              },
              body: new URLSearchParams({
                contrasena_anterior: contraseñaAnterior,
                nueva_contrasena: nuevaPassword,
                confirmar_contrasena: confirmarPassword
              })
            }
          );

          // Leer la respuesta del servidor
          const texto = await respuesta.text();
          let datos;

          try {
            datos = JSON.parse(texto);
          } catch (error) {
            console.error(
              'Respuesta no válida del servidor:',
              texto
            );

            iziToast.error({
              title: 'Error',
              message: 'El servidor no devolvió una respuesta válida. Revisa el controlador PHP.',
              position: 'bottomRight'
            });
            return;
          }

          // Si la sesión expiró
          if (respuesta.status === 401) {
            window.location.replace('login.html');
            return;
          }

          // Verificar el resultado de PHP
          if (!respuesta.ok || datos.resultado !== 1) {
            iziToast.error({
              title: 'Error',
              message: datos.mensaje ||
                'No se pudo actualizar la contraseña.',
              position: 'bottomRight'
            });
            return;
          }

          // Solo cerrar el modal cuando PHP confirme el cambio
          modal.modal('hide');

          formulario.reset();

          iziToast.success({
            title: 'Contraseña actualizada',
            message: datos.mensaje,
            position: 'bottomRight'
          });

        } catch (error) {
          console.error(
            'Error al enviar las contraseñas:',
            error
          );

          iziToast.error({
            title: 'Error de conexión',
            message: 'No se pudo conectar con el servidor PHP.',
            position: 'bottomRight'
          });
        }
      }
    }
  ]
});

// =====================================================
// MODAL PARA ACTUALIZAR INFORMACIÓN DEL USUARIO
// =====================================================

let modal_5_body = '<div>';
modal_5_body += '<form id="Actu_user" enctype="multipart/form-data">';

// ID oculto del usuario
modal_5_body += '<input type="hidden" id="Id_usuario_actual" name="Id_usuario">';

// Foto actual
modal_5_body += '<div class="text-center mb-3">';
modal_5_body += '<img id="Foto_usuario_actual" class="img-fluid rounded-circle" ';
modal_5_body += 'src="assets/img/avatar-4.png" alt="Foto actual del usuario" ';
modal_5_body += 'style="width:120px;height:120px;object-fit:cover;">';
modal_5_body += '</div>';

// Foto nueva
modal_5_body += '<label for="Foto_usuario_nueva" class="form-label">Foto de usuario</label>';
modal_5_body += '<input class="form-control" type="file" id="Foto_usuario_nueva" ';
modal_5_body += 'name="Foto_usuario" accept="image/jpeg,image/png,image/webp">';
modal_5_body += '<small class="text-muted">Formatos permitidos: JPG, PNG o WEBP. Máximo 5 MB.</small>';
modal_5_body += '<br><br>';

// Nombre
modal_5_body += '<label for="Nombre_usuario_actualizar" class="form-label">Nombre de usuario</label>';
modal_5_body += '<div class="input-group mb-3">';
modal_5_body += '<span class="input-group-text"><i class="fas fa-user"></i></span>';
modal_5_body += '<input type="text" class="form-control" ';
modal_5_body += 'id="Nombre_usuario_actualizar" name="Nombre_usuario" ';
modal_5_body += 'placeholder="Nombre de usuario" maxlength="100">';
modal_5_body += '</div>';

// Correo
modal_5_body += '<div class="input-group mb-3">';
modal_5_body += '<input type="email" class="form-control" ';
modal_5_body += 'id="Email_usuario_actualizar" name="Email_usuario" ';
modal_5_body += 'placeholder="Correo electrónico" maxlength="500" hidden>';
modal_5_body += '</div>';

// Descripción
modal_5_body += '<label for="Descripcion_usuario_actualizar" class="form-label">Descripción</label>';
modal_5_body += '<div class="form-floating">';
modal_5_body += '<textarea class="form-control" placeholder="Descripción" ';
modal_5_body += 'id="Descripcion_usuario_actualizar" ';
modal_5_body += 'name="Descripcion_usuario" maxlength="5000" ';
modal_5_body += 'style="height:120px"></textarea>';
modal_5_body += '</div>';

// Contador
modal_5_body += '<div class="text-right text-muted mt-1" style="font-size:12px;">';
modal_5_body += '<span id="charCounter">0</span> / 5000 caracteres';
modal_5_body += '</div>';

modal_5_body += '</form>';
modal_5_body += '</div>';


// =====================================================
// CARGAR LOS DATOS DESDE LA BASE DE DATOS
// =====================================================

async function cargarDatosModalUsuario() {
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

    if (respuesta.status === 401) {
      window.location.replace('login.html');
      return;
    }

    if (!respuesta.ok || datos.resultado !== 1) {
      iziToast.error({
        title: 'Error',
        message: datos.mensaje ||
          'No se pudieron cargar los datos del usuario.',
        position: 'bottomRight'
      });
      return;
    }

    const usuario = datos.usuario;

    // Comprobar que los campos del modal ya existen
    const id = document.getElementById('Id_usuario_actual');
    const nombre = document.getElementById('Nombre_usuario_actualizar');
    const email = document.getElementById('Email_usuario_actualizar');
    const descripcion = document.getElementById(
      'Descripcion_usuario_actualizar'
    );
    const foto = document.getElementById('Foto_usuario_actual');
    const contador = document.getElementById('charCounter');

    if (!id || !nombre || !email || !descripcion || !foto) {
      console.error('No se encontraron los campos del modal.');
      return;
    }

    // Rellenar el formulario
    id.value = usuario.Id_usuario ?? '';
    nombre.value = usuario.Nombre_usuario ?? '';
    email.value = usuario.Email_usuario ?? '';
    descripcion.value = usuario.Descripcion_usuario ?? '';

    if (contador) {
      contador.textContent = descripcion.value.length;
    }

    // Foto guardada en la base de datos
    foto.src = usuario.Foto_usuario ||
      'assets/img/avatar-4.png';

  } catch (error) {
    console.error('Error al cargar los datos del modal:', error);

    iziToast.error({
      title: 'Error',
      message: 'No fue posible consultar la información del usuario.',
      position: 'bottomRight'
    });
  }
}


// =====================================================
// CONTADOR DE CARACTERES
// =====================================================

$(document).on(
  'input',
  '#Descripcion_usuario_actualizar',
  function () {
    $('#charCounter').text(this.value.length);
  }
);


// =====================================================
// VISTA PREVIA DE LA FOTO
// =====================================================

let urlFotoTemporal = null;

$(document).on('change', '#Foto_usuario_nueva', function () {
  const archivo = this.files[0];

  if (!archivo) {
    return;
  }

  const tiposPermitidos = [
    'image/jpeg',
    'image/png',
    'image/webp'
  ];

  if (!tiposPermitidos.includes(archivo.type)) {
    iziToast.error({
      title: 'Archivo no válido',
      message: 'Selecciona una imagen JPG, PNG o WEBP.',
      position: 'bottomRight'
    });

    this.value = '';
    return;
  }

  if (archivo.size > 5 * 1024 * 1024) {
    iziToast.error({
      title: 'Imagen demasiado grande',
      message: 'La imagen no puede superar los 5 MB.',
      position: 'bottomRight'
    });

    this.value = '';
    return;
  }

  if (urlFotoTemporal) {
    URL.revokeObjectURL(urlFotoTemporal);
  }

  urlFotoTemporal = URL.createObjectURL(archivo);

  const imagen = document.getElementById('Foto_usuario_actual');

  if (imagen) {
    imagen.src = urlFotoTemporal;
  }
});


// =====================================================
// ABRIR EL MODAL
// =====================================================

$("#modal-5").fireModal({
  title: 'Actualizar información',

  body: modal_5_body,

  buttons: [
    {
      text: 'Actualizar información',
      class: 'btn btn-success btn-shadow',

      handler: async function (modal) {
        const formulario = document.getElementById('Actu_user');

        if (!formulario) {
          iziToast.error({
            title: 'Error',
            message: 'No se encontró el formulario.',
            position: 'bottomRight'
          });
          return;
        }

        if (!formulario.checkValidity()) {
          formulario.reportValidity();
          return;
        }

        const idUsuario = document.getElementById(
          'Id_usuario_actual'
        ).value;

        if (!idUsuario) {
          iziToast.error({
            title: 'Error',
            message: 'No se identificó al usuario que deseas actualizar.',
            position: 'bottomRight'
          });
          return;
        }

        const datosFormulario = new FormData(formulario);

        // Evitar dobles envíos mientras se procesa
        const boton = $(modal).find('.btn-success');
        boton.prop('disabled', true);

        try {
          const respuesta = await fetch(
            '../Back_end/Controlador/Actualizar_usuario.php',
            {
              method: 'POST',
              credentials: 'same-origin',
              headers: {
                'Accept': 'application/json'
              },
              body: datosFormulario
            }
          );

          const texto = await respuesta.text();
          let datos;

          try {
            datos = JSON.parse(texto);
          } catch (error) {
            console.error('Respuesta del servidor:', texto);

            iziToast.error({
              title: 'Error',
              message: 'El servidor no devolvió JSON válido.',
              position: 'bottomRight'
            });
            return;
          }

          if (respuesta.status === 401) {
            window.location.replace('login.html');
            return;
          }

          if (!respuesta.ok || datos.resultado !== 1) {
            iziToast.error({
              title: 'Error',
              message: datos.mensaje ||
                'No se pudo actualizar la información.',
              position: 'bottomRight'
            });
            return;
          }

          iziToast.success({
            title: 'Información actualizada',
            message: datos.mensaje ||
              'Tu perfil se actualizó correctamente.',
            position: 'bottomRight'
          });

          // Liberar la URL temporal de la foto
          if (urlFotoTemporal) {
            URL.revokeObjectURL(urlFotoTemporal);
            urlFotoTemporal = null;
          }

          // Cerrar el modal
          modal.modal('hide');

          // Actualizar la información visible en la página
          if (typeof consultarUsuarioSesion === 'function') {
            await consultarUsuarioSesion();
          }

          // Recargar para reflejar todos los cambios
          setTimeout(function () {
            location.reload();
          }, 1200);

        } catch (error) {
          console.error('Error al actualizar usuario:', error);

          iziToast.error({
            title: 'Error de conexión',
            message: 'No fue posible conectar con el servidor.',
            position: 'bottomRight'
          });
        } finally {
          boton.prop('disabled', false);
        }
      }
    }
  ]
});


// =====================================================
// CARGAR DATOS AL ABRIR EL MODAL
// =====================================================

// El botón o elemento #modal-5 abre el modal.
// fireModal inserta el formulario; esperamos un momento
// para que sus campos estén disponibles en el DOM.

$(document).on('click', '#modal-5', function () {
  setTimeout(function () {
    if (document.getElementById('Actu_user')) {
      cargarDatosModalUsuario();
    }
  }, 100);
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