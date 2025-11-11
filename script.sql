-- Crear la base de datos si no existe
IF NOT EXISTS (SELECT * FROM sys.databases WHERE name = 'SanchoElPerro')
BEGIN
    CREATE DATABASE SanchoElPerro;
END
GO

-- Usar la base de datos
USE SanchoElPerro;
GO

-- Eliminar tablas si existen (en orden inverso por dependencias)
IF OBJECT_ID('sesiones_juegos_preguntas', 'U') IS NOT NULL DROP TABLE sesiones_juegos_preguntas;
IF OBJECT_ID('usuarios_mejoras', 'U') IS NOT NULL DROP TABLE usuarios_mejoras;
IF OBJECT_ID('sesiones_juegos', 'U') IS NOT NULL DROP TABLE sesiones_juegos;
IF OBJECT_ID('preguntas', 'U') IS NOT NULL DROP TABLE preguntas;
IF OBJECT_ID('sesiones', 'U') IS NOT NULL DROP TABLE sesiones;
IF OBJECT_ID('juegos', 'U') IS NOT NULL DROP TABLE juegos;
IF OBJECT_ID('mejoras', 'U') IS NOT NULL DROP TABLE mejoras;
IF OBJECT_ID('usuarios', 'U') IS NOT NULL DROP TABLE usuarios;
GO

-- Tabla usuarios
CREATE TABLE usuarios (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nombre_usuario NVARCHAR(255) NOT NULL,
    password NVARCHAR(255) NOT NULL,
    edad SMALLINT NOT NULL,
    trabajo NVARCHAR(255) NOT NULL,
    tiquets_tienda INT NOT NULL,
    monedas BIGINT NOT NULL DEFAULT 0,
    monedas_gastadas BIGINT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT usuarios_id_primary PRIMARY KEY (id),
    CONSTRAINT usuarios_nombre_usuario_unique UNIQUE (nombre_usuario)
);
GO

-- Tabla sesiones
CREATE TABLE sesiones (
    id BIGINT IDENTITY(1,1) NOT NULL,
    id_usuario BIGINT NOT NULL,
    duracion TIME,
    monedas_gastadas BIGINT NOT NULL DEFAULT 0,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT sesiones_id_primary PRIMARY KEY (id),
    CONSTRAINT sesiones_id_usuario_foreign FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE
);
GO

-- Tabla juegos
CREATE TABLE juegos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nombre NVARCHAR(255) NOT NULL,
    tiempo TIME NOT NULL,
    cantidad_preguntas INT NOT NULL,
    CONSTRAINT juegos_id_primary PRIMARY KEY (id)
);
GO

-- Tabla preguntas
CREATE TABLE preguntas (
    id BIGINT IDENTITY(1,1) NOT NULL,
    id_juego BIGINT NOT NULL,
    pregunta NVARCHAR(MAX) NOT NULL,
    opcion_1 NVARCHAR(MAX) NOT NULL,
    opcion_2 NVARCHAR(MAX) NULL,
    opcion_3 NVARCHAR(MAX) NULL,
    opcion_4 NVARCHAR(MAX) NULL,
    answer SMALLINT NOT NULL,
    media NVARCHAR(MAX) NULL,
    CONSTRAINT preguntas_id_primary PRIMARY KEY (id),
    CONSTRAINT preguntas_id_juego_foreign FOREIGN KEY (id_juego) REFERENCES juegos(id) ON DELETE CASCADE
);
GO

-- Tabla sesiones_juegos
CREATE TABLE sesiones_juegos (
    id BIGINT IDENTITY(1,1) NOT NULL,
    id_sesion BIGINT NOT NULL,
    id_juego BIGINT NOT NULL,
    duracion TIME NOT NULL,
    monedas_ganadas BIGINT NOT NULL DEFAULT 0,
    monedas_perdidas BIGINT NOT NULL DEFAULT 0,
    ganado BIT NOT NULL,
    createdAt DATETIME NOT NULL DEFAULT GETDATE(),
    CONSTRAINT sesiones_juegos_id_primary PRIMARY KEY (id),
    CONSTRAINT sesiones_juegos_id_sesion_foreign FOREIGN KEY (id_sesion) REFERENCES sesiones(id) ON DELETE CASCADE,
    CONSTRAINT sesiones_juegos_id_juego_foreign FOREIGN KEY (id_juego) REFERENCES juegos(id)
);
GO

-- Tabla sesiones_juegos_preguntas
CREATE TABLE sesiones_juegos_preguntas (
    id BIGINT IDENTITY(1,1) NOT NULL,
    id_sesion_juegos BIGINT NOT NULL,
    id_pregunta BIGINT NOT NULL,
    acertada BIT NOT NULL,
    respuesta_usuario TEXT NOT NULL,
    respuesta_correcta TEXT NOT NULL,
    opciones TEXT NULL,
    CONSTRAINT sesiones_juegos_preguntas_id_primary PRIMARY KEY (id),
    CONSTRAINT sesiones_juegos_preguntas_id_sesion_juegos_foreign FOREIGN KEY (id_sesion_juegos) REFERENCES sesiones_juegos(id) ON DELETE CASCADE,
    CONSTRAINT sesiones_juegos_preguntas_id_pregunta_foreign FOREIGN KEY (id_pregunta) REFERENCES preguntas(id)
);
GO

-- Tabla mejoras
CREATE TABLE mejoras (
    id BIGINT IDENTITY(1,1) NOT NULL,
    nombre NVARCHAR(255) NOT NULL,
    activo BIT NOT NULL DEFAULT 1,
    nivel_1 NVARCHAR(MAX) NOT NULL,
    nivel_2 NVARCHAR(MAX) NOT NULL,
    nivel_3 NVARCHAR(MAX) NOT NULL,
    nivel_4 NVARCHAR(MAX) NOT NULL,
    CONSTRAINT mejoras_id_primary PRIMARY KEY (id)
);
GO

-- Tabla usuarios_mejoras
CREATE TABLE usuarios_mejoras (
    id BIGINT IDENTITY(1,1) NOT NULL,
    id_usuario BIGINT NOT NULL,
    id_mejora BIGINT NOT NULL,
    nivel SMALLINT NOT NULL DEFAULT 1,
    CONSTRAINT usuarios_mejoras_id_primary PRIMARY KEY (id),
    CONSTRAINT usuarios_mejoras_id_usuario_foreign FOREIGN KEY (id_usuario) REFERENCES usuarios(id) ON DELETE CASCADE,
    CONSTRAINT usuarios_mejoras_id_mejora_foreign FOREIGN KEY (id_mejora) REFERENCES mejoras(id),
    CONSTRAINT usuarios_mejoras_unique UNIQUE (id_usuario, id_mejora)
);
GO

-- Crear índices para mejorar el rendimiento
CREATE INDEX idx_sesiones_usuario ON sesiones(id_usuario);
CREATE INDEX idx_preguntas_juego ON preguntas(id_juego);
CREATE INDEX idx_sesiones_juegos_sesion ON sesiones_juegos(id_sesion);
CREATE INDEX idx_sesiones_juegos_juego ON sesiones_juegos(id_juego);
CREATE INDEX idx_sesiones_juegos_preguntas_sesion ON sesiones_juegos_preguntas(id_sesion_juegos);
CREATE INDEX idx_sesiones_juegos_preguntas_pregunta ON sesiones_juegos_preguntas(id_pregunta);
CREATE INDEX idx_usuarios_mejoras_usuario ON usuarios_mejoras(id_usuario);
CREATE INDEX idx_usuarios_mejoras_mejora ON usuarios_mejoras(id_mejora);
GO

PRINT 'Base de datos SanchoElPerro creada exitosamente';
GO

INSERT INTO juegos (nombre, tiempo, cantidad_preguntas) VALUES
('Juego 3', '00:00:15', 5);
GO

INSERT INTO preguntas (id_juego, pregunta, opcion_1, opcion_2, opcion_3, opcion_4, answer, media) VALUES
(1, '¡Tío/a! Estoy haciendo una cometa y necesito 3 triángulos iguales. Si cada triángulo tiene 3 ángulos, ¿cuántos ángulos hay en total?', '3', '6', '9', '12', 3, NULL),
(1, 'Mi pizza circular la corté en 4 partes iguales. ¿Qué ángulo tiene cada porción en el centro?', '45°', '60°', '90°', '120°', 3, NULL),
(1, 'Tío/a, tengo un cuadrado de lado 5 cm. ¿Cuál es su perímetro?', '10 cm', '15 cm', '20 cm', '25 cm', 3, NULL),
(1, 'Mi habitación cuadrada mide 4 metros de lado. ¿Cuál es su área?', '8 m²', '12 m²', '16 m²', '20 m²', 3, NULL),
(1, '¡Ayuda! Un triángulo tiene ángulos de 60°, 60° y... ¿cuánto falta?', '30°', '60°', '90°', '120°', 2, NULL),
(1, 'Tengo 6 cubos de 1 cm de lado apilados. ¿Qué altura tiene mi torre?', '3 cm', '5 cm', '6 cm', '12 cm', 3, NULL),
(1, 'Mi rectángulo mide 10 cm de largo y 2 cm de ancho. ¿Cuál es su área?', '12 cm²', '20 cm²', '22 cm²', '24 cm²', 2, NULL),
(1, '¡Socorro! ¿Cuántos lados tiene un pentágono?', '4', '5', '6', '7', 2, NULL),
(1, 'Tío/a, un hexágono tiene 6 lados iguales de 3 cm. ¿Cuál es su perímetro?', '9 cm', '12 cm', '18 cm', '24 cm', 3, NULL),
(1, 'Mi triángulo tiene un ángulo recto (90°) y otro de 30°. ¿Cuánto mide el tercero?', '30°', '45°', '60°', '90°', 3, NULL),
(1, 'Estoy doblando un papel cuadrado por la diagonal. ¿Qué figura obtengo?', 'Un cuadrado más pequeño', 'Un rectángulo', 'Un triángulo', 'Un rombo', 3, NULL),
(1, '¡Problema! Un cubo tiene 6 caras. ¿Cuántas aristas tiene?', '6', '8', '10', '12', 4, NULL),
(1, 'Mi triángulo tiene base 6 cm y altura 4 cm. ¿Cuál es su área?', '10 cm²', '12 cm²', '20 cm²', '24 cm²', 2, NULL),
(1, 'Tío/a, ¿cuántos ángulos rectos tiene un rectángulo?', '2', '3', '4', '6', 3, NULL),
(1, 'Mi reloj marca las 3:00. ¿Qué ángulo forman las agujas?', '45°', '60°', '90°', '180°', 3, NULL),
(1, 'Tengo un cuadrado de lado 10 cm. ¿Cuál es su área?', '20 cm²', '40 cm²', '80 cm²', '100 cm²', 4, NULL),
(1, '¡Ayuda rápido! ¿Cuántos vértices tiene un triángulo?', '2', '3', '4', '5', 2, NULL),
(1, 'Mi rectángulo mide 8 cm de largo y 3 cm de ancho. ¿Cuál es su perímetro?', '11 cm', '16 cm', '22 cm', '24 cm', 3, NULL),
(1, 'Tío/a, corté mi pastel circular en 6 partes iguales. ¿Qué ángulo tiene cada trozo?', '30°', '45°', '60°', '90°', 3, NULL),
(1, 'Un ángulo mide 45°. ¿Cuánto le falta para llegar a 90°?', '30°', '45°', '50°', '90°', 2, NULL),
(1, '¡Socorro! Mi cuadrado tiene perímetro 20 cm. ¿Cuánto mide cada lado?', '4 cm', '5 cm', '10 cm', '20 cm', 2, NULL),
(1, 'Tengo un círculo. ¿Cuántos lados tiene?', '0', '1', '4', 'Infinitos', 1, NULL),
(1, 'Mi triángulo tiene todos los lados iguales. ¿Cuánto mide cada ángulo?', '45°', '60°', '90°', '120°', 2, NULL),
(1, 'Tío/a, un cubo tiene 8 vértices. ¿Cuántas caras tiene?', '4', '6', '8', '12', 2, NULL),
(1, 'Mi rectángulo mide 5 cm × 4 cm. ¿Cuál es su área?', '9 cm²', '18 cm²', '20 cm²', '25 cm²', 3, NULL),
(1, '¡Problema urgente! ¿Cuántas diagonales tiene un cuadrado?', '0', '2', '4', '8', 2, NULL),
(1, 'Tengo un ángulo de 100°. ¿Es agudo, recto u obtuso?', 'Agudo', 'Recto', 'Obtuso', 'Llano', 3, NULL),
(1, 'Mi cuadrado de lado 6 cm, ¿qué perímetro tiene?', '12 cm', '18 cm', '24 cm', '36 cm', 3, NULL),
(1, 'Tío/a, si un triángulo tiene un ángulo de 90°, ¿cómo se llama?', 'Equilátero', 'Isósceles', 'Rectángulo', 'Escaleno', 3, NULL),
(1, '¿Cuántos lados tiene un octágono?', '6', '7', '8', '10', 3, NULL),
(1, 'Mi triángulo tiene base 8 cm y altura 5 cm. ¿Cuál es su área?', '13 cm²', '20 cm²', '40 cm²', '80 cm²', 2, NULL),
(1, '¡Ayuda! Dos ángulos suman 90°. Si uno mide 40°, ¿cuánto mide el otro?', '40°', '50°', '60°', '90°', 2, NULL),
(1, 'Un rectángulo tiene largo 12 cm y ancho 5 cm. ¿Cuál es su perímetro?', '17 cm', '24 cm', '34 cm', '60 cm', 3, NULL),
(1, 'Tío/a, ¿cuántos ejes de simetría tiene un cuadrado?', '2', '4', '6', '8', 2, NULL),
(1, 'Mi pirámide tiene base cuadrada. ¿Cuántas caras tiene en total?', '4', '5', '6', '8', 2, NULL),
(1, 'Un ángulo mide 180°. ¿Cómo se llama?', 'Agudo', 'Recto', 'Obtuso', 'Llano', 4, NULL),
(1, '¡Socorro! Mi cuadrado tiene área 25 cm². ¿Cuánto mide su lado?', '5 cm', '6 cm', '12.5 cm', '25 cm', 1, NULL),
(1, '¿Cuántos vértices tiene un hexágono?', '5', '6', '7', '8', 2, NULL),
(1, 'Mi triángulo tiene ángulos de 50° y 50°. ¿Cuánto mide el tercero?', '50°', '60°', '80°', '100°', 3, NULL),
(1, 'Tío/a, un rombo tiene 4 lados iguales de 7 cm. ¿Cuál es su perímetro?', '14 cm', '21 cm', '28 cm', '35 cm', 3, NULL),
(1, '¿Cuántos ángulos tiene un pentágono?', '4', '5', '6', '7', 2, NULL),
(1, 'Mi rectángulo mide 6 cm × 6 cm. ¿Qué figura es en realidad?', 'Un rectángulo diferente', 'Un cuadrado', 'Un rombo', 'Un trapecio', 2, NULL),
(1, '¡Problema! La suma de ángulos de un triángulo es...?', '90°', '180°', '270°', '360°', 2, NULL),
(1, 'Mi cubo tiene arista de 2 cm. ¿Cuál es su volumen?', '4 cm³', '6 cm³', '8 cm³', '12 cm³', 3, NULL),
(1, 'Tío/a, ¿cuántos lados tiene un cuadrilátero?', '3', '4', '5', '6', 2, NULL),
(1, 'Mi triángulo rectángulo tiene catetos de 3 cm y 4 cm. ¿Cuál es su área?', '6 cm²', '7 cm²', '12 cm²', '24 cm²', 1, NULL),
(1, 'Un ángulo de 70° más otro de 20° suman...?', '50°', '80°', '90°', '100°', 3, NULL),
(1, '¡Ayuda! Mi cuadrado tiene perímetro 40 cm. ¿Cuánto mide su lado?', '8 cm', '10 cm', '20 cm', '40 cm', 2, NULL),
(1, '¿Cuántas caras tiene un cilindro?', '1', '2', '3', '4', 3, NULL),
(1, 'Tío/a, mi rectángulo mide 10 cm × 3 cm. ¿Cuál es su área?', '13 cm²', '26 cm²', '30 cm²', '60 cm²', 3, NULL);
GO

PRINT '50 preguntas de geometría insertadas exitosamente';
GO

INSERT INTO juegos (nombre, tiempo, cantidad_preguntas) VALUES
('Juego 2', '00:00:10', 25);
GO

INSERT INTO preguntas (id_juego, pregunta, opcion_1, opcion_2, opcion_3, opcion_4, answer, media) VALUES
(2, '¿Cuánto es 7 × 8?', '54', '56', '64', '58', 'B', NULL),
(2, '¿Cuánto es 45 ÷ 5?', '8', '9', '10', '12', 'B', NULL),
(2, '¿Cuál es la raíz cuadrada de 81?', '8', '9', '10', '11', 'B', NULL),
(2, 'Si 5x = 20, ¿cuánto vale x?', '2', '3', '4', '5', 'C', NULL),
(2, '¿Cuánto es 25% de 200?', '25', '40', '50', '75', 'B', NULL),
(2, '¿Qué número es mayor?', '0,75', '3/4', 'Son iguales', '1/2', 'C', NULL),
(2, 'Si un triángulo tiene lados 3, 4 y 5, ¿qué tipo de triángulo es?', 'Isósceles', 'Escaleno', 'Rectángulo', 'Equilátero', 'C', NULL),
(2, '¿Cuánto es (6 + 4) × 2?', '20', '16', '12', '10', 'A', NULL),
(2, '¿Cuál es el resultado de 3² + 4²?', '12', '24', '25', '49', 'C', NULL),
(2, '¿Cuánto es 0,5 + 0,25?', '0,7', '0,75', '0,8', '1', 'B', NULL),
(2, '¿Cuál es el valor aproximado de π?', '2,12', '3,14', '3,5', '3,41', 'B', NULL),
(2, 'Si un coche recorre 120 km en 2 horas, ¿a qué velocidad media va?', '50 km/h', '60 km/h', '80 km/h', '40 km/h', 'B', NULL),
(2, '¿Qué número es divisible entre 3?', '124', '135', '142', '152', 'B', NULL),
(2, '¿Cuánto es 1000 − 475?', '425', '525', '475', '375', 'A', NULL),
(2, '¿Cuánto es 2³?', '6', '8', '9', '12', 'B', NULL),
(2, '¿Cuánto es ⅓ de 90?', '20', '25', '30', '40', 'C', NULL),
(2, 'Si un cuadrado tiene lados de 5 cm, ¿cuál es su perímetro?', '10 cm', '20 cm', '25 cm', '30 cm', 'B', NULL),
(2, '¿Cuál es el número primo?', '9', '12', '13', '15', 'C', NULL),
(2, 'Si una pizza se divide en 8 partes y comes 3, ¿qué fracción has comido?', '1/3', '3/8', '1/4', '2/3', 'B', NULL),
(2, '¿Cuánto es 4 × (2 + 3)?', '10', '12', '20', '24', 'C', NULL),
(2, '¿Cuál es el valor de x si 12 + x = 20?', '6', '8', '10', '12', 'B', NULL),
(2, '¿Qué figura tiene 4 lados iguales y 4 ángulos rectos?', 'Rectángulo', 'Cuadrado', 'Rombo', 'Trapecio', 'B', NULL),
(2, '¿Cuál es la mitad de 3/4?', '1/2', '3/8', '1/4', '2/3', 'A', NULL),
(2, 'Si hoy es martes, ¿qué día será dentro de 5 días?', 'Viernes', 'Domingo', 'Lunes', 'Sábado', 'B', NULL),
(2, '¿Cuánto es 11 × 12?', '121', '132', '142', '112', 'B', NULL),
(2, '¿Cuánto es 9 + 6 ÷ 3?', '3', '13', '11', '15', 'C', NULL),
(2, '¿Cuál es el doble de 7,5?', '12,5', '13', '15', '20', 'C', NULL),
(2, '¿Qué número sigue en la serie: 2, 4, 8, 16, ...?', '18', '20', '24', '32', 'D', NULL),
(2, '¿Cuánto es 15% de 200?', '15', '25', '30', '35', 'C', NULL),
(2, '¿Cuánto es 5²?', '20', '10', '25', '30', 'C', NULL),
(2, '¿Cuál es el opuesto de -12?', '12', '-12', '0', '-1', 'A', NULL),
(2, '¿Qué fracción equivale a 0,5?', '1/3', '1/2', '3/4', '2/3', 'B', NULL),
(2, '¿Cuál es el área de un rectángulo de 5 × 8?', '10', '13', '40', '48', 'C', NULL),
(2, '¿Cuántos segundos hay en 5 minutos?', '300', '200', '250', '150', 'A', NULL),
(2, '¿Cuánto es 10% de 450?', '40', '45', '50', '55', 'B', NULL),
(2, '¿Cuál es el triple de 9?', '18', '27', '36', '30', 'B', NULL),
(2, '¿Cuánto es 14 + 28 + 14?', '42', '50', '56', '60', 'C', NULL),
(2, '¿Cuánto es 90 ÷ 9?', '8', '9', '10', '12', 'B', NULL),
(2, '¿Cuál es la raíz cuadrada de 100?', '9', '10', '11', '12', 'B', NULL),
(2, '¿Qué número falta: 5, 10, 15, ?, 25?', '18', '20', '22', '23', 'B', NULL),
(2, '¿Cuánto es 2 × 2 × 2 × 2?', '6', '8', '10', '16', 'D', NULL),
(2, '¿Cuánto es 3 × (7 + 5)?', '24', '30', '36', '40', 'C', NULL),
(2, '¿Cuál es la mitad de 1 hora?', '15 minutos', '30 minutos', '45 minutos', '60 minutos', 'B', NULL),
(2, '¿Cuánto es 4² + 5²?', '20', '25', '41', '45', 'C', NULL),
(2, '¿Cuál es el sucesor de 999?', '1000', '998', '1100', '900', 'A', NULL),
(2, '¿Qué número es múltiplo de 4?', '18', '20', '22', '26', 'B', NULL),
(2, '¿Cuál es la fracción equivalente a 2/4?', '1/2', '3/4', '2/3', '1/3', 'A', NULL),
(2, '¿Cuánto es 120 ÷ 10?', '10', '12', '15', '20', 'B', NULL),
(2, '¿Cuánto es 6 × 9?', '54', '56', '58', '60', 'A', NULL),
(2, '¿Qué número es mayor: 0,6 o 0,59?', '0,6', '0,59', 'Son iguales', 'No se puede saber', 'A', NULL),
(2, '¿Cuánto es 1/5 de 100?', '10', '15', '20', '25', 'C', NULL),
(2, '¿Cuánto es 9²?', '81', '72', '90', '99', 'A', NULL),
(2, '¿Cuánto es 3 × 12?', '33', '34', '35', '36', 'D', NULL),
(2, '¿Cuánto es 200 − 175?', '10', '20', '25', '30', 'C', NULL),
(2, '¿Cuánto es 8 × 11?', '81', '88', '80', '99', 'B', NULL),
(2, '¿Cuál es el número par?', '7', '13', '16', '21', 'C', NULL),
(2, '¿Cuánto es 100 ÷ 25?', '2', '3', '4', '5', 'C', NULL),
(2, '¿Cuánto es la raíz cuadrada de 49?', '6', '7', '8', '9', 'B', NULL),
(2, '¿Qué número es impar?', '8', '10', '15', '20', 'C', NULL),
(2, '¿Cuánto es 5 + 5 × 5?', '25', '30', '50', '15', 'B', NULL),
(2, '¿Cuánto es 12 × 12?', '124', '132', '144', '154', 'C', NULL),
(2, '¿Cuál es el doble de 13?', '25', '26', '27', '28', 'B', NULL),
(2, '¿Cuánto es 8³?', '512', '64', '128', '216', 'A', NULL),
(2, '¿Cuánto es 2⁵?', '16', '32', '64', '128', 'B', NULL),
(2, '¿Cuánto es ¼ de 60?', '10', '12', '15', '20', 'C', NULL),
(2, '¿Qué número sigue en la secuencia 1, 4, 9, 16, ...?', '20', '24', '25', '36', 'C', NULL),
(2, '¿Cuál es el resultado de 2 × (3 + 7)?', '20', '12', '14', '24', 'A', NULL),
(2, '¿Cuánto es 18 ÷ 6 + 4?', '6', '7', '8', '9', 'C', NULL),
(2, '¿Cuánto es 9 × 5?', '35', '40', '45', '50', 'C', NULL),
(2, '¿Cuánto es 100 − 99?', '0', '1', '2', '10', 'B', NULL),
(2, '¿Cuál es el número más pequeño?', '0,1', '0,01', '0,001', '0,0001', 'D', NULL),
(2, '¿Cuánto es ¾ de 100?', '50', '60', '70', '75', 'D', NULL),
(2, '¿Cuánto es 8 + 12?', '18', '19', '20', '21', 'C', NULL),
(2, '¿Cuánto es 1/2 + 1/4?', '1/3', '1/2', '3/4', '1', 'C', NULL),
(2, '¿Cuánto es 6²?', '36', '30', '42', '48', 'A', NULL),
(2, '¿Cuál es la raíz cuadrada de 64?', '6', '7', '8', '9', 'C', NULL),
(2, '¿Cuánto es 7 × 7?', '47', '48', '49', '50', 'C', NULL),
(2, '¿Qué número es múltiplo de 5?', '22', '25', '27', '28', 'B', NULL),
(2, '¿Cuánto es 1 hora y media en minutos?', '60', '90', '100', '120', 'B', NULL),
(2, '¿Cuánto es 3 × 3 × 3?', '9', '18', '27', '36', 'C', NULL),
(2, '¿Cuánto es 0,2 × 100?', '2', '10', '20', '200', 'C', NULL),
(2, '¿Qué número falta: 10, 20, 30, ?, 50?', '35', '38', '40', '45', 'C', NULL),
(2, '¿Cuánto es ½ de 200?', '50', '75', '100', '125', 'C', NULL),
(2, '¿Cuánto es 7 + 3 × 2?', '14', '16', '18', '20', 'A', NULL),
(2, '¿Cuál es la raíz cuadrada de 121?', '10', '11', '12', '13', 'B', NULL),
(2, '¿Cuánto es 5 × 0?', '0', '5', '1', '10', 'A', NULL),
(2, '¿Qué número es divisible entre 9?', '18', '19', '20', '21', 'A', NULL),
(2, '¿Cuánto es 6 + 9 − 4?', '10', '11', '12', '13', 'C', NULL),
(2, '¿Cuánto es 4³?', '12', '16', '64', '128', 'C', NULL),
(2, '¿Cuánto es el triple de 15?', '30', '40', '45', '50', 'C', NULL),
(2, '¿Cuál es el resultado de 2 + 2 × 2?', '6', '8', '4', '2', 'A', NULL),
(2, '¿Cuánto es 5⁴?', '125', '625', '3125', '25', 'B', NULL),
(2, '¿Qué número es mayor: 0,99 o 1?', '0,99', '1', 'Son iguales', 'Ninguno', 'B', NULL),
(2, '¿Cuánto es ⅔ de 90?', '45', '50', '55', '60', 'D', NULL),
(2, '¿Cuánto es 200 × 0?', '0', '2', '20', '200', 'A', NULL),
(2, '¿Cuánto es 8 + 8 ÷ 4?', '10', '12', '14', '16', 'B', NULL),
(2, '¿Cuál es la raíz cuadrada de 144?', '10', '11', '12', '13', 'C', NULL),
(2, '¿Cuánto es 9 + 10?', '18', '19', '20', '21', 'B', NULL),
(2, '¿Cuánto es 2 × 25?', '45', '50', '55', '60', 'B', NULL),
(2, '¿Cuánto es 15 + 15?', '25', '30', '35', '40', 'B', NULL),
(2, '¿Qué número es múltiplo de 9?', '18', '20', '22', '24', 'A', NULL),
(2, '¿Cuánto es 8 × 8?', '56', '60', '64', '72', 'C', NULL),
(2, '¿Cuánto es 5 + 15 + 20?', '35', '40', '45', '50', 'B', NULL),
(2, '¿Cuánto es 0,1 × 1000?', '10', '100', '1', '0,01', 'A', NULL),
(2, '¿Cuánto es 10²?', '50', '100', '150', '200', 'B', NULL),
(2, '¿Cuánto es 60 ÷ 5?', '10', '12', '15', '20', 'C', NULL);
GO

