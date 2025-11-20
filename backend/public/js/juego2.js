//  VARIABLES DE PREGUNTAS 
let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15;
let tiempoRestante = 15;
let intervaloTimer = null;
let respuestaEsCorrecto = false; 

//  Posiciones de los personajes al empezar
let posicionJugador = 3; 
let posicionCamello = 0;

//  FUNCIONES DE PREGUNTAS 
function cargarPreguntas(idJuego) {
    const baseUrl = window.BASE_URL || window.location.origin;
    fetch(baseUrl + "/preguntas/" + idJuego)
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            console.log("Preguntas cargadas:", data);
            preguntas = data.preguntas || data;
            tiempoLimite = data.tiempo || 15;

            if (preguntas.length > 0) {
                
                console.log(preguntas);
                medirImagenFondo();
                mostrarPregunta(0);
            }
        })
        .catch(function(error) {
            console.error("Error al cargar preguntas:", error);
        });
}

function iniciarTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }

    tiempoRestante = tiempoLimite;
    actualizarDisplayTimer();

    intervaloTimer = setInterval(function() {
        tiempoRestante--;
        actualizarDisplayTimer();

        const timerElement = document.getElementById("tiempo-restante");
        if (tiempoRestante <= 5) {
            timerElement.style.color = "#ef4444";
        } else {
            timerElement.style.color = "#e60c0cff";
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
        "Se acabó el tiempo para responder.",
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
        console.log("No hay más preguntas");
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    const dialogoTexto = document.querySelector("#texto-pregunta");
    if (dialogoTexto) {
        dialogoTexto.textContent = "Pregunta " + (index + 1) + "/" + preguntas.length + " - " + pregunta.pregunta;
    }

    document.getElementById("opcion1").textContent = pregunta.opcion_1;
    document.getElementById("opcion2").textContent = pregunta.opcion_2;
    document.getElementById("opcion3").textContent = pregunta.opcion_3;
    document.getElementById("opcion4").textContent = pregunta.opcion_4;

    // Verificar si es la mitad de las preguntas para activar QTE
    const mitadPreguntas = Math.floor(preguntas.length / 2);
    if (index === mitadPreguntas && !qteActivo) {
        console.log("¡Activar QTE en la pregunta " + (index + 1) + "!");
        iniciarQTE();
    } else {
        habilitarBotones();
        iniciarTimer();
    }
}

function verificarRespuesta(opcionSeleccionada) {
    clearInterval(intervaloTimer);
    deshabilitarBotones();

    const pregunta = preguntas[preguntaActual];
    const respuestaCorrecta = parseInt(pregunta.answer);

    if (respuestaCorrecta === opcionSeleccionada) {
        console.log("¡Respuesta correcta! ✅");
        mostrarPopup("¡CORRECTO!", "¡Excelente! Has acertado <[:{V", true);
        respuestaEsCorrecto = true;
    } else {
        console.log("Respuesta incorrecta ❌");
        mostrarPopup("INCORRECTO", "La respuesta correcta era la opción " + pregunta.answer + ".", false);
        respuestaEsCorrecto = false;
    }
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
    } else {
        console.log("Fin del juego");
        mostrarPopup("¡JUEGO COMPLETADO!", "¡Felicidades! Has respondido todas las preguntas.", true);
        setTimeout(function() {
            document.querySelector("#popup-resultado button").onclick = function() {
                window.location.href = "/";
            };
        }, 100);
    }
}

function reiniciarJuego() {
    preguntaActual = 0;
    posicionJugador = 3;
    posicionCamello = 0;
    respuestaEsCorrecto = false;

    inicializarPosiciones();
    cargarPreguntas(2);
}

// Inicializar cuando carga la página
document.addEventListener("DOMContentLoaded", function() {
    cargarPreguntas(2);
    
    // Event listener para las teclas de flechas en QTE
    document.addEventListener("keydown", function(event) {
        procesarTeclaBTE(event);
    });
});
