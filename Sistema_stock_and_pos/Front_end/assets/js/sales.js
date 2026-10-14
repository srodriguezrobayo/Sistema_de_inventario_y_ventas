    $(document).ready(function() {
      
      // 1. Inicialización de Select2
      $('.select2-enable').select2({
        placeholder: 'Buscar o seleccionar producto...',
        allowClear: true
      });

      let carrito = [];

      // 2. Evento Cambio en Select2 para actualizar Precio Unitario
      $('#selectProducto').on('change', function() {
        const optionSelected = $(this).find('option:selected');
        const precio = parseFloat(optionSelected.data('precio')) || 0;
        $('#precioUnitario').text(`$${precio.toFixed(2)}`);
      });

      // 3. Agregar elemento al carrito
      $('#btnAdd').on('click', function() {
        const optionSelected = $('#selectProducto').find('option:selected');
        const id = $('#selectProducto').val();

        if (!id) {
          Swal.fire({ icon: 'info', title: 'Atención', text: 'Por favor selecciona un producto.', confirmButtonColor: '#224247' });
          return;
        }

        const nombre = optionSelected.data('nombre');
        const precio = parseFloat(optionSelected.data('precio'));
        const cantidad = parseInt($('#inputCantidad').val()) || 1;

        if (cantidad <= 0) return;

        const itemExistente = carrito.find(item => item.id === id);
        if (itemExistente) {
          itemExistente.cantidad += cantidad;
          itemExistente.subtotal = itemExistente.cantidad * itemExistente.precio;
        } else {
          carrito.push({
            id: id,
            nombre: nombre,
            precio: precio,
            cantidad: cantidad,
            subtotal: precio * cantidad
          });
        }

        actualizarTabla();
        resetCampos();
      });

      // 4. Quitar Último Elemento
      $('#btnRemove').on('click', function() {
        if (carrito.length > 0) {
          carrito.pop();
          actualizarTabla();
        }
      });

      // 5. Eliminar elemento individual
      $(document).on('click', '.btn-delete-row', function() {
        const index = $(this).data('index');
        carrito.splice(index, 1);
        actualizarTabla();
      });

      // 6. Actualizar Tabla y Totales
      function actualizarTabla() {
        const tbody = $('#cartTableBody');
        tbody.empty();

        if (carrito.length === 0) {
          tbody.append(`
            <tr id="emptyRow">
              <td colspan="5" class="text-center text-muted py-3">No hay productos agregados</td>
            </tr>
          `);
          $('#subtotalVal').text('$0.00');$('#totalVal').text('$0.00');
          return;
        }

        let totalPagar = 0;

        carrito.forEach((item, index) => {
          totalPagar += item.subtotal;
          tbody.append(`
            <tr>
              <td class="fw-semibold">${item.nombre}</td>
              <td class="text-center">${item.cantidad}</td>
              <td class="text-end">$${item.precio.toFixed(2)}</td>
              <td class="text-end fw-bold">$${item.subtotal.toFixed(2)}</td>
              <td class="text-center">
                <button type="button" class="btn btn-sm text-danger border-0 btn-delete-row" data-index="${index}">
                  <i class="fas fa-times"></i>
                </button>
              </td>
            </tr>
          `);
        });

        $('#subtotalVal').text(`$${totalPagar.toFixed(2)}`);
        $('#totalVal').text(`$${totalPagar.toFixed(2)}`);
      }

      function resetCampos() {
        $('#selectProducto').val(null).trigger('change');
        $('#precioUnitario').text('$0.00');$('#inputCantidad').val('1');
      }

      // 7. Evento Realizar Venta -> Pide el correo con SweetAlert2
      $('#btnCheckout').on('click', function() {
        if (carrito.length === 0) {
          Swal.fire({
            icon: 'warning',
            title: 'Carrito vacío',
            text: 'Agrega productos antes de realizar la venta.',
            confirmButtonColor: '#224247'
          });
          return;
        }

        const totalPagar = $('#totalVal').text();

        // Alerta SweetAlert2 para capturar el correo
        Swal.fire({
          title: 'Realizar Venta',
          text: `Total a cobrar: ${totalPagar}. Ingrese el correo para enviar la factura:`,
          input: 'email',
          inputPlaceholder: 'correo@cliente.com',
          showCancelButton: true,
          confirmButtonText: 'Enviar Factura y Finalizar',
          cancelButtonText: 'Omitir / Solo Cobrar',
          confirmButtonColor: '#10b981',
          cancelButtonColor: '#64748b'
        }).then((result) => {
          // Construimos el objeto de la venta para guardarlo en la base de datos o histórico
          const objetoVenta = {
            numFactura: $('#lblNumFactura').text(),
            cajero: $('#lblCajero').text(),
            fecha: $('#lblFechaExp').text(),
            items: carrito,
            total: totalPagar,
            correoCliente: result.isConfirmed ? result.value : 'No registrado'
          };

          console.log("Datos de la venta procesada:", objetoVenta);

          if (result.isConfirmed && result.value) {
            Swal.fire({
              icon: 'success',
              title: '¡Venta Realizada!',
              text: `Factura enviada exitosamente a: ${result.value}`,
              confirmButtonColor: '#224247',
              willClose: () => {
                window.location.href = "History_sales.html";
              }
            });
          } else {
            Swal.fire({
              icon: 'success',
              title: '¡Venta Realizada!',
              text: 'La venta ha sido registrada correctamente.',
              confirmButtonColor: '#224247'
            });
          }

          // Reiniciar para la siguiente venta
          carrito = [];
          actualizarTabla();
          resetCampos();
        });
      });

    });