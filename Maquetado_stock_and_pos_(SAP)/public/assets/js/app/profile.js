(() => {
    const profileDialog = document.getElementById('profileDialog');
    if (!profileDialog) return;

    const passwordDialog = document.getElementById('passwordDialog');
    const profileForm = document.getElementById('profileForm');
    const passwordForm = document.getElementById('passwordForm');
    let profile;

    const message = (type, text) => {
        if (window.iziToast) window.iziToast[type]({ title: type === 'error' ? 'Error' : 'Listo', message: text });
        else window.alert(text);
    };

    const request = async (method, payload) => {
        const options = { method, credentials: 'same-origin' };
        if (payload instanceof FormData) {
            options.body = payload;
        } else if (payload) {
            options.headers = { 'Content-Type': 'application/json' };
            options.body = JSON.stringify(payload);
        }
        const response = await fetch('api/profile.php', {
            ...options
        });
        if (response.status === 401) {
            window.location.assign('Login.html');
            throw new Error('authentication_required');
        }
        const result = await response.json();
        if (!response.ok) throw new Error(result.error || 'request_failed');
        return result;
    };

    const loadProfile = async () => {
        try {
            const result = await request('GET');
            profile = result.profile;
            document.getElementById('profileName').textContent = profile.name;
            document.getElementById('profileEmail').textContent = profile.email;
            document.getElementById('profileDescription').textContent = profile.description || 'Sin descripción';
            if (profile.photo) document.getElementById('profilePhoto').src = 'api/photo.php?type=profile';
        } catch (error) {
            if (error.message !== 'authentication_required') message('error', 'No se pudo cargar el perfil.');
        }
    };

    document.getElementById('editProfileButton').addEventListener('click', () => {
        if (!profile) return;
        document.getElementById('profileNameInput').value = profile.name;
        document.getElementById('profileEmailInput').value = profile.email;
        document.getElementById('profileDescriptionInput').value = profile.description || '';
        profileDialog.showModal();
    });
    document.getElementById('changePasswordButton').addEventListener('click', () => passwordDialog.showModal());
    document.querySelectorAll('[data-dialog-close]').forEach((button) => {
        button.addEventListener('click', () => button.closest('dialog').close());
    });

    profileForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            const formData = new FormData();
            formData.append('name', document.getElementById('profileNameInput').value.trim());
            formData.append('email', document.getElementById('profileEmailInput').value.trim());
            formData.append('description', document.getElementById('profileDescriptionInput').value.trim());
            const photo = document.getElementById('profilePhotoInput').files[0];
            if (photo) formData.append('photo', photo);
            const result = await request('POST', formData);
            profile = result.profile;
            profileDialog.close();
            await loadProfile();
            message('success', 'Perfil actualizado.');
        } catch (error) {
            message('error', error.message === 'duplicate_email' ? 'Ese correo ya está en uso.' : 'No se pudo actualizar el perfil.');
        }
    });

    passwordForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        try {
            await request('PUT', {
                action: 'password',
                current_password: document.getElementById('currentPassword').value,
                new_password: document.getElementById('newPassword').value,
                confirm_password: document.getElementById('confirmNewPassword').value
            });
            passwordDialog.close();
            passwordForm.reset();
            message('success', 'Contraseña actualizada.');
        } catch (error) {
            const text = error.message === 'invalid_current_password'
                ? 'La contraseña actual no coincide.'
                : 'La nueva contraseña debe tener 8 a 72 caracteres y coincidir.';
            message('error', text);
        }
    });

    loadProfile();
})();