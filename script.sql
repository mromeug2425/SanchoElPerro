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