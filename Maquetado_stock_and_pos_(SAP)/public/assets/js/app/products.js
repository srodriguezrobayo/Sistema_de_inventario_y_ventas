(() => {
    const grid = document.getElementById('productGrid');
    if (!grid) return;

    const productDialog = document.getElementById('productDialog');
    const productForm = document.getElementById('productForm');
    const stockDialog = document.getElementById('stockDialog');
    const stockForm = document.getElementById('stockForm');
    const searchInput = document.getElementById('productSearch');
    const lowStockFilter = document.getElementById('checkDefault');
    const hasExpiry = document.getElementById('productHasExpiry');
    const knowsExpiry = document.getElementById('productKnowsExpiry');
    const expiryInput = document.getElementById('productExpiry');
    const initialQuantityField = document.getElementById('initialQuantityField');
    let products = [];

    const showMessage = (type, message) => {
        if (window.iziToast) {
            window.iziToast[type]({ title: type === 'error' ? 'Error' : 'Listo', message });
        } else {
            window.alert(message);
        }
    };

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

    const makeElement = (tag, className, text) => {
        const element = document.createElement(tag);
        if (className) element.className = className;
        if (text !== undefined) element.textContent = text;
        return element;
    };

    const createButton = (text, className, handler) => {
        const button = makeElement('button', className, text);
        button.type = 'button';
        button.addEventListener('click', handler);
        return button;
    };

    const render = () => {
        const query = (searchInput?.value || '').trim().toLocaleLowerCase();
        const onlyLowStock = Boolean(lowStockFilter?.checked);
        const visible = products.filter((product) => {
            const matchesSearch = `${product.name} ${product.code}`.toLocaleLowerCase().includes(query);
            return matchesSearch && (!onlyLowStock || Number(product.quantity) <= Number(product.minimum_stock));
        });

        grid.replaceChildren();
        if (visible.length === 0) {
            grid.append(makeElement('p', 'col-12 text-center text-muted', 'No hay productos que coincidan con la búsqueda.'));
            return;
        }

        visible.forEach((product) => {
            const column = makeElement('div', 'col-12 col-sm-6 col-lg-4 col-xl-3 mb-4');
            const card = makeElement('article', 'card h-100');
            const imageHeader = makeElement('div', 'card-header text-center');
            const image = makeElement('img', 'img-fluid');
            image.src = product.photo
                ? `api/photo.php?type=product&id=${encodeURIComponent(product.id)}`
                : 'assets/img/images.png';
            image.addEventListener('error', () => { image.src = 'assets/img/images.png'; }, { once: true });
            image.alt = product.name;
            imageHeader.append(image);
            const body = makeElement('div', 'card-body d-flex flex-column');
            body.append(makeElement('h3', 'h6', product.name));
            body.append(makeElement('p', 'mb-2', `Código: ${product.code}`));
            body.append(makeElement('p', 'mb-2', `Stock: ${product.quantity} ${product.unit}`));
            body.append(makeElement('p', 'mb-2', `Precio: $${Number(product.price).toLocaleString('es-CO')}`));
            if (Number(product.quantity) <= Number(product.minimum_stock)) {
                body.append(makeElement('span', 'badge badge-warning align-self-start mb-2', 'Stock bajo'));
            }

            const actions = makeElement('div', 'mt-auto d-grid gap-2');
            const view = makeElement('a', 'btn btn-light', 'Ver producto');
            view.href = `View_product.html?id=${encodeURIComponent(product.id)}`;
            actions.append(view);
            actions.append(createButton('Editar producto', 'btn btn-outline-primary', () => openEditor(product)));
            actions.append(createButton('Registrar reposición', 'btn btn-outline-success', () => openReceipt(product)));
            actions.append(createButton('Desactivar producto', 'btn btn-outline-danger', () => deactivate(product)));
            body.append(actions);
            card.append(imageHeader, body);
            column.append(card);
            grid.append(column);
        });
    };

    const loadProducts = async () => {
        grid.replaceChildren(makeElement('p', 'col-12 text-center text-muted', 'Cargando inventario...'));
        try {
            const payload = await request('api/products.php');
            products = payload.products;
            document.getElementById('productCountLabel').textContent = `Tienes ${products.length} productos registrados`;
            render();
        } catch (error) {
            if (error.message !== 'authentication_required') {
                document.getElementById('productCountLabel').textContent = 'No fue posible cargar el inventario';
                grid.replaceChildren(makeElement('p', 'col-12 text-center text-danger', 'No fue posible cargar el inventario.'));
                showMessage('error', 'No fue posible cargar el inventario.');
            }
        }
    };

    const syncExpiryFields = () => {
        knowsExpiry.disabled = !hasExpiry.checked;
        if (!hasExpiry.checked) knowsExpiry.checked = false;
        expiryInput.disabled = !hasExpiry.checked || !knowsExpiry.checked;
        expiryInput.required = !expiryInput.disabled;
        if (expiryInput.disabled) expiryInput.value = '';
    };

    const openEditor = (product = null) => {
        productForm.reset();
        productForm.dataset.id = product?.id || '';
        document.getElementById('productDialogTitle').textContent = product ? 'Editar producto' : 'Nuevo producto';
        initialQuantityField.hidden = Boolean(product);
        document.getElementById('productName').value = product?.name || '';
        document.getElementById('productCode').value = product?.code || '';
        document.getElementById('productPrice').value = product?.price || '';
        document.getElementById('productUnit').value = product?.unit || '';
        document.getElementById('productMinimum').value = product?.minimum_stock ?? 1;
        hasExpiry.checked = Number(product?.has_expiry) === 1;
        knowsExpiry.checked = Number(product?.knows_expiry) === 1;
        expiryInput.value = product?.expires_on || '';
        syncExpiryFields();
        productDialog.showModal();
    };

    const openReceipt = (product) => {
        stockForm.reset();
        stockForm.dataset.id = product.id;
        document.getElementById('stockArrival').value = new Date().toISOString().slice(0, 10);
        stockDialog.showModal();
    };

    const deactivate = async (product) => {
        const result = await window.Swal.fire({
            title: '¿Desactivar producto?',
            text: `${product.name} dejará de aparecer en el inventario activo.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Desactivar',
            cancelButtonText: 'Cancelar'
        });
        if (!result.isConfirmed) return;

        try {
            await request(`api/products.php?id=${encodeURIComponent(product.id)}`, { method: 'DELETE' });
            showMessage('success', 'Producto desactivado.');
            await loadProducts();
        } catch {
            showMessage('error', 'No fue posible desactivar el producto.');
        }
    };

    document.getElementById('addProductButton').addEventListener('click', () => openEditor());
    document.querySelectorAll('[data-dialog-close]').forEach((button) => {
        button.addEventListener('click', () => button.closest('dialog').close());
    });
    hasExpiry.addEventListener('change', syncExpiryFields);
    knowsExpiry.addEventListener('change', syncExpiryFields);
    searchInput?.addEventListener('input', render);
    lowStockFilter?.addEventListener('change', render);

    productForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const product = {
            name: document.getElementById('productName').value.trim(),
            code: document.getElementById('productCode').value.trim(),
            price: Number(document.getElementById('productPrice').value),
            unit: document.getElementById('productUnit').value.trim(),
            quantity: Number(document.getElementById('productQuantity').value || 0),
            minimum_stock: Number(document.getElementById('productMinimum').value),
            has_expiry: hasExpiry.checked,
            knows_expiry: knowsExpiry.checked,
            expires_on: expiryInput.value || null
        };
        const id = productForm.dataset.id;
        const formData = new FormData();
        Object.entries(product).forEach(([key, value]) => {
            if (value !== null) formData.append(key, String(value));
        });
        const photo = document.getElementById('productPhoto').files[0];
        if (photo) formData.append('photo', photo);
        try {
            await request(id ? `api/products.php?id=${encodeURIComponent(id)}` : 'api/products.php', {
                method: id ? 'PUT' : 'POST',
                body: formData
            });
            productDialog.close();
            showMessage('success', id ? 'Producto actualizado.' : 'Producto creado.');
            await loadProducts();
        } catch (error) {
            const messages = { duplicate_code: 'Ese código ya está registrado.', invalid_product: 'Revisa los datos del producto.' };
            showMessage('error', messages[error.message] || 'No fue posible guardar el producto.');
        }
    });

    stockForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const id = stockForm.dataset.id;
        const receipt = Object.fromEntries(new FormData(stockForm));
        receipt.action = 'receive';
        receipt.quantity = Number(receipt.quantity);
        receipt.expires_on ||= null;
        receipt.lot ||= null;
        try {
            await request(`api/products.php?id=${encodeURIComponent(id)}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(receipt)
            });
            stockDialog.close();
            showMessage('success', 'Entrada de inventario registrada.');
            await loadProducts();
        } catch {
            showMessage('error', 'No fue posible registrar la entrada.');
        }
    });

    loadProducts();
})();