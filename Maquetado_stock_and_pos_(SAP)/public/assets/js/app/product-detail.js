(() => {
    const name = document.getElementById('detailName');
    if (!name) return;

    const productId = new URLSearchParams(window.location.search).get('id');
    if (!productId) return window.location.assign('Stock.html');

    fetch(`api/products.php?id=${encodeURIComponent(productId)}`, { credentials: 'same-origin' })
        .then(async (response) => {
            if (response.status === 401) return window.location.assign('Login.html');
            const payload = await response.json();
            if (!response.ok) throw new Error('not_found');
            return payload.product;
        })
        .then((product) => {
            if (!product) return;
            name.textContent = product.name;
            document.getElementById('detailCode').textContent = product.code;
            document.getElementById('detailStock').textContent = `${product.quantity} ${product.unit}`;
            document.getElementById('detailPerishable').textContent = Number(product.has_expiry) === 1 ? 'Sí' : 'No';
            const list = document.getElementById('expirationList');
            list.replaceChildren();
            const batches = product.batches.filter((batch) => batch.expires_on);
            if (batches.length === 0) {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.textContent = 'No hay lotes con fecha de vencimiento registrada.';
                list.append(item);
                return;
            }
            batches.forEach((batch) => {
                const item = document.createElement('li');
                item.className = 'list-group-item';
                item.textContent = `${batch.expires_on} · Lote ${batch.lot || 'sin código'} · Recibido: ${batch.quantity}`;
                list.append(item);
            });
        })
        .catch(() => {
            window.iziToast.error({ title: 'Error', message: 'No se pudo cargar el producto.' });
        });
})();