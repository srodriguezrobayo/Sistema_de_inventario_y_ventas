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
    Descripcion_venta LONGTEXT NOT NULL,
    Total_pagar_venta DECIMAL(6,0) NOT NULL,
    Accion_venta ENUM('Venta','Devolucion') NOT NULL,
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
('Centimetro',1);

/*SISTEMA CRUD TRADUCIDO ICAB*/

/*Procedimieto almacenado*/

/* =====================================================
   1. CONSULTAR UNIDADES DE MEDIDA
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_Unidad_Medida()
BEGIN
    SELECT Descripcion_unidad_medida
    FROM unidad_medida
    WHERE Estado_unidad_medida = 1;
END //

DELIMITER ;


/* =====================================================
   2. INSERTAR PRODUCTO Y UNIDAD DE MEDIDA
   ===================================================== */

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
    DECLARE v_producto_id INT;

    SELECT COUNT(*) INTO v_existe_unidad
    FROM unidad_medida
    WHERE Descripcion_unidad_medida = p_unidad_medida;

    IF v_existe_unidad = 0 THEN
        INSERT INTO unidad_medida (
            Descripcion_unidad_medida,
            Estado_unidad_medida
        )
        VALUES (p_unidad_medida, 1);
    END IF;

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
        1,
        p_usuario_id
    );

    SET v_producto_id = LAST_INSERT_ID();

    IF p_tiene_fv = 1 AND p_conoce_fv = 1 THEN
        INSERT INTO log_producto (
            Fecha_llegada_producto,
            Cantidad_llegada_producto,
            Lote_producto,
            Fecha_vencimiento,
            producto_id_producto,
            Estado_log_producto
        )
        VALUES (
            CURDATE(),
            p_cantidad,
            'Primer lote',
            p_fecha_vencimiento,
            v_producto_id,
            1
        );
    END IF;

END //

DELIMITER ;


/* =====================================================
   3. CREAR USUARIO
   ===================================================== */

DELIMITER //

CREATE PROCEDURE I_Usuario(
    IN p_nombre_usuario VARCHAR(100),
    IN p_email_usuario VARCHAR(500),
    IN p_contrasena_usuario VARCHAR(255)
)
BEGIN
    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE Email_usuario = p_email_usuario
    ) THEN
        SELECT
            'El correo electrónico ya está en uso' AS mensaje,
            0 AS resultado;
    ELSE
        INSERT INTO Usuarios (
            Nombre_usuario,
            Email_usuario,
            Contrasena_usuario,
            Foto_usuario,
            Estado_usuario
        )
        VALUES (
            p_nombre_usuario,
            p_email_usuario,
            p_contrasena_usuario,
            '../Back_end/uploads/Fotos_perfil/avatar-4.png',
            1
        );

        SELECT
            'Usuario registrado exitosamente' AS mensaje,
            1 AS resultado;
    END IF;
END //

DELIMITER ;


/* =====================================================
   4. CONSULTAR PRODUCTOS CON STOCK BAJO
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_Producto_Bajo(
    IN Usuario VARCHAR(500)
)
BEGIN
    SELECT productos.*
    FROM productos
    INNER JOIN usuarios
        ON usuarios.Id_usuario = productos.Usuario_id_usuario
    WHERE productos.Cantidad_Producto <= productos.Cantidad_minima
      AND usuarios.Email_usuario = Usuario
      AND productos.Estado_producto = 1;
END //

DELIMITER ;


/* =====================================================
   5. CONTAR PRODUCTOS CON STOCK BAJO
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_CONTEO_STOCK_BAJO(
    IN Usuario VARCHAR(500)
)
BEGIN
    SELECT COUNT(*) AS Productos_bajo_stock
    FROM productos
    INNER JOIN usuarios
        ON usuarios.Id_usuario = productos.Usuario_id_usuario
    WHERE productos.Cantidad_Producto <= productos.Cantidad_minima
      AND usuarios.Email_usuario = Usuario
      AND productos.Estado_producto = 1;
END //

DELIMITER ;


/* =====================================================
   6. SUMAR VENTAS DE HOY
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_suma_ventas_hoy(
    IN Usuario VARCHAR(500)
)
BEGIN
    SELECT SUM(
        CASE
            WHEN ventas.Accion_venta = 'Venta'
                THEN ventas.Total_pagar_venta
            WHEN ventas.Accion_venta = 'Devolucion'
                THEN -ventas.Total_pagar_venta
            ELSE 0
        END
    ) AS Total_neto
    FROM ventas
    INNER JOIN usuarios
        ON usuarios.Id_usuario = ventas.Usuario_id_usuario
    WHERE usuarios.Email_usuario = Usuario
      AND ventas.Estado_venta = 1
      AND ventas.Creacion_venta = CURDATE();
END //

DELIMITER ;


/* =====================================================
   7. CONSULTAR FECHAS DE VENCIMIENTO DE PRODUCTOS
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_fechas_vencimiento_productos(
    IN Usuario VARCHAR(500)
)
BEGIN
    SELECT
        productos.Nombre_producto,
        log_producto.Lote_producto,
        log_producto.Fecha_vencimiento
    FROM log_producto
    INNER JOIN productos
        ON productos.Id_productos = log_producto.Producto_id_producto
    INNER JOIN usuarios
        ON usuarios.Id_usuario = productos.Usuario_id_usuario
    WHERE productos.Estado_producto = 1
      AND usuarios.Email_usuario = Usuario;
END //

DELIMITER ;


/* =====================================================
   8. CONSULTAR PRODUCTOS VENDIDOS DEL MES ANTERIOR
   ===================================================== */

DELIMITER //

CREATE PROCEDURE C_graficaproductos_vendidos(
    IN Usuario VARCHAR(500)
)
BEGIN
    SELECT
        p.Nombre_producto,
        p.Codigo_producto,
        SUM(
            CASE
                WHEN v.Accion_venta = 'Venta'
                    THEN p.Cantidad
                WHEN v.Accion_venta = 'Devolucion'
                    THEN -p.Cantidad
                ELSE 0
            END
        ) AS Cantidad_salida
    FROM ventas v
    INNER JOIN usuarios u
        ON u.Id_usuario = v.Usuario_id_usuario
    INNER JOIN (
        SELECT
            'Marulete' AS Nombre_producto,
            '1234' AS Codigo_producto,
            2 AS Cantidad

        UNION ALL

        SELECT
            'Papax2',
            '78941',
            1
    ) p
        ON v.Descripcion_venta LIKE CONCAT(
            '%"codigo":"',
            p.Codigo_producto,
            '"%'
        )
    WHERE u.Email_usuario = Usuario
      AND v.Estado_venta = 1
      AND v.Accion_venta IN ('Venta', 'Devolucion')
      AND v.Creacion_venta >= DATE_FORMAT(
          CURRENT_DATE - INTERVAL 1 MONTH,
          '%Y-%m-01'
      )
      AND v.Creacion_venta < DATE_FORMAT(
          CURRENT_DATE,
          '%Y-%m-01'
      )
    GROUP BY
        p.Nombre_producto,
        p.Codigo_producto
    ORDER BY Cantidad_salida DESC;
END //

DELIMITER ;

/*Llamado a los procedimientos*/

/* =====================================================
   1. CONSULTAR UNIDADES DE MEDIDA
   ===================================================== */

CALL C_Unidad_Medida();


/* =====================================================
   2. INSERTAR PRODUCTO Y UNIDAD DE MEDIDA
   ===================================================== */

CALL I_Producto_Unidad(
    'Producto de prueba',  -- Nombre
    'PR001',               -- Código
    5000,                  -- Valor unitario
    10,                    -- Cantidad
    'Unidad',              -- Unidad de medida
    0,                     -- Tiene fecha de vencimiento
    0,                     -- Conoce fecha de vencimiento
    NULL,                  -- Fecha de vencimiento
    '',                    -- Foto
    2,                     -- Cantidad mínima
    1,                     -- Estado
    1                      -- ID del usuario
);


/* =====================================================
   3. CREAR USUARIO
   ===================================================== */

CALL I_Usuario(
    'Usuario de prueba',           -- Nombre
    'prueba@correo.com',           -- Correo
    'Contrasena_de_ejemplo'        -- Contraseña
);


/* =====================================================
   4. CONSULTAR PRODUCTOS CON STOCK BAJO
   ===================================================== */

CALL C_Producto_Bajo(
    'prueba@correo.com'
);


/* =====================================================
   5. CONTAR PRODUCTOS CON STOCK BAJO
   ===================================================== */

CALL C_CONTEO_STOCK_BAJO(
    'prueba@correo.com'
);


/* =====================================================
   6. SUMAR VENTAS DE HOY
   ===================================================== */

CALL C_suma_ventas_hoy(
    'prueba@correo.com'
);


/* =====================================================
   7. CONSULTAR FECHAS DE VENCIMIENTO
   ===================================================== */

CALL C_fechas_vencimiento_productos(
    'prueba@correo.com'
);


/* =====================================================
   8. CONSULTAR PRODUCTOS VENDIDOS DEL MES ANTERIOR
   ===================================================== */

CALL C_graficaproductos_vendidos(
    'prueba@correo.com'
);

/*------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------*/

/* /*Consultar unidad de medida
DELIMITER //

CREATE PROCEDURE C_Unidad_Medida()
BEGIN
    SELECT Descripcion_unidad_medida FROM unidad_medida WHERE Estado_unidad_medida = 1;
END //

DELIMITER ;

/*Llamado al procedimiento almacenado
CALL C_Unidad_Medida();

/*Procedimiento para insertar producto y unidad de medida

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
    DECLARE v_producto_id INT;

    -- 1. Verificar si existe la unidad de medida
    SELECT COUNT(*) INTO v_existe_unidad
    FROM unidad_medida
    WHERE Descripcion_unidad_medida = p_unidad_medida;

    -- 2. Registrar la unidad de medida si no existe
    IF v_existe_unidad = 0 THEN
        INSERT INTO unidad_medida (
            Descripcion_unidad_medida,
            Estado_unidad_medida
        )
        VALUES (
            p_unidad_medida,
            1
        );
    END IF;

    -- 3. Insertar el producto
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
        1,
        p_usuario_id
    );

    -- 4. Obtener el ID del producto recién insertado
    SET v_producto_id = LAST_INSERT_ID();

    -- 5. Registrar el lote solo si tiene fecha de vencimiento
    -- y además conoce dicha fecha
    IF p_tiene_fv = 1 AND p_conoce_fv = 1 THEN

        INSERT INTO log_producto (
            Fecha_llegada_producto,
            Cantidad_llegada_producto,
            Lote_producto,
            Fecha_vencimiento,
            producto_id_producto,
            Estado_log_producto
        )
        VALUES (
            CURDATE(),
            p_cantidad,
            'Primer lote',
            p_fecha_vencimiento,
            v_producto_id,
            1
        );

    END IF;

END //

DELIMITER ;


/*Llamado al procedimiento almacenado para insertar producto y unidad de medida
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

/*Procedimiento en crear usuario

DELIMITER //

CREATE PROCEDURE I_Usuario(
    IN p_nombre_usuario VARCHAR(100),
    IN p_email_usuario VARCHAR(500),
    IN p_contrasena_usuario VARCHAR(255)
)
BEGIN

    IF EXISTS (
        SELECT 1
        FROM Usuarios
        WHERE Email_usuario = p_email_usuario
    ) THEN

        SELECT
            'El correo electrónico ya está en uso' AS mensaje,
            0 AS resultado;

    ELSE

        INSERT INTO Usuarios (
            Nombre_usuario,
            Email_usuario,
            Contrasena_usuario,
            Foto_usuario,
            Estado_usuario
        )
        VALUES (
            p_nombre_usuario,
            p_email_usuario,
            p_contrasena_usuario,
            '../Back_end/uploads/Fotos_perfil/avatar-4.png',
            1
        );

        SELECT
            'Usuario registrado exitosamente' AS mensaje,
            1 AS resultado;

    END IF;

END //

DELIMITER ;

/*Llamado al insercion de usuarios
CALL I_Usuario(
    -- Variables
    -- Nombre_usuario
    -- Email_usuario
    -- Contrasena_usuario
);

/*Procedimiento para consultar producto bajo
DELIMITER //
CREATE PROCEDURE C_Producto_Bajo(IN Usuario Varchar(500))

BEGIN
    SELECT productos.* 
    FROM productos 
    INNER JOIN usuarios
    ON usuarios.Id_usuario = productos.Usuario_id_usuario
    WHERE productos.Cantidad_Producto <= productos.Cantidad_minima AND usuarios.Email_usuario = Usuario AND productos.Estado_producto= 1;
END //
DELIMITER ;

/*Llamado al procedimiento para consultar productos bajos
CALL C_Producto_Bajo(-- Variable
    -- Usuario
);

/*Procedimiento para contar stock bajo
DELIMITER //
CREATE PROCEDURE C_CONTEO_STOCK_BAJO (IN Usuario VARCHAR(500))
BEGIN
SELECT COUNT(*) AS Productos_bajo_stock
FROM productos
INNER JOIN usuarios
    ON usuarios.Id_usuario = productos.Usuario_id_usuario
WHERE productos.Cantidad_Producto <= productos.Cantidad_minima
  AND usuarios.Email_usuario = Usuario
  AND productos.Estado_producto = 1;
END //
DELIMITER ;

/*Llamado a contar el stock bajo
CALL C_CONTEO_STOCK_BAJO (--variable
    --usuario
)

/*Procedimiento para sumar ventas de hoy
DELIMITER //
CREATE PROCEDURE C_suma_ventas_hoy (IN Usuario VARCHAR(500)) 
BEGIN 
SELECT SUM( 
    CASE WHEN ventas.Accion_venta = 'Venta' 
    THEN ventas.Total_pagar_venta 
    WHEN ventas.Accion_venta = 'Devolucion' 
    THEN -ventas.Total_pagar_venta 
    ELSE 
    0 END ) 
    AS Total_neto 
    FROM ventas 
    INNER JOIN usuarios 
    ON usuarios.Id_usuario = ventas.Usuario_id_usuario 
    WHERE usuarios.Email_usuario = Usuario 
    AND ventas.Estado_venta = 1 
    AND ventas.Creacion_venta = CURDATE(); 
    END //
DELIMITER ;

/*Llamado a sumar ventas de hoy
CALL C_suma_ventas_hoy (--variable
--usuario
)

/*Procedimiento para ver fechas de vencimiento por producto
DELIMITER //
CREATE PROCEDURE C_fechas_vencimiento_productos(IN Usuario VARCHAR(500))
BEGIN
SELECT productos.Nombre_producto, log_producto.Lote_producto, log_producto.Fecha_vencimiento 
FROM log_producto
INNER JOIN productos
ON productos.Id_productos = log_producto.Producto_id_producto
INNER JOIN usuarios
ON usuarios.Id_usuario = productos.Usuario_id_usuario
WHERE productos.Estado_producto = 1 AND usuarios.Email_usuario = Usuario;
END //
DELIMITER ;

/*Llamado para ver fechas vencimiento por producto
CALL C_fechas_vencimiento_productos(--variable
--usuario
)

/*Procedimiento para grafica de ventas
DELIMITER //
CREATE PROCEDURE C_graficaproductos_vendidos(IN Usuario VARCHAR(500))
BEGIN
    SELECT
        p.Nombre_producto,
        p.Codigo_producto,
        SUM(
            CASE
                WHEN v.Accion_venta = 'Venta'
                    THEN p.Cantidad
                WHEN v.Accion_venta = 'Devolucion'
                    THEN -p.Cantidad
                ELSE 0
            END
        ) AS Cantidad_salida

    FROM ventas v

    INNER JOIN usuarios u
        ON u.Id_usuario = v.Usuario_id_usuario

    INNER JOIN (
        SELECT
            'Marulete' AS Nombre_producto,
            '1234' AS Codigo_producto,
            2 AS Cantidad

        UNION ALL

        SELECT
            'Papax2',
            '78941',
            1
    ) p
        ON v.Descripcion_venta LIKE CONCAT(
            '%"codigo":"',
            p.Codigo_producto,
            '"%'
        )

    WHERE u.Email_usuario = Usuario
      AND v.Estado_venta = 1
      AND v.Accion_venta IN ('Venta', 'Devolucion')

      AND v.Creacion_venta >=
          DATE_FORMAT(
              CURRENT_DATE - INTERVAL 1 MONTH,
              '%Y-%m-01'
          )

      AND v.Creacion_venta <
          DATE_FORMAT(CURRENT_DATE, '%Y-%m-01')

    GROUP BY
        p.Nombre_producto,
        p.Codigo_producto

    ORDER BY Cantidad_salida DESC;

END //
DELIMITER ;

/*Llamado grafico de ventas
CALL C_graficaproductos_vendidos (--variable
--usuario
) */