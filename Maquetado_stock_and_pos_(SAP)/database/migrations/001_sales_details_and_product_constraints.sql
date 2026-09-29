USE SAP;

ALTER TABLE Productos
    MODIFY Valor_unitario_producto DECIMAL(12,2) NOT NULL;

ALTER TABLE Ventas
    MODIFY Total_pagar_venta DECIMAL(14,2) NOT NULL;

ALTER TABLE Log_producto
    MODIFY Cantidad_llegada_producto INT UNSIGNED NOT NULL;

CREATE TABLE IF NOT EXISTS Detalle_venta (
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

SET @has_product_code_index = (
    SELECT COUNT(*)
    FROM information_schema.statistics
    WHERE table_schema = DATABASE()
      AND table_name = 'Productos'
      AND index_name = 'uq_product_user_code'
);
SET @add_product_code_index = IF(
    @has_product_code_index = 0,
    'ALTER TABLE Productos ADD UNIQUE KEY uq_product_user_code (Usuario_id_usuario, Codigo_producto)',
    'SELECT 1'
);
PREPARE migration_statement FROM @add_product_code_index;
EXECUTE migration_statement;
DEALLOCATE PREPARE migration_statement;