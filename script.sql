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
    duracion TIME NOT NULL,
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
('Juego 3', '00:15:00', 10);
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