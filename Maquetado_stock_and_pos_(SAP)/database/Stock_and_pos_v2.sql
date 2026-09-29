/* Crear base de datos Stock And Pos SAP */

CREATE DATABASE SAP
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE SAP;


/* Creacion de tablas */


/* Tabla usuarios */

CREATE TABLE Usuarios (
    Id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_usuario VARCHAR(100) NOT NULL,
    Email_usuario VARCHAR(500) NOT NULL UNIQUE,
    Contrasena_usuario VARCHAR(255) NOT NULL,
    Descripcion_usuario TEXT NULL,
    Foto_usuario TEXT NULL,
    Creacion_usuario DATE DEFAULT (CURRENT_DATE),
    Estado_usuario BOOLEAN NOT NULL
);

CREATE TABLE Password_reset_tokens (
    Id_token INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_id_usuario INT NOT NULL,
    Token_hash CHAR(64) NOT NULL UNIQUE,
    Fecha_expiracion DATETIME NOT NULL,
    Fecha_uso DATETIME NULL,
    Creacion_token DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Usuario_id_usuario) REFERENCES Usuarios(Id_usuario),
    INDEX idx_reset_user_created (Usuario_id_usuario, Creacion_token)
);


/* Tabla productos */

CREATE TABLE Productos (
    Id_productos INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_producto VARCHAR(100) NOT NULL,
    Codigo_producto VARCHAR(100) NOT NULL,
    Valor_unitario_producto DECIMAL(12,2) NOT NULL,
    Cantidad_Producto INT NOT NULL,
    Unidad_medida_producto VARCHAR(100) NOT NULL,
    Tiene_FV BOOLEAN NOT NULL,
    Conoce_FV BOOLEAN NULL,
    Fecha_vencimiento DATE NULL,
    Foto_producto TEXT NULL,
    Cantidad_minima INT NOT NULL,
    Creacion_registro DATE DEFAULT (CURRENT_DATE),
    Estado_producto BOOLEAN NOT NULL,
    Usuario_id_usuario INT NOT NULL,
    UNIQUE KEY uq_product_user_code (Usuario_id_usuario, Codigo_producto)
);


/* Tabla unidad de medida */

CREATE TABLE unidad_medida (
    Id_unidad_medida INT AUTO_INCREMENT PRIMARY KEY,
    Descripcion_unidad_medida VARCHAR(100) NOT NULL,
    Creacion_unidad_medida DATE DEFAULT (CURRENT_DATE),
    Estado_unidad_medida BOOLEAN NOT NULL
);


/* Tabla Log productos (Historial) */

CREATE TABLE Log_producto (
    Id_log_producto INT AUTO_INCREMENT PRIMARY KEY,
    Fecha_llegada_producto DATE NOT NULL,
    Cantidad_llegada_producto INT UNSIGNED NOT NULL,
    Lote_producto VARCHAR(100) NULL,
    Fecha_vencimiento DATE NULL,
    Producto_id_producto INT NOT NULL,
    Creacion_log_producto DATE DEFAULT (CURRENT_DATE),
    Estado_log_producto BOOLEAN NOT NULL
);


/* Tabla ventas */

CREATE TABLE Ventas (
    Id_ventas INT AUTO_INCREMENT PRIMARY KEY,
    Fecha_hora_venta DATETIME NOT NULL,
    Descripcion_VENTA LONGTEXT NOT NULL,
    Total_pagar_venta DECIMAL(14,2) NOT NULL,
    Estado_envio_venta BOOLEAN NOT NULL,
    Correo_envio_venta VARCHAR(255) NULL,
    Creacion_venta DATE DEFAULT (CURRENT_DATE),
    Estado_venta BOOLEAN NOT NULL,
    Usuario_id_usuario INT NOT NULL
);

/* Tabla de productos incluidos en cada venta */

CREATE TABLE Detalle_venta (
    Id_detalle_venta INT AUTO_INCREMENT PRIMARY KEY,
    Venta_id_venta INT NOT NULL,
    Producto_id_producto INT NOT NULL,
    Cantidad INT UNSIGNED NOT NULL,
    Precio_unitario DECIMAL(12,2) NOT NULL,
    Subtotal DECIMAL(14,2) NOT NULL,
    Creacion_detalle DATE DEFAULT (CURRENT_DATE),
    FOREIGN KEY (Venta_id_venta) REFERENCES Ventas(Id_ventas),
    FOREIGN KEY (Producto_id_producto) REFERENCES Productos(Id_productos),
    INDEX idx_detalle_venta (Venta_id_venta),
    INDEX idx_detalle_producto (Producto_id_producto)
);


/* Llaves foraneas */


/* Llave foranea productos-usuarios */

ALTER TABLE Productos
ADD FOREIGN KEY (Usuario_id_usuario)
REFERENCES Usuarios(Id_usuario);


/* Llave foranea log_producto-producto */

ALTER TABLE Log_producto
ADD FOREIGN KEY (Producto_id_producto)
REFERENCES Productos(Id_productos);


/* Llave foranea ventas-usuario */

ALTER TABLE Ventas
ADD FOREIGN KEY (Usuario_id_usuario)
REFERENCES Usuarios(Id_usuario);
