"use strict";

$("#modal-1").fireModal({ body: 'Modal body text goes here.' });
$("#modal-2").fireModal({ body: 'Modal body text goes here.', center: true });

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