let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15; // Tiempo por defecto
let tiempoRestante = 15;
let intervaloTimer = null;
let respuestaEsCorrecto = false; // Variable para registrar si la respuesta fue correcta

async function cargarPreguntas(idJuego = 1) {
    try {
        const response = await fetch(`/preguntas/${idJuego}`);
        if (!response.ok) {
            throw new Error('Error al cargar las preguntas');
        }
        const data = await response.json();
        console.log('Datos recibidos:', data); // Log para debugging
        preguntas = data.preguntas || data; // Soporte para ambos formatos
        tiempoLimite = data.tiempo || 15; // Obtener el tiempo de la BD
        
        console.log('Preguntas cargadas:', preguntas.length); // Log para debugging
        console.log('Tiempo límite:', tiempoLimite); // Log para debugging
        
        if (preguntas.length > 0) {
            mostrarPregunta(0);
        } else {
            console.log('No hay preguntas disponibles');
        }
        
        return preguntas;
    } catch (error) {
        console.error('Error:', error);
    }
}

function iniciarTimer() {
    // Limpiar timer anterior si existe
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }
    
    // Resetear tiempo
    tiempoRestante = tiempoLimite;
    actualizarDisplayTimer();
    
    // Iniciar contador regresivo
    intervaloTimer = setInterval(() => {
        tiempoRestante--;
        actualizarDisplayTimer();
        
        // Cambiar color cuando queda poco tiempo
        const timerElement = document.getElementById('tiempo-restante');
        if (tiempoRestante <= 5) {
            timerElement.style.color = '#ef4444'; // Rojo
        } else {
            timerElement.style.color = '#966E31'; // Color original
        }
        
        // Si se acaba el tiempo
        if (tiempoRestante <= 0) {
            clearInterval(intervaloTimer);
            tiempoAgotado();
        }
    }, 1000);
}

function actualizarDisplayTimer() {
    const timerElement = document.getElementById('tiempo-restante');
    if (timerElement) {
        timerElement.textContent = tiempoRestante;
    }
}

function tiempoAgotado() {
    // Deshabilitar botones
    deshabilitarBotones();
    
    // Mostrar popup de tiempo agotado
    mostrarPopup('¡TIEMPO AGOTADO!', 'Se acabó el tiempo para responder esta pregunta.', false);
}

function deshabilitarBotones() {
    document.getElementById('opcion1').disabled = true;
    document.getElementById('opcion2').disabled = true;
    document.getElementById('opcion3').disabled = true;
    document.getElementById('opcion4').disabled = true;
}

function habilitarBotones() {
    document.getElementById('opcion1').disabled = false;
    document.getElementById('opcion2').disabled = false;
    document.getElementById('opcion3').disabled = false;
    document.getElementById('opcion4').disabled = false;
}

function mostrarPregunta(index) {
    if (index >= preguntas.length) {  
        console.log('No hay más preguntas disponibles.');
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    // Actualizar el texto del diálogo con la pregunta y el contador
    const dialogoTexto = document.querySelector('#texto-pregunta');
    if (dialogoTexto) {
        const contador = `Pregunta ${index + 1}/${preguntas.length}`;
        dialogoTexto.textContent = `${contador} - ${pregunta.pregunta}`;
    }

    // Actualizar los botones con las opciones
    document.getElementById('opcion1').textContent = pregunta.opcion_1;
    document.getElementById('opcion2').textContent = pregunta.opcion_2;
    document.getElementById('opcion3').textContent = pregunta.opcion_3;
    document.getElementById('opcion4').textContent = pregunta.opcion_4;
    
    // Habilitar botones y iniciar timer
    habilitarBotones();
    iniciarTimer();
}

function verificarRespuesta(opcionSeleccionada) {
    // Detener el timer
    clearInterval(intervaloTimer);
    
    // Deshabilitar botones para evitar múltiples clics
    deshabilitarBotones();
    
    const pregunta = preguntas[preguntaActual];
    
    // Convertir answer a número para hacer la comparación correctamente
    const respuestaCorrecta = parseInt(pregunta.answer);
    
    if (respuestaCorrecta === opcionSeleccionada) {
        console.log('¡Respuesta correcta! ✅');
        mostrarPopup('¡CORRECTO!', '¡Excelente! Has acertado la respuesta.', true);
        respuestaEsCorrecto = true; // Variable global para uso en cerrarPopup
    } else {
        console.log('Respuesta incorrecta ❌');
        mostrarPopup('INCORRECTO', `La respuesta correcta era la opción ${pregunta.answer}.`, false);
        respuestaEsCorrecto = false;
    }
}

function mostrarPopup(titulo, mensaje, esCorrecto) {
    const popup = document.getElementById('popup-resultado');
    const popupContenido = document.getElementById('popup-contenido');
    const popupTitulo = document.getElementById('popup-titulo');
    const popupMensaje = document.getElementById('popup-mensaje');
    
    // Configurar colores según si es correcto o incorrecto
    if (esCorrecto) {
        popupContenido.style.borderColor = '#22c55e'; // Verde
        popupTitulo.style.color = '#22c55e';
        popupTitulo.textContent = titulo;
    } else {
        popupContenido.style.borderColor = '#ef4444'; // Rojo
        popupTitulo.style.color = '#ef4444';
        popupTitulo.textContent = titulo;
    }
    
    popupMensaje.textContent = mensaje;
    popupMensaje.style.color = '#4b5563'; // Gris oscuro
    
    // Mostrar el popup con animación
    popup.classList.remove('hidden');
    setTimeout(() => {
        popupContenido.style.transform = 'scale(1)';
    }, 10);
}

function cerrarPopup() {
    const popup = document.getElementById('popup-resultado');
    const popupContenido = document.getElementById('popup-contenido');
    
    // Animar cierre
    popupContenido.style.transform = 'scale(0.95)';
    setTimeout(async () => {
        popup.classList.add('hidden');
        
        // Mover los personajes
        await moverCamello(); // El camello siempre se mueve
        
        if (respuestaEsCorrecto) {
            await moverJugador(); // El jugador solo se mueve si acierta
        }
        
        // Verificar si hay ganador
        const ganador = verificarGanador();
        if (ganador === 'camello') {
            deshabilitarBotones();
            // Mostrar animación de camello moving en lugar de popup
            await mostrarCamelloMoving();
        } else if (ganador === 'player') {
            mostrarPopup('¡VICTORIA!', '¡Has llegado a la meta! ¡Ganaste!', true);
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
        console.log('Fin del juego 🎉');
        mostrarPopup('¡JUEGO COMPLETADO!', '¡Felicidades! Has respondido todas las preguntas.', true);
        // Modificar el botón para volver al inicio
        setTimeout(() => {
            document.querySelector('#popup-resultado button').onclick = function() {
                window.location.href = '/';
            };
        }, 100);
    }
}


