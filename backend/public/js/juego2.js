// ===== VARIABLES DE PREGUNTAS =====
let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15; // Tiempo por defecto
let tiempoRestante = 15;
let intervaloTimer = null;
let respuestaEsCorrecto = false; // Variable para registrar si la respuesta fue correcta

// ===== VARIABLES DE MOVIMIENTO =====
const CASILLAS_TOTALES = 25; // Total de casillas invisibles (igual a cantidad de preguntas)
const CASILLA_WIDTH = window.innerWidth / CASILLAS_TOTALES; // Ancho de cada casilla
let posicionJugador = 3; // El jugador empieza en la casilla 3 (con 3 de ventaja)
let posicionCamello = 0; // El camello empieza en la casilla 0

// Elementos del DOM
const contenedorCamello = document.getElementById("contenedor-camello");
const contenedorPlayer = document.getElementById("contenedor-player");

// ===== FUNCIONES DE PREGUNTAS =====
async function cargarPreguntas(idJuego = 2) {
    try {
        const apiPath = window.API_PATH || "";
        const response = await fetch(`${apiPath}/preguntas/${idJuego}`);
        if (!response.ok) {
            throw new Error("Error al cargar las preguntas");
        }
        const data = await response.json();
        console.log("Datos recibidos:", data);
        preguntas = data.preguntas || data;
        tiempoLimite = data.tiempo || 15;

        console.log("Preguntas cargadas:", preguntas.length);
        console.log("Tiempo límite:", tiempoLimite);

        if (preguntas.length > 0) {
            mostrarPregunta(0);
        } else {
            console.log("No hay preguntas disponibles");
        }

        return preguntas;
    } catch (error) {
        console.error("Error:", error);
    }
}

function iniciarTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }

    tiempoRestante = tiempoLimite;
    actualizarDisplayTimer();

    intervaloTimer = setInterval(() => {
        tiempoRestante--;
        actualizarDisplayTimer();

        const timerElement = document.getElementById("tiempo-restante");
        if (tiempoRestante <= 5) {
            timerElement.style.color = "#ef4444";
        } else {
            timerElement.style.color = "#966E31";
        }

        if (tiempoRestante <= 0) {
            clearInterval(intervaloTimer);
            tiempoAgotado();
        }
    }, 1000);
}

function actualizarDisplayTimer() {
    const timerElement = document.getElementById("tiempo-restante");
    if (timerElement) {
        timerElement.textContent = tiempoRestante;
    }
}

function tiempoAgotado() {
    deshabilitarBotones();
    mostrarPopup(
        "¡TIEMPO AGOTADO!",
        "Se acabó el tiempo para responder esta pregunta.",
        false
    );
}

function deshabilitarBotones() {
    document.getElementById("opcion1").disabled = true;
    document.getElementById("opcion2").disabled = true;
    document.getElementById("opcion3").disabled = true;
    document.getElementById("opcion4").disabled = true;
}

function habilitarBotones() {
    document.getElementById("opcion1").disabled = false;
    document.getElementById("opcion2").disabled = false;
    document.getElementById("opcion3").disabled = false;
    document.getElementById("opcion4").disabled = false;
}

function mostrarPregunta(index) {
    if (index >= preguntas.length) {
        console.log("No hay más preguntas disponibles.");
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    const dialogoTexto = document.querySelector("#texto-pregunta");
    if (dialogoTexto) {
        const contador = `Pregunta ${index + 1}/${preguntas.length}`;
        dialogoTexto.textContent = `${contador} - ${pregunta.pregunta}`;
    }

    document.getElementById("opcion1").textContent = pregunta.opcion_1;
    document.getElementById("opcion2").textContent = pregunta.opcion_2;
    document.getElementById("opcion3").textContent = pregunta.opcion_3;
    document.getElementById("opcion4").textContent = pregunta.opcion_4;

    habilitarBotones();
    iniciarTimer();
}

function verificarRespuesta(opcionSeleccionada) {
    clearInterval(intervaloTimer);
    deshabilitarBotones();

    const pregunta = preguntas[preguntaActual];
    const respuestaCorrecta = parseInt(pregunta.answer);

    if (respuestaCorrecta === opcionSeleccionada) {
        console.log("¡Respuesta correcta! ✅");
        mostrarPopup(
            "¡CORRECTO!",
            "¡Excelente! Has acertado la respuesta.",
            true
        );
        respuestaEsCorrecto = true;
    } else {
        console.log("Respuesta incorrecta ❌");
        mostrarPopup(
            "INCORRECTO",
            `La respuesta correcta era la opción ${pregunta.answer}.`,
            false
        );
        respuestaEsCorrecto = false;
    }
}

function mostrarPopup(titulo, mensaje, esCorrecto) {
    const popup = document.getElementById("popup-resultado");
    const popupContenido = document.getElementById("popup-contenido");
    const popupTitulo = document.getElementById("popup-titulo");
    const popupMensaje = document.getElementById("popup-mensaje");

    if (esCorrecto) {
        popupContenido.style.borderColor = "#22c55e";
        popupTitulo.style.color = "#22c55e";
        popupTitulo.textContent = titulo;
    } else {
        popupContenido.style.borderColor = "#ef4444";
        popupTitulo.style.color = "#ef4444";
        popupTitulo.textContent = titulo;
    }

    popupMensaje.textContent = mensaje;
    popupMensaje.style.color = "#4b5563";

    popup.classList.remove("hidden");
    setTimeout(() => {
        popupContenido.style.transform = "scale(1)";
    }, 10);
}

function cerrarPopup() {
    const popup = document.getElementById("popup-resultado");
    const popupContenido = document.getElementById("popup-contenido");

    popupContenido.style.transform = "scale(0.95)";
    setTimeout(async () => {
        popup.classList.add("hidden");

        await moverCamello();

        if (respuestaEsCorrecto) {
            await moverJugador();
        }

        const ganador = verificarGanador();
        if (ganador === "camello") {
            deshabilitarBotones();
            await mostrarCamelloMoving();
        } else if (ganador === "player") {
            mostrarPopup(
                "¡VICTORIA!",
                "¡Has llegado a la meta! ¡Ganaste!",
                true
            );
            deshabilitarBotones();
        } else {
            siguientePregunta();
        }
    }, 200);
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
    } else {
        console.log("Fin del juego 🎉");
        mostrarPopup(
            "¡JUEGO COMPLETADO!",
            "¡Felicidades! Has respondido todas las preguntas.",
            true
        );
        setTimeout(() => {
            document.querySelector("#popup-resultado button").onclick =
                function () {
                    window.location.href = "/";
                };
        }, 100);
    }
}

// ===== FUNCIONES DE MOVIMIENTO =====
function inicializarPosiciones() {
    actualizarPosicion("camello", posicionCamello);
    actualizarPosicion("player", posicionJugador);
}

// Actualizar la posición visual de un personaje
function actualizarPosicion(personaje, casilla) {
    const posicionPixeles = casilla * CASILLA_WIDTH;

    if (personaje === "camello") {
        contenedorCamello.style.transform = `translateX(${posicionPixeles}px)`;
    } else if (personaje === "player") {
        contenedorPlayer.style.transform = `translateX(${posicionPixeles}px)`;
    }
}

// Animar movimiento de un personaje
function animarMovimiento(personaje, casillasAMover) {
    return new Promise((resolve) => {
        if (personaje === "camello") {
            posicionCamello += casillasAMover;
            if (posicionCamello > CASILLAS_TOTALES)
                posicionCamello = CASILLAS_TOTALES;

            contenedorCamello.style.transition = "transform 0.6s ease-in-out";
            actualizarPosicion("camello", posicionCamello);

            setTimeout(() => {
                contenedorCamello.style.transition = "none";
                resolve();
            }, 600);
        } else if (personaje === "player") {
            posicionJugador += casillasAMover;
            if (posicionJugador > CASILLAS_TOTALES)
                posicionJugador = CASILLAS_TOTALES;

            contenedorPlayer.style.transition = "transform 0.6s ease-in-out";
            actualizarPosicion("player", posicionJugador);

            setTimeout(() => {
                contenedorPlayer.style.transition = "none";
                resolve();
            }, 600);
        }
    });
}

// Mover camello (siempre se mueve)
async function moverCamello() {
    console.log(`Camello se mueve. Posición anterior: ${posicionCamello}`);
    await animarMovimiento("camello", 1); // El camello se mueve 1 casilla
    console.log(`Camello se movió. Nueva posición: ${posicionCamello}`);
}

// Mover jugador (solo si acierta)
async function moverJugador() {
    console.log(`Jugador se mueve. Posición anterior: ${posicionJugador}`);
    await animarMovimiento("player", 1); // El jugador se mueve 1 casilla
    console.log(`Jugador se movió. Nueva posición: ${posicionJugador}`);
}

// Función para verificar si hay ganador
function verificarGanador() {
    // Si el camello alcanza al jugador, el jugador pierde
    if (posicionCamello >= posicionJugador) {
        return "camello";
    }
    // Si el jugador llega a la meta
    if (posicionJugador >= CASILLAS_TOTALES) {
        return "player";
    }
    // Si el camello llega a la meta (pero el jugador ya perdió antes)
    if (posicionCamello >= CASILLAS_TOTALES) {
        return "camello";
    }
    return null;
}

// Función para animar el camello moving cuando pierdes
async function mostrarCamelloMoving() {
    // Crear overlay oscuro
    const overlay = document.createElement("div");
    overlay.className = "fixed inset-0 bg-black opacity-50 z-40";
    document.body.appendChild(overlay);

    // Crear contenedor del camello moving
    const container = document.createElement("div");
    container.id = "camello-moving-container";
    container.className =
        "fixed inset-0 flex items-center justify-center z-50 overflow-hidden";
    document.body.appendChild(container);

    // Crear imagen del camello moving
    const camelImg = document.createElement("img");
    camelImg.src = "/img/personajes/camello/camel_moving.png"; // Asegúrate que este archivo existe
    camelImg.alt = "Camello Moving";
    camelImg.style.cssText = `
        width: 400px;
        height: auto;
        animation: camelMovingAnimation 5s ease-in-out forwards;
    `;

    container.appendChild(camelImg);

    // Esperar a que termine la animación (5 segundos)
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Remover elementos
    overlay.remove();
    container.remove();

    // Reiniciar el juego
    reiniciarJuego();
}

// Función para reiniciar el juego
function reiniciarJuego() {
    // Resetear variables
    preguntaActual = 0;
    posicionJugador = 3;
    posicionCamello = 0;
    respuestaEsCorrecto = false;

    // Actualizar posiciones visuales
    inicializarPosiciones();

    // Cargar y mostrar primera pregunta
    cargarPreguntas(2);
}

// Inicializar al cargar la página
document.addEventListener("DOMContentLoaded", function () {
    inicializarPosiciones();
});
