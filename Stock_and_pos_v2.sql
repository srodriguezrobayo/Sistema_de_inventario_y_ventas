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
    Email_usuario VARCHAR(500) NOT NULL,
    Contrasena_usuario VARCHAR(255) NOT NULL,
    Descripcion_usuario TEXT NULL,
    Foto_usuario TEXT NULL,
    Creacion_usuario DATE DEFAULT (CURRENT_DATE),
    Estado_usuario BOOLEAN NOT NULL
);


/* Tabla productos */

CREATE TABLE Productos (
    Id_productos INT AUTO_INCREMENT PRIMARY KEY,
    Nombre_producto VARCHAR(100) NOT NULL,
    Codigo_producto VARCHAR(100) NOT NULL,
    Valor_unitario_producto DECIMAL(6,0) NOT NULL,
    Cantidad_Producto INT NOT NULL,
    Unidad_medida_producto VARCHAR(100) NOT NULL,
    Tiene_FV BOOLEAN NOT NULL,
    Conoce_FV BOOLEAN NULL,
    Fecha_vencimiento DATE NULL,
    Foto_producto TEXT NULL,
    Cantidad_minima INT NOT NULL,
    Creacion_registro DATE DEFAULT (CURRENT_DATE),
    Estado_producto BOOLEAN NOT NULL,
    Usuario_id_usuario INT NOT NULL
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
    Cantidad_llegada_producto VARCHAR(100) NOT NULL,
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
    Total_pagar_venta DECIMAL(6,0) NOT NULL,
    Estado_envio_venta BOOLEAN NOT NULL,
    Correo_envio_venta VARCHAR(255) NULL,
    Creacion_venta DATE DEFAULT (CURRENT_DATE),
    Estado_venta BOOLEAN NOT NULL,
    Usuario_id_usuario INT NOT NULL
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

/*Inserciones datos tabla unidad de medida */
INSERT INTO unidad_medida (Descripcion_unidad_medida, Estado_unidad_medida) VALUES
('Unidad', 1),
('Mililitro', 1),
('Litro', 1),
('Libra',1),
('Kilogramo', 1),
('Metro', 1),
('Centimetro',1)

/*SISTEMA CRUD TRADUCIDO ICAB*/

/*Procedimieto almacenado*/

/*Consultar unidad de medida*/
DELIMITER //

CREATE PROCEDURE C_Unidad_Medida()
BEGIN
    SELECT Descripcion_unidad_medida FROM unidad_medida WHERE Estado_unidad_medida = 1;
END //

DELIMITER ;

/*Llamado al procedimiento almacenado*/
CALL C_Unidad_Medida();

/*Procedimiento para insertar producto y unidad de medida*/
DELIMITER //

CREATE PROCEDURE I_Producto_Unidad(
    IN p_nombre VARCHAR(255),
    IN p_codigo VARCHAR(50),
    IN p_valor_unitario DECIMAL(6,0),
    IN p_cantidad INT,
    IN p_unidad_medida VARCHAR(100),
    IN p_tiene_fv TINYINT,
    IN p_conoce_fv TINYINT,
    IN p_fecha_vencimiento DATE,
    IN p_foto VARCHAR(255),
    IN p_cantidad_minima INT,
    IN p_estado INT,
    IN p_usuario_id INT
)
BEGIN
    DECLARE v_existe_unidad INT;

    -- 1. Verificamos si la unidad de medida ya existe en su tabla correspondiente
    -- (Asumimos que tu tabla de unidades se llama 'unidad_medida' y el campo es 'Descripcion_unidad_medida')
    SELECT COUNT(*) INTO v_existe_unidad 
    FROM unidad_medida 
    WHERE Descripcion_unidad_medida = p_unidad_medida;

    -- 2. Si NO existe (es decir, el conteo es 0), la insertamos automáticamente
    IF v_existe_unidad = 0 THEN
        INSERT INTO unidad_medida (Descripcion_unidad_medida, Estado_unidad_medida) 
        VALUES (p_unidad_medida, 1);
    END IF;

    -- 3. Hacemos la inserción en la tabla 'productos' con todos tus valores
    INSERT INTO productos (
        Nombre_producto, 
        Codigo_producto, 
        Valor_unitario_producto, 
        Cantidad_Producto, 
        Unidad_medida_producto, 
        Tiene_FV, 
        Conoce_FV, 
        Fecha_vencimiento, 
        Foto_producto, 
        Cantidad_minima, 
        Estado_producto, 
        Usuario_id_usuario
    ) 
    VALUES (
        p_nombre, 
        p_codigo, 
        p_valor_unitario, 
        p_cantidad, 
        p_unidad_medida, 
        p_tiene_fv, 
        p_conoce_fv, 
        p_fecha_vencimiento, 
        p_foto, 
        p_cantidad_minima, 
        p_estado, 
        p_usuario_id
    );

END //

DELIMITER ;

/*Llamado al procedimiento almacenado para insertar producto y unidad de medida*/
CALL I_Producto_Unidad(
    -- Variables
    -- Nombre_producto
    -- Codigo_producto
    -- Valor_unitario_producto
    -- Cantidad_Producto
    -- Unidad_medida_producto (Si 'prueba' no está, se crea sola)
    -- Tiene_FV
    -- Conoce_FV
    -- Fecha_vencimiento
    -- Foto_producto
    -- Cantidad_minima
    -- Estado_producto
    -- Usuario_id_usuario
);