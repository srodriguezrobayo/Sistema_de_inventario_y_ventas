(() => {
    const form = document.getElementById('resetRequestForm');
    if (!form) return;
    const message = document.getElementById('resetRequestMessage');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        try {
            const response = await fetch('api/password-reset.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'request', email: document.getElementById('resetEmail').value.trim() })
            });
            if (!response.ok) throw new Error('request_failed');
            message.className = 'alert alert-success';
            message.textContent = 'Si el correo corresponde a una cuenta, recibirás un enlace de recuperación.';
            form.reset();
        } catch {
            message.className = 'alert alert-danger';
            message.textContent = 'No se pudo procesar la solicitud. Intenta de nuevo más tarde.';
        } finally {
            button.disabled = false;
        }
    });
})();