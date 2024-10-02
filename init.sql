DROP DATABASE IF EXISTS scooter_management;
CREATE DATABASE scooter_management;

USE scooter_management;

DROP TABLE IF EXISTS scooters;
CREATE TABLE scooters (
    scooter_id INT NOT NULL AUTO_INCREMENT,
    scooter_status ENUM('available', 'in use') NOT NULL,
    battery_level DECIMAL(5, 2) NOT NULL, 
    location POINT NOT NULL SRID 4326,  -- Asignar SRID 4326 para WGS 84
    PRIMARY KEY (scooter_id),
    SPATIAL INDEX(location)
);

INSERT INTO scooters (scooter_status, battery_level, location) 
VALUES 
('available', 95.50, ST_GeomFromText('POINT(40.7128 -74.0060)', 4326)),  -- Nueva York
('in use', 75.30, ST_GeomFromText('POINT(34.0522 -118.2437)', 4326)),   -- Los Ángeles
('available', 60.10, ST_GeomFromText('POINT(51.5074 -0.1278)', 4326)),  -- Londres
('available', 85.90, ST_GeomFromText('POINT(48.8566 2.3522)', 4326)),   -- París
('in use', 45.00, ST_GeomFromText('POINT(35.6895 139.6917)', 4326));    -- Tokio

DROP TABLE IF EXISTS rides;
CREATE TABLE rides (
    ride_id INT NOT NULL AUTO_INCREMENT,
    scooter_id INT NOT NULL,
    user_id INT NOT NULL,
    start_time TIMESTAMP NOT NULL DEFAULT NOW(),
    end_time TIMESTAMP,
    start_location POINT NOT NULL SRID 4326,
    end_location POINT SRID 4326,
    distance_travelled DECIMAL(10, 2) GENERATED ALWAYS AS (
        IF(end_location IS NULL OR start_location IS NULL, NULL, ROUND(ST_Distance_Sphere(start_location, end_location) / 1000, 2))
    ) STORED,
    cost DECIMAL(10, 2) GENERATED ALWAYS AS (
        IF(distance_travelled IS NULL, NULL, ROUND(distance_travelled * 0.75, 2))
    ) STORED,
    FOREIGN KEY (scooter_id) REFERENCES scooters(scooter_id),
    PRIMARY KEY (ride_id)
);

INSERT INTO rides (scooter_id, user_id, start_time, end_time, start_location, end_location) 
VALUES 
(1, 1001, NOW(), NOW(), ST_GeomFromText('POINT(40.7128 -74.0060)', 4326), ST_GeomFromText('POINT(40.730610 -73.935242)', 4326)),  -- Nueva York
(2, 1002, NOW(), NULL, ST_GeomFromText('POINT(34.0522 -118.2437)', 4326), NULL),   -- En progreso en Los Ángeles
(3, 1003, NOW(), NOW(), ST_GeomFromText('POINT(51.5074 -0.1278)', 4326), ST_GeomFromText('POINT(51.5155 -0.1419)', 4326)),  -- Londres
(4, 1004, NOW(), NULL, ST_GeomFromText('POINT(48.8566 2.3522)', 4326), NULL),   -- En progreso en París
(5, 1005, NOW(), NOW(), ST_GeomFromText('POINT(35.6895 139.6917)', 4326), ST_GeomFromText('POINT(35.6762 139.6503)', 4326));    -- Tokio