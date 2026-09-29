const authMessages = {
    credentials: 'Correo o contraseña incorrectos.',
    database: 'No se pudo completar la operación. Verifica la conexión con MySQL.',
    duplicate: 'Ya existe una cuenta con ese correo electrónico.',
    email: 'Escribe un correo electrónico válido.',
    name: 'El nombre es obligatorio y debe tener máximo 100 caracteres.',
    password: 'La contraseña debe tener entre 8 y 72 caracteres y coincidir con la confirmación.'
};

const authMessage = document.getElementById('authMessage');
const authError = new URLSearchParams(window.location.search).get('error');

if (authMessage && authError && authMessages[authError]) {
    authMessage.textContent = authMessages[authError];
    authMessage.classList.remove('d-none');
}