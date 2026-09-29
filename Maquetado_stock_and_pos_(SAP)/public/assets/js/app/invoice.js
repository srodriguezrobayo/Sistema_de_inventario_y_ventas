(() => {
    const form = document.getElementById('formenvioVenta');
    if (!form) return;

    const saleId = new URLSearchParams(window.location.search).get('id');
    const currency = (value) => new Intl.NumberFormat('es-CO', {
        style: 'currency', currency: 'COP', maximumFractionDigits: 2
    }).format(value);

    const request = async (url, options = {}) => {
        const response = await fetch(url, { credentials: 'same-origin', ...options });
        if (response.status === 401) {
            window.location.assign('Login.html');
            throw new Error('authentication_required');
        }
        const payload = await response.json();
        if (!response.ok) throw new Error(payload.error || 'request_failed');
        return payload;
    };

    const showError = (text) => window.iziToast.error({ title: 'Error', message: text });

    const loadInvoice = async () => {
        if (!saleId) {
            window.location.assign('History_sales.html');
            return null;
        }

        const [saleResponse, profileResponse] = await Promise.all([
            request(`api/sales.php?id=${encodeURIComponent(saleId)}`),
            request('api/profile.php')
        ]);
        const sale = saleResponse.sale;
        document.getElementById('invoiceUserName').textContent = profileResponse.profile.name;
        document.getElementById('invoiceNumber').textContent = sale.id;
        document.getElementById('invoiceDate').textContent = new Date(sale.sold_at.replace(' ', 'T')).toLocaleString('es-CO');

        const body = document.getElementById('invoiceItems');
        body.replaceChildren();
        sale.items.forEach((item) => {
            const row = document.createElement('tr');
            [item.name, `${item.quantity}`, currency(item.unit_price), currency(item.subtotal)].forEach((text) => {
                const cell = document.createElement('td');
                cell.textContent = text;
                row.append(cell);
            });
            body.append(row);
        });
        const totalRow = document.createElement('tr');
        const label = document.createElement('td');
        label.colSpan = 3;
        label.className = 'text-end font-weight-bold';
        label.textContent = 'Total';
        const total = document.createElement('td');
        total.className = 'font-weight-bold';
        total.textContent = currency(sale.total);
        totalRow.append(label, total);
        body.append(totalRow);

        return sale;
    };

    let sale;
    loadInvoice().then((loadedSale) => { sale = loadedSale; }).catch((error) => {
        if (error.message !== 'authentication_required') showError('No se encontró la factura.');
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!sale) return;

        const result = await window.Swal.fire({
            title: 'Enviar factura',
            input: 'email',
            inputLabel: 'Correo del cliente',
            inputValue: sale.invoice_email || '',
            inputPlaceholder: 'cliente@ejemplo.com',
            showCancelButton: true,
            confirmButtonText: 'Enviar',
            cancelButtonText: 'Cancelar',
            inputValidator: (value) => !value ? 'Ingresa un correo válido.' : undefined
        });
        if (!result.isConfirmed) return;

        try {
            await request(`api/sales.php?id=${encodeURIComponent(sale.id)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'send-invoice', email: result.value })
            });
            window.iziToast.success({ title: 'Factura enviada', message: `Enviada a ${result.value}.` });
            window.setTimeout(() => window.location.assign('History_sales.html'), 1200);
        } catch (error) {
            showError(error.message === 'email_unavailable'
                ? 'Configura SAP_MAIL_FROM y el correo saliente de PHP antes de enviar facturas.'
                : 'No fue posible enviar la factura.');
        }
    });
})();