-- Usar base de datos
USE motos;

-- Crear tabla de motos
CREATE TABLE IF NOT EXISTS motos (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    tipo VARCHAR(50) NOT NULL
);

-- Insertar motos
INSERT IGNORE INTO motos (modelo, marca, año, tipo) VALUES
    ('Yamaha R1', 'Yamaha', 2020, 'Deportiva'),
    ('Honda CB500', 'Honda', 2019, 'Naked'),
    ('Kawasaki Z900', 'Kawasaki', 2021, 'Naked');

-- Crear tabla de pilotos (relacionada con motos)
CREATE TABLE IF NOT EXISTS pilotos (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    nacionalidad VARCHAR(50) NOT NULL,
    edad INT NOT NULL,
    moto_id INT UNSIGNED,
    FOREIGN KEY (moto_id) REFERENCES motos(id) ON DELETE SET NULL
);

-- Insertar pilotos
INSERT IGNORE INTO pilotos (nombre, nacionalidad, edad, moto_id) VALUES
    ('Marc Márquez', 'España', 30, 1),
    ('Valentino Rossi', 'Italia', 44, 2),
    ('Fabio Quartararo', 'Francia', 25, 3);
