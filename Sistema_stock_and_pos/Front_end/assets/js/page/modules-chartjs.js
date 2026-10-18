
"use strict";

document.addEventListener("DOMContentLoaded", function () {
  const canvas = document.getElementById("myChart3");

  if (!canvas) {
    console.error("No se encontró el canvas myChart3.");
    return;
  }

  const ctx = canvas.getContext("2d");

  let myChart3 = null;

  const colores = [
    "#C85B88",
    "#6BB18E",
    "#DC9658",
    "#DA6353",
    "#6C7BB3",
    "#8E6BB1",
    "#55A6B8",
    "#D8B65C",
    "#7C9A65",
    "#B76E79"
  ];

  fetch(
    "/Sistema_stock_and_pos/Back_end/Controlador/Grafica_productos_vendidos.php",
    {
      method: "GET",
      headers: {
        "Accept": "application/json"
      },
      credentials: "same-origin"
    }
  )
    .then(function (respuesta) {
      if (!respuesta.ok) {
        throw new Error(
          "Error HTTP: " + respuesta.status
        );
      }

      return respuesta.json();
    })
    .then(function (productos) {
      if (!Array.isArray(productos)) {
        throw new Error(
          productos.error || "La respuesta del servidor no es válida."
        );
      }

      const productosValidos = productos.filter(function (producto) {
        return Number(producto.Cantidad_salida) > 0;
      });

      const etiquetas = productosValidos.map(function (producto) {
        return producto.Nombre_producto;
      });

      const cantidades = productosValidos.map(function (producto) {
        return Number(producto.Cantidad_salida);
      });

      if (myChart3) {
        myChart3.destroy();
      }

      myChart3 = new Chart(ctx, {
        type: "doughnut",

        data: {
          labels: etiquetas,

          datasets: [{
            data: cantidades,

            backgroundColor: etiquetas.map(function (_, indice) {
              return colores[indice % colores.length];
            }),

            label: "Unidades vendidas netas"
          }]
        },

        options: {
          responsive: true,

          legend: {
            position: "bottom"
          },

          tooltips: {
            callbacks: {
              label: function (tooltipItem, data) {
                const nombre =
                  data.labels[tooltipItem.index];

                const cantidad =
                  data.datasets[0].data[tooltipItem.index];

                return nombre + ": " + cantidad + " unidades";
              }
            }
          }
        }
      });

      if (productosValidos.length === 0) {
        console.info(
          "No hay cantidades netas positivas para mostrar."
        );
      }
    })
    .catch(function (error) {
      console.error(
        "Error al cargar la gráfica de productos vendidos:",
        error
      );
    });
});


var ctx = document.getElementById("myChart").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      label: 'Statistics',
      data: [460, 458, 330, 502, 430, 610, 488],
      borderWidth: 2,
      backgroundColor: '#6777ef',
      borderColor: '#6777ef',
      borderWidth: 2.5,
      pointBackgroundColor: '#ffffff',
      pointRadius: 4
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        gridLines: {
          drawBorder: false,
          color: '#f2f2f2',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 150
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }]
    },
  }
});

var ctx = document.getElementById("myChart2").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'bar',
  data: {
    labels: ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
    datasets: [{
      label: 'Statistics',
      data: [460, 458, 330, 502, 430, 610, 488],
      borderWidth: 2,
      backgroundColor: '#6777ef',
      borderColor: '#6777ef',
      borderWidth: 2.5,
      pointBackgroundColor: '#ffffff',
      pointRadius: 4
    }]
  },
  options: {
    legend: {
      display: false
    },
    scales: {
      yAxes: [{
        gridLines: {
          drawBorder: false,
          color: '#f2f2f2',
        },
        ticks: {
          beginAtZero: true,
          stepSize: 150
        }
      }],
      xAxes: [{
        ticks: {
          display: false
        },
        gridLines: {
          display: false
        }
      }]
    },
  }
});

var ctx = document.getElementById("myChart4").getContext('2d');
var myChart = new Chart(ctx, {
  type: 'pie',
  data: {
    datasets: [{
      data: [
        80,
        50,
        40,
        30,
        20,
      ],
      backgroundColor: [
        '#191d21',
        '#63ed7a',
        '#ffa426',
        '#fc544b',
        '#6777ef',
      ],
      label: 'Dataset 1'
    }],
    labels: [
      'Black',
      'Green',
      'Yellow',
      'Red',
      'Blue'
    ],
  },
  options: {
    responsive: true,
    legend: {
      position: 'bottom',
    },
  }
});