document.addEventListener('DOMContentLoaded', function () {
  // 1. Inicializar Librería de Animaciones (AOS)
  AOS.init({
    duration: 800,
    once: true
  });

  // 2. Toggler para la barra lateral
  const menuToggle = document.getElementById('menu-toggle');
  const wrapper = document.getElementById('wrapper');
  if (menuToggle) {
    menuToggle.addEventListener('click', function (e) {
      e.preventDefault();
      wrapper.classList.toggle('toggled');
    });
  }

  // 3. Inicializar FullCalendar
  const calendarEl = document.getElementById('calendar');
  if (calendarEl) {
    const calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: 'dayGridMonth',
      locale: 'es',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,listWeek'
      },
      buttonText: {
        today:    'Hoy',
        month:    'Mes',
        week:     'Semana',
        list:     'Agenda'
      },
      events: [
        { title: 'Revisión de Inventario', start: new Date().toISOString().split('T')[0] }
      ]
    });
    calendar.render();
  }

  // 4. Inicializar Gráfico de Productos con Chart.js (Estilo Doughnut)
  const ctx = document.getElementById('productsChart');
  if (ctx) {
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: ['Arroz', 'Galletas', 'Gomitas', 'Chocolates', 'Aceite'],
        datasets: [{
          data: [25, 15, 12, 28, 20],
          backgroundColor: [
            '#e63946',
            '#2a9d8f',
            '#e76f51',
            '#f4a261',
            '#457b9d'
          ],
          borderWidth: 2,
          borderColor: '#ffffff',
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              padding: 15,
              usePointStyle: true,
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: 'rgba(0,0,0,0.8)',
            padding: 12
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
});