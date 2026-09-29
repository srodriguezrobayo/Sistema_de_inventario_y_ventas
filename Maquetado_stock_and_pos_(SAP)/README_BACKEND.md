# Conexión local con MySQL

## Requisitos

- XAMPP con Apache, MySQL y PHP 8.1 o superior.
- La extensión `mysqli` habilitada en PHP.

## Puesta en marcha

1. Abre el panel de XAMPP e inicia MySQL.
2. Entra a phpMyAdmin e importa `Stock_and_pos_v2.sql` para crear la base `SAP` y sus tablas.
3. Desde la carpeta del proyecto, inicia el servidor PHP incluido en XAMPP:

   ```powershell
   & 'C:\xampp\php\php.exe' -S 127.0.0.1:8000
   ```

4. Abre `http://127.0.0.1:8000/Login.html`.

La conexión usa por defecto `127.0.0.1`, usuario `root`, contraseña vacía y base `SAP`, que son los valores típicos de XAMPP. Si tu MySQL usa otros datos, define `SAP_DB_HOST`, `SAP_DB_USER`, `SAP_DB_PASSWORD` y `SAP_DB_NAME` en el entorno de PHP.

El registro guarda contraseñas con `password_hash`; el login las valida con `password_verify` y crea una sesión. Si la base ya existía antes de actualizar el SQL, asegúrate de que `Usuarios.Email_usuario` tenga una restricción `UNIQUE` antes de registrar usuarios.