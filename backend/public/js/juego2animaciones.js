//  ELEMENTOS DEL DOM 
const contenedorCamello = document.getElementById("contenedor-camello");
const contenedorPlayer = document.getElementById("contenedor-player");

//  VARIABLES DE ANIMACIÓN 
let anchoFondo = 0;
let casillasTotal = 0;
let anchoPortal = 0;


//  FUNCIÓN PARA MEDIR LA IMAGEN DE FONDO 
function medirImagenFondo() {
    // Obtener el div principal de la foto 
    const divPrincipal = document.querySelector("main");
    
    if (divPrincipal) {
        anchoFondo = divPrincipal.offsetWidth;
        console.log("Ancho del fondo medido: " + anchoFondo + "px");
        
        // Calcular ancho de cada casilla basándose en la cantidad de preguntas
        console.log("Cantidad de preguntas: 3 " + preguntas.length);
        if (preguntas.length > 0) {
            casillasTotal = preguntas.length + 3;
            anchoPortal = anchoFondo / casillasTotal;
            console.log("Total de casillas: " + casillasTotal);
            console.log("Ancho de cada casilla: " + anchoPortal + "px");
            
            
            inicializarPosiciones();
        }
    }
}

//  FUNCIONES DE POSICIONAMIENTO 
function inicializarPosiciones() {
    actualizarPosicion("camello", posicionCamello);
    actualizarPosicion("player", posicionJugador);
}


function actualizarPosicion(personaje, casilla) {
    const posicionPixeles = casilla * anchoPortal;

    if (personaje === "camello") {
        contenedorCamello.style.transform = `translateX(${posicionPixeles}px)`;
    } else if (personaje === "player") {
        contenedorPlayer.style.transform = `translateX(${posicionPixeles}px)`;
    }
}

//  FUNCIONES DE ANIMACIÓN DE MOVIMIENTO 

function moverCamello() {
    console.log(`Camello se mueve. Posición anterior: ${posicionCamello}`);
    posicionCamello += 1;
    if (posicionCamello > casillasTotal)
        posicionCamello = casillasTotal;

    contenedorCamello.style.transition = "transform 0.6s ease-in-out";
    actualizarPosicion("camello", posicionCamello);

    console.log(`Camello se movió. Nueva posición: ${posicionCamello}`);
}

// Mover al jugador (solo si acierta)
function moverJugador() {
    console.log(`Jugador se mueve. Posición anterior: ${posicionJugador}`);
    posicionJugador += 1;
    if (posicionJugador > casillasTotal)
        posicionJugador = casillasTotal;

    contenedorPlayer.style.transition = "transform 0.6s ease-in-out";
    actualizarPosicion("player", posicionJugador);

    console.log(`Jugador se movió. Nueva posición: ${posicionJugador}`);
}

// FUNCIONES DE VERIFICACIÓN Y FIN DE JUEGO 

function verificarGanador() {
    
    if (posicionCamello >= posicionJugador) {
        return "camello";
    }
    
    if (posicionJugador >= casillasTotal) {
        return "player";
    }
    // Si el camello llega a la meta (pero el jugador ya perdió antes)
    if (posicionCamello >= casillasTotal) {
        return "camello";
    }
    return null;
}


