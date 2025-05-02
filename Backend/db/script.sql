USE motos;

CREATE TABLE IF NOT EXISTS motos (
    id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    modelo VARCHAR(100) NOT NULL UNIQUE,
    marca VARCHAR(100) NOT NULL,
    año INT NOT NULL,
    tipo VARCHAR(50) NOT NULL
);

INSERT IGNORE INTO motos (modelo, marca, año, tipo) VALUES
    ('Yamaha R1', 'Yamaha', 2020, 'Deportiva'),
    ('Honda CB500', 'Honda', 2019, 'Naked'),
    ('Kawasaki Z900', 'Kawasaki', 2021, 'Naked');