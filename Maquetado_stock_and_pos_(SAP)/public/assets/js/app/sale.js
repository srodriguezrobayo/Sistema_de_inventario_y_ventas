(() => {
    const form = document.getElementById('formVenta');
    if (!form) return;

    const productSelect = document.getElementById('saleProduct');
    const quantityInput = document.getElementById('cant_vender');
    const cartElement = document.getElementById('saleCart');
    const cart = new Map();
    let products = [];

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

    const updatePreview = () => {
        const product = products.find((item) => String(item.id) === productSelect.value);
        const quantity = Number(quantityInput.value || 0);
        document.getElementById('saleUnitPrice').textContent = currency(Number(product?.price || 0));
        document.getElementById('saleCurrentTotal').textContent = currency(Number(product?.price || 0) * quantity);
    };

    const renderCart = () => {
        cartElement.replaceChildren();
        let total = 0;
        cart.forEach((quantity, id) => {
            const product = products.find((item) => Number(item.id) === Number(id));
            if (!product) return;
            const subtotal = Number(product.price) * quantity;
            total += subtotal;
            const row = document.createElement('div');
            row.className = 'd-flex align-items-center justify-content-between border rounded p-2';
            const description = document.createElement('span');
            description.textContent = `${product.name} · ${quantity} ${product.unit} · ${currency(subtotal)}`;
            const remove = document.createElement('button');
            remove.type = 'button';
            remove.className = 'btn btn-sm btn-outline-danger';
            remove.textContent = 'Quitar';
            remove.addEventListener('click', () => {
                cart.delete(id);
                renderCart();
            });
            row.append(description, remove);
            cartElement.append(row);
        });
        if (cart.size === 0) {
            const empty = document.createElement('p');
            empty.className = 'text-muted mb-0';
            empty.textContent = 'Agrega productos para registrar la venta.';
            cartElement.append(empty);
        }
        document.getElementById('saleTotal').textContent = currency(total);
    };

    const loadFormData = async () => {
        try {
            const [productResponse, profileResponse] = await Promise.all([
                request('api/products.php'),
                request('api/profile.php')
            ]);
            products = productResponse.products.filter((product) => Number(product.quantity) > 0);
            productSelect.replaceChildren(new Option('Selecciona un producto', ''));
            products.forEach((product) => {
                productSelect.add(new Option(`${product.name} · stock ${product.quantity}`, product.id));
            });
            document.getElementById('saleUserName').textContent = profileResponse.profile.name;
            document.getElementById('Fechaexpedicion').value = new Date().toLocaleDateString('es-CO');
            renderCart();
            updatePreview();
        } catch (error) {
            if (error.message !== 'authentication_required') window.iziToast.error({ title: 'Error', message: 'No se pudo cargar el inventario.' });
        }
    };

    productSelect.addEventListener('change', updatePreview);
    quantityInput.addEventListener('input', updatePreview);
    document.getElementById('addSaleItem').addEventListener('click', () => {
        const product = products.find((item) => String(item.id) === productSelect.value);
        const quantity = Number(quantityInput.value);
        const alreadyAdded = cart.get(String(product?.id)) || 0;
        if (!product || !Number.isInteger(quantity) || quantity < 1 || alreadyAdded + quantity > Number(product.quantity)) {
            window.iziToast.error({ title: 'Cantidad no válida', message: 'Verifica el producto y el stock disponible.' });
            return;
        }
        cart.set(String(product.id), alreadyAdded + quantity);
        quantityInput.value = '';
        renderCart();
        updatePreview();
    });
    document.getElementById('removeSaleItem').addEventListener('click', () => {
        const lastId = Array.from(cart.keys()).pop();
        if (lastId !== undefined) cart.delete(lastId);
        renderCart();
    });

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (cart.size === 0) return;
        const submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        try {
            const result = await request('api/sales.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ items: Array.from(cart, ([productId, quantity]) => ({ product_id: Number(productId), quantity })) })
            });
            window.location.assign(`send_bill.html?id=${encodeURIComponent(result.id)}`);
        } catch (error) {
            const text = error.message === 'insufficient_stock'
                ? 'El stock cambió; revisa las cantidades e intenta de nuevo.'
                : 'No se pudo registrar la venta.';
            window.iziToast.error({ title: 'Venta no registrada', message: text });
            submit.disabled = false;
        }
    });

    loadFormData();
})();