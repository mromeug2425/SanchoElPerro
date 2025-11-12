// Variables para el movimiento de personajes
const CASILLAS_TOTALES = 25; // Total de casillas invisibles (igual a cantidad de preguntas)
const CASILLA_WIDTH = window.innerWidth / CASILLAS_TOTALES; // Ancho de cada casilla
let posicionJugador = 3; // El jugador empieza en la casilla 3 (con 3 de ventaja)
let posicionCamello = 0; // El camello empieza en la casilla 0

// Elementos del DOM
const contenedorCamello = document.getElementById('contenedor-camello');
const contenedorPlayer = document.getElementById('contenedor-player');

// Inicializar posiciones de los personajes
function inicializarPosiciones() {
    actualizarPosicion('camello', posicionCamello);
    actualizarPosicion('player', posicionJugador);
}

// Actualizar la posición visual de un personaje
function actualizarPosicion(personaje, casilla) {
    const posicionPixeles = casilla * CASILLA_WIDTH;
    
    if (personaje === 'camello') {
        contenedorCamello.style.transform = `translateX(${posicionPixeles}px)`;
    } else if (personaje === 'player') {
        contenedorPlayer.style.transform = `translateX(${posicionPixeles}px)`;
    }
}

// Animar movimiento de un personaje
function animarMovimiento(personaje, casillasAMover) {
    return new Promise((resolve) => {
        if (personaje === 'camello') {
            posicionCamello += casillasAMover;
            if (posicionCamello > CASILLAS_TOTALES) posicionCamello = CASILLAS_TOTALES;
            
            contenedorCamello.style.transition = 'transform 0.6s ease-in-out';
            actualizarPosicion('camello', posicionCamello);
            
            setTimeout(() => {
                contenedorCamello.style.transition = 'none';
                resolve();
            }, 600);
        } else if (personaje === 'player') {
            posicionJugador += casillasAMover;
            if (posicionJugador > CASILLAS_TOTALES) posicionJugador = CASILLAS_TOTALES;
            
            contenedorPlayer.style.transition = 'transform 0.6s ease-in-out';
            actualizarPosicion('player', posicionJugador);
            
            setTimeout(() => {
                contenedorPlayer.style.transition = 'none';
                resolve();
            }, 600);
        }
    });
}

// Mover camello (siempre se mueve)
async function moverCamello() {
    console.log(`Camello se mueve. Posición anterior: ${posicionCamello}`);
    await animarMovimiento('camello', 1); // El camello se mueve 1 casilla
    console.log(`Camello se movió. Nueva posición: ${posicionCamello}`);
}

// Mover jugador (solo si acierta)
async function moverJugador() {
    console.log(`Jugador se mueve. Posición anterior: ${posicionJugador}`);
    await animarMovimiento('player', 1); // El jugador se mueve 1 casilla
    console.log(`Jugador se movió. Nueva posición: ${posicionJugador}`);
}

// Función para verificar si hay ganador
function verificarGanador() {
    // Si el camello alcanza al jugador, el jugador pierde
    if (posicionCamello >= posicionJugador) {
        return 'camello';
    }
    // Si el jugador llega a la meta
    if (posicionJugador >= CASILLAS_TOTALES) {
        return 'player';
    }
    // Si el camello llega a la meta (pero el jugador ya perdió antes)
    if (posicionCamello >= CASILLAS_TOTALES) {
        return 'camello';
    }
    return null;
}

// Función para animar el camello moving cuando pierdes
async function mostrarCamelloMoving() {
    // Crear overlay oscuro
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 bg-black opacity-50 z-40';
    document.body.appendChild(overlay);
    
    // Crear contenedor del camello moving
    const container = document.createElement('div');
    container.id = 'camello-moving-container';
    container.className = 'fixed inset-0 flex items-center justify-center z-50 overflow-hidden';
    document.body.appendChild(container);
    
    // Crear imagen del camello moving
    const camelImg = document.createElement('img');
    camelImg.src = '/img/personajes/camello/camel_moving.png'; // Asegúrate que este archivo existe
    camelImg.alt = 'Camello Moving';
    camelImg.style.cssText = `
        width: 400px;
        height: auto;
        animation: camelMovingAnimation 5s ease-in-out forwards;
    `;
    
    container.appendChild(camelImg);
    
    // Esperar a que termine la animación (5 segundos)
    await new Promise(resolve => setTimeout(resolve, 5000));
    
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
document.addEventListener('DOMContentLoaded', function() {
    inicializarPosiciones();
});

