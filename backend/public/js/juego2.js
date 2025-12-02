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
    console.log("Cargando preguntas desde:", baseUrl + "/preguntas/" + idJuego);
    fetch(baseUrl + "/preguntas/" + idJuego)
        .then(function (response) {
            return response.json();
        })
        .then(function (data) {
            console.log("Preguntas cargadas:", data);
            preguntas = data.preguntas || data;
            tiempoLimite = data.tiempo || 15;

            if (preguntas.length > 0) {

                console.log(preguntas);
                medirImagenFondo();
                mostrarPregunta(0);
            }
        })
        .catch(function (error) {
            console.error("Error al cargar preguntas:", error);
        });
}

function iniciarTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }

    tiempoRestante = tiempoLimite;
    actualizarDisplayTimer();

    intervaloTimer = setInterval(function () {
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
        guardarRespuestaEnBD(pregunta, opcionSeleccionada, true);
    } else {
        console.log("Respuesta incorrecta ❌");
        mostrarPopup("INCORRECTO", "La respuesta correcta era la opción " + pregunta.answer + ".", false);
        respuestaEsCorrecto = false;
        guardarRespuestaEnBD(pregunta, opcionSeleccionada, false);
    }
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
    } else {
        console.log("Fin del juego");

        // Calcular resultados para finalizar sesión
        // En este juego simple no estamos trackeando monedas ganadas/gastadas por ahora
        // pero podríamos añadirlo si fuera necesario.
        // Asumimos ganado si se completan todas las preguntas (o podríamos poner un umbral)
        finalizarSesionJuego(0, 0, true);

        mostrarPopup("¡JUEGO COMPLETADO!", "¡Felicidades! Has respondido todas las preguntas.", true);
        setTimeout(function () {
            document.querySelector("#popup-resultado button").onclick = function () {
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
document.addEventListener("DOMContentLoaded", function () {
    cargarPreguntas(2);

    // Event listener para las teclas de flechas en QTE
    document.addEventListener("keydown", function (event) {
        procesarTeclaBTE(event);
    });
});

async function guardarRespuestaEnBD(pregunta, respuestaUsuario, acertada) {
    if (!window.sesionJuegoId && window.sesionJuegoReady) {
        try { await window.sesionJuegoReady; } catch (e) {}
    }
    if (!window.sesionJuegoId) {
        console.error('No hay sesión de juego activa');
        return;
    }

    // Preparar las opciones como un objeto
    const opciones = {
        opcion_1: pregunta.opcion_1,
        opcion_2: pregunta.opcion_2,
        opcion_3: pregunta.opcion_3,
        opcion_4: pregunta.opcion_4
    };

    // Enviar al backend
    fetch('/sesion-juego/guardar-respuesta', {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
            'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
        },
        body: JSON.stringify({
            id_sesion_juegos: window.sesionJuegoId,
            id_pregunta: pregunta.id,
            acertada: acertada,
            respuesta_usuario: respuestaUsuario,
            respuesta_correcta: pregunta.answer,
            opciones: opciones
        })
    })
        .then(async response => {
            if (!response.ok) {
                const text = await response.text();
                console.error('Error al guardar respuesta (HTTP ' + response.status + '):', text);
                throw new Error('HTTP ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                console.log('✅ Respuesta guardada en BD:', data.respuesta_id);
            } else {
                console.error('❌ Error al guardar respuesta:', data.error);
            }
        })
        .catch(error => console.error('❌ Error en la petición:', error));
}
