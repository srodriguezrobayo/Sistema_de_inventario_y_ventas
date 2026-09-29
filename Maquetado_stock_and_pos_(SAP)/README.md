# Sistema de Inventario y Ventas

Aplicacion web para administrar inventario, productos y ventas. El backend de autenticacion usa PHP y MySQL, con una separacion MVC ligera.

## Estructura

```text
app/
  Config/          Conexion a la base de datos
  Controllers/     Flujos de autenticacion, productos, ventas y perfil
  Core/            Sesiones
  Models/          Consultas de usuarios, productos, ventas y resumen
  bootstrap.php    Carga de clases del backend
database/          Esquema SQL
public/
  api/             Entradas HTTP de autenticacion, productos, ventas y perfil
  assets/          CSS, JavaScript, imagenes y dependencias
  *.html           Paginas publicas de la aplicacion
```

Las paginas se agrupan en `public/` junto con sus recursos para que las rutas relativas actuales sigan funcionando. `public/api/` delega las operaciones de autenticacion a los controladores de `app/`.

## Ejecucion local

1. Inicia MySQL desde el panel de XAMPP.
2. Instala las dependencias PHP con Composer:

  ```powershell
  composer install
  ```

3. Copia `.env.example` a `.env` y completa los valores SMTP que te entrega tu proveedor de correo. No subas `.env` a GitHub.
4. En una base nueva, importa `database/Stock_and_pos_v2.sql` desde phpMyAdmin.
5. Si ya tenias `SAP`, ejecuta una vez cada archivo en `database/migrations/` sobre esa base.
6. En la carpeta raiz del proyecto, inicia el servidor PHP con su router de sesiones:

   ```powershell
  & 'C:\xampp\php\php.exe' -S 127.0.0.1:8000 -t public public/router.php
   ```

7. Abre `http://127.0.0.1:8000/Login.html`.

La configuracion predeterminada de MySQL es `127.0.0.1`, usuario `root`, contraseña vacia y base `SAP`. Puedes personalizarla con las variables `SAP_DB_HOST`, `SAP_DB_USER`, `SAP_DB_PASSWORD` y `SAP_DB_NAME`.

El registro guarda contrasenas con `password_hash`; el inicio de sesion las verifica con `password_verify`. Si la base ya existia, comprueba que `Usuarios.Email_usuario` tenga una restriccion `UNIQUE`.

Productos, reposiciones, ventas, historial, ficha de producto, perfil y resumen del dashboard ya consultan la base. Una venta valida el stock y guarda encabezado, detalle y descuento de existencias en una sola transaccion. El acceso a paginas y endpoints privados requiere una sesion.

El archivo `.env.example` muestra `SAP_SMTP_HOST`, `SAP_SMTP_PORT`, `SAP_SMTP_USERNAME`, `SAP_SMTP_PASSWORD`, `SAP_SMTP_ENCRYPTION` y `SAP_MAIL_FROM`. Usa una contraseña de aplicación SMTP del proveedor, no tu contraseña normal. Para enlaces de recuperación alojados en otra dirección, configura también `SAP_APP_URL`.

Las fotos admiten JPG, PNG y WebP hasta 5 MB; se guardan fuera de `public/` y solo las sirve el endpoint autenticado. En `php.ini`, define `file_uploads=On`, `upload_max_filesize=8M` y `post_max_size=10M`; reinicia Apache después de cambiarlo.