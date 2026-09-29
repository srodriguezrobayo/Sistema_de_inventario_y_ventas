(() => {
    const tableElement = document.getElementById('table-1');
    if (!tableElement || !window.jQuery?.fn.DataTable) return;

    tableElement.querySelector('tbody')?.replaceChildren();
    const table = window.jQuery(tableElement).DataTable();
    const loadSales = async () => {
        try {
            const response = await fetch('api/sales.php', { credentials: 'same-origin' });
            if (response.status === 401) return window.location.assign('Login.html');
            const payload = await response.json();
            if (!response.ok) throw new Error('request_failed');

            table.clear();
            payload.sales.forEach((sale, index) => {
                const date = new Date(sale.sold_at.replace(' ', 'T')).toLocaleString('es-CO');
                const status = Number(sale.invoice_sent) === 1
                    ? '<span class="badge badge-success">Factura enviada</span>'
                    : '<span class="badge badge-secondary">Sin enviar</span>';
                const action = `<a href="send_bill.html?id=${encodeURIComponent(sale.id)}" class="btn btn-light"><i class="fas fa-eye"></i> Ver factura</a>`;
                table.row.add([index + 1, `Factura ${sale.id}`, date, status, action]);
            });
            table.draw();
        } catch {
            window.iziToast.error({ title: 'Error', message: 'No se pudo cargar el historial de ventas.' });
        }
    };

    loadSales();
})();