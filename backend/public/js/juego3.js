// JUEGO 3 - Sistema de preguntas desde la base de datos
let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15; // Tiempo por defecto
let tiempoRestante = 15;
let intervaloTimer = null;
let respuestaEsCorrecto = false;

// Cargar preguntas del JUEGO 3 al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('🎮 Inicializando Juego 3...');
    cargarPreguntas();
});

// Función para cargar las preguntas del juego 3 desde la base de datos
async function cargarPreguntas() {
    const idJuego = 3; // ID FIJO para el juego 3
    
    try {
        console.log(`📡 Cargando preguntas del juego ${idJuego}...`);
        const response = await fetch(`/preguntas/${idJuego}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos recibidos de la BD:', data);
        
        // Extraer preguntas y tiempo
        preguntas = data.preguntas || data;
        tiempoLimite = data.tiempo || 15;
        
        console.log(`✅ ${preguntas.length} preguntas cargadas del juego 3`);
        console.log(`⏱️ Tiempo límite: ${tiempoLimite} segundos`);
        
        // Validar que hay preguntas
        if (preguntas.length > 0) {
            mostrarPregunta(0);
        } else {
            console.error('❌ No hay preguntas disponibles para el juego 3');
            const dialogoTexto = document.querySelector('#texto-pregunta');
            if (dialogoTexto) {
                dialogoTexto.textContent = 'No hay preguntas disponibles para este juego.';
            }
        }
        
        return preguntas;
    } catch (error) {
        console.error('❌ Error al cargar preguntas:', error);
        const dialogoTexto = document.querySelector('#texto-pregunta');
        if (dialogoTexto) {
            dialogoTexto.textContent = 'Error al cargar las preguntas. Por favor, recarga la página.';
        }
        deshabilitarBotones();
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
        console.log('⚠️ No hay más preguntas disponibles.');
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    console.log(`📋 Mostrando pregunta ${index + 1}/${preguntas.length}`);
    console.log('Pregunta:', pregunta.pregunta);

    // Actualizar el texto del diálogo con la pregunta y el contador
    const dialogoTexto = document.querySelector('#texto-pregunta');
    if (dialogoTexto) {
        const contador = `Pregunta ${index + 1}/${preguntas.length}`;
        dialogoTexto.textContent = `${contador} - ${pregunta.pregunta}`;
    } else {
        console.error('❌ No se encontró el elemento #texto-pregunta');
    }

    // Actualizar los botones con las opciones de la BD
    document.getElementById('opcion1').textContent = pregunta.opcion_1;
    document.getElementById('opcion2').textContent = pregunta.opcion_2;
    document.getElementById('opcion3').textContent = pregunta.opcion_3;
    document.getElementById('opcion4').textContent = pregunta.opcion_4;
    
    // Habilitar botones y iniciar timer
    habilitarBotones();
    iniciarTimer();
}

function verificarRespuesta(opcionSeleccionada) {
    console.log(`🎯 Verificando respuesta: Opción ${opcionSeleccionada}`);
    
    // Detener el timer
    clearInterval(intervaloTimer);
    
    // Deshabilitar botones para evitar múltiples clics
    deshabilitarBotones();
    
    const pregunta = preguntas[preguntaActual];
    
    // Convertir answer a número para comparación correcta
    const respuestaCorrecta = parseInt(pregunta.answer);
    
    console.log('Respuesta correcta:', respuestaCorrecta);
    console.log('Respuesta seleccionada:', opcionSeleccionada);
    
    if (respuestaCorrecta === opcionSeleccionada) {
        console.log('✅ ¡Respuesta correcta!');
        mostrarPopup('¡CORRECTO!', '¡Excelente! Has acertado la respuesta.', true);
        respuestaEsCorrecto = true;
    } else {
        console.log('❌ Respuesta incorrecta');
        mostrarPopup('INCORRECTO', `La respuesta correcta era la opción ${respuestaCorrecta}.`, false);
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
    setTimeout(() => {
        popup.classList.add('hidden');
        siguientePregunta();
    }, 200);
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        console.log(`➡️ Avanzando a la siguiente pregunta (${preguntaActual + 2}/${preguntas.length})`);
        mostrarPregunta(preguntaActual + 1);
    } else {
        console.log('🎉 ¡Juego completado! Todas las preguntas respondidas.');
        mostrarPopup('¡JUEGO COMPLETADO!', '¡Felicidades! Has respondido todas las preguntas del Juego 3.', true);
        // Modificar el botón para volver al inicio
        setTimeout(() => {
            const botonContinuar = document.querySelector('#popup-resultado button');
            if (botonContinuar) {
                botonContinuar.onclick = function() {
                    window.location.href = '/home';
                };
                botonContinuar.textContent = 'Volver al Inicio';
            }
        }, 100);
    }
}


