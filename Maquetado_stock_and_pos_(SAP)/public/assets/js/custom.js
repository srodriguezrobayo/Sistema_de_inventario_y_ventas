/**
 *
 * You can write your JS code here, DO NOT touch the default style file
 * because it will make it harder for you to update.
 * 
 */

"use strict";

document.addEventListener('click', async (event) => {
	const logoutLink = event.target.closest('a.dropdown-item.text-danger[href="Login.html"]');
	if (!logoutLink) return;

	event.preventDefault();
	try {
		const response = await fetch('api/logout.php', { method: 'POST', credentials: 'same-origin' });
		if (!response.ok) throw new Error('logout_failed');
		window.location.assign('Login.html');
	} catch {
		window.alert('No se pudo cerrar la sesión. Intenta nuevamente.');
	}
});
