USE SAP;

CREATE TABLE IF NOT EXISTS Password_reset_tokens (
    Id_token INT AUTO_INCREMENT PRIMARY KEY,
    Usuario_id_usuario INT NOT NULL,
    Token_hash CHAR(64) NOT NULL UNIQUE,
    Fecha_expiracion DATETIME NOT NULL,
    Fecha_uso DATETIME NULL,
    Creacion_token DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (Usuario_id_usuario) REFERENCES Usuarios(Id_usuario),
    INDEX idx_reset_user_created (Usuario_id_usuario, Creacion_token)
);