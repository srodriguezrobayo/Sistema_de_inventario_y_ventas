(() => {
    const form = document.getElementById('resetPasswordForm');
    if (!form) return;
    const message = document.getElementById('resetMessage');
    const token = new URLSearchParams(window.location.search).get('token');

    if (!token) {
        message.className = 'alert alert-danger';
        message.textContent = 'El enlace no es válido o ya venció.';
        form.hidden = true;
        return;
    }

    form.addEventListener('submit', async (event) => {
        event.preventDefault();
        const password = document.getElementById('newPassword').value;
        const confirmation = document.getElementById('confirmPassword').value;
        if (password !== confirmation) {
            message.className = 'alert alert-danger';
            message.textContent = 'Las contraseñas no coinciden.';
            return;
        }

        const button = form.querySelector('[type="submit"]');
        button.disabled = true;
        try {
            const response = await fetch('api/password-reset.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'reset', token, password, password_confirm: confirmation })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.error || 'invalid_reset');
            message.className = 'alert alert-success';
            message.textContent = 'Contraseña actualizada. Ya puedes iniciar sesión.';
            form.hidden = true;
        } catch {
            message.className = 'alert alert-danger';
            message.textContent = 'El enlace no es válido o ya venció. Solicita uno nuevo.';
        } finally {
            button.disabled = false;
        }
    });
})();