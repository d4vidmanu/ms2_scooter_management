-- Eliminar la base de datos si ya existe
DROP DATABASE IF EXISTS scooter_management;
CREATE DATABASE scooter_management;

USE scooter_management;

-- Eliminar la tabla scooters si ya existe
DROP TABLE IF EXISTS scooters;

-- Crear la tabla scooters con el nuevo estado 'in maintenance'
CREATE TABLE scooters (
    scooter_id INT NOT NULL AUTO_INCREMENT,
    scooter_status ENUM('available', 'in use', 'in maintenance') NOT NULL,
    battery_level DECIMAL(5, 2) NOT NULL, 
    location POINT NOT NULL SRID 4326,  -- Asignar SRID 4326 para WGS 84
    PRIMARY KEY (scooter_id),
    SPATIAL INDEX(location)
);

-- Insertar scooters de ejemplo con ubicación y estado
INSERT INTO scooters (scooter_status, battery_level, location) 
VALUES 
('available', 95.50, ST_GeomFromText('POINT(40.7128 -74.0060)', 4326)),  -- Nueva York
('available', 75.30, ST_GeomFromText('POINT(34.0522 -118.2437)', 4326)),   -- Los Ángeles
('available', 60.10, ST_GeomFromText('POINT(51.5074 -0.1278)', 4326)),  -- Londres
('available', 85.90, ST_GeomFromText('POINT(48.8566 2.3522)', 4326)),   -- París
('available', 45.00, ST_GeomFromText('POINT(35.6895 139.6917)', 4326));    -- Tokio

-- Eliminar la tabla rides si ya existe
DROP TABLE IF EXISTS rides;

-- Crear la tabla rides con las modificaciones solicitadas
CREATE TABLE rides (
    ride_id INT NOT NULL AUTO_INCREMENT,
    scooter_id INT NOT NULL,
    user_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP,
    start_location POINT NOT NULL SRID 4326,
    end_location POINT SRID 4326,
    cost DECIMAL(10, 2) GENERATED ALWAYS AS (
        IF(end_time IS NULL, NULL, ROUND(TIMESTAMPDIFF(MINUTE, start_time, end_time) * 0.50, 2))
    ) STORED,
    FOREIGN KEY (scooter_id) REFERENCES scooters(scooter_id),
    PRIMARY KEY (ride_id)
);

-- Insertar viajes de ejemplo
INSERT INTO rides (scooter_id, user_id, start_time, end_time, start_location, end_location) 
VALUES 
(1, 1001, '2024-10-01 08:00:00', '2024-10-01 08:30:00', ST_GeomFromText('POINT(40.7128 -74.0060)', 4326), ST_GeomFromText('POINT(40.730610 -73.935242)', 4326)),  -- Nueva York, 30 minutos de viaje
(3, 1003, '2024-10-02 09:00:00', '2024-10-02 09:45:00', ST_GeomFromText('POINT(51.5074 -0.1278)', 4326), ST_GeomFromText('POINT(51.5155 -0.1419)', 4326)),  -- Londres, 45 minutos de viaje
(5, 1005, '2024-10-03 07:30:00', '2024-10-03 08:00:00', ST_GeomFromText('POINT(35.6895 139.6917)', 4326), ST_GeomFromText('POINT(35.6762 139.6503)', 4326));  -- Tokio, 30 minutos de viaje


-- Simulación de movimiento para scooters en uso a 15 km/h
DELIMITER //
CREATE PROCEDURE simulate_scooter_movement()
BEGIN
    DECLARE done INT DEFAULT 0;
    DECLARE s_id INT;
    DECLARE loc POINT;
    
    -- Cursor para seleccionar scooters en uso
    DECLARE scooter_cursor CURSOR FOR 
    SELECT scooter_id, location FROM scooters WHERE scooter_status = 'in use';
    
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    
    OPEN scooter_cursor;
    
    scooter_loop: LOOP
        FETCH scooter_cursor INTO s_id, loc;
        IF done THEN
            LEAVE scooter_loop;
        END IF;
        
        -- Simular movimiento a 15 km/h con cambio de -0.001585 a 0.001585 en longitud y latitud
        UPDATE scooters 
        SET location = ST_GeomFromText(
            CONCAT('POINT(', 
            ST_X(location) + ((RAND() - 0.5) * 0.00317), ' ', 
            ST_Y(location) + ((RAND() - 0.5) * 0.00225), ')'), 
            4326
        )
        WHERE scooter_id = s_id;
    END LOOP;
    
    CLOSE scooter_cursor;
END//
DELIMITER ;



-- Habilitar eventos en el servidor MySQL
SET GLOBAL event_scheduler = ON;

-- Eliminar el evento si ya existe
DROP EVENT IF EXISTS update_scooter_movement;

-- Crear un evento para ejecutar la simulación cada minuto
CREATE EVENT update_scooter_movement
ON SCHEDULE EVERY 1 MINUTE
DO
    CALL simulate_scooter_movement();
