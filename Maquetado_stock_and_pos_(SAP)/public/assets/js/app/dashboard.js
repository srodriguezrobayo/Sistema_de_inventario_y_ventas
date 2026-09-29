(() => {
    const chartCanvas = document.getElementById('myChart4');
    if (!chartCanvas) return;

    const currency = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 2
    }).format(value);

    const loadDashboard = async () => {
        const response = await fetch('api/dashboard.php', { credentials: 'same-origin' });
        if (response.status === 401) return window.location.assign('Login.html');
        const summary = await response.json();
        if (!response.ok) throw new Error('request_failed');

        const profileResponse = await fetch('api/profile.php', { credentials: 'same-origin' });
        const profilePayload = await profileResponse.json();
        if (!profileResponse.ok) throw new Error('profile_failed');

        document.getElementById('dashboardGreeting').textContent = `Hola, ${profilePayload.profile.name}. ¿Qué deseas realizar?`;
        document.getElementById('dashboardProducts').textContent = summary.product_count;
        document.getElementById('dashboardLowStock').textContent = summary.low_stock_count;
        document.getElementById('dashboardSales').textContent = summary.sales_count;
        document.getElementById('dashboardRevenue').textContent = currency(summary.sales_total);

        const products = summary.top_products;
        new window.Chart(chartCanvas.getContext('2d'), {
            type: 'bar',
            data: {
                labels: products.length ? products.map((product) => product.name) : ['Sin ventas este mes'],
                datasets: [{
                    label: 'Unidades vendidas',
                    data: products.length ? products.map((product) => Number(product.quantity_sold)) : [0],
                    backgroundColor: ['#348b70', '#e09b43', '#537fa5', '#ca6658', '#7f8e54']
                }]
            },
            options: { responsive: true, legend: { display: false }, scales: { yAxes: [{ ticks: { beginAtZero: true } }] } }
        });

        if (window.jQuery?.fn.fullCalendar) {
            const calendar = window.jQuery('#myEvent');
            calendar.fullCalendar({
                height: 'auto',
                header: { left: 'prev,next today', center: 'title', right: 'month,agendaWeek,listWeek' },
                buttonText: { today: 'Hoy' },
                events: summary.expiring.map((batch) => ({
                    title: `${batch.name} · lote ${batch.lot || 'sin código'}`,
                    start: batch.expires_on,
                    allDay: true,
                    color: '#c96b38'
                }))
            });
        }
    };

    loadDashboard().catch(() => {
        window.iziToast.error({ title: 'Error', message: 'No fue posible cargar el resumen del negocio.' });
    });
})();