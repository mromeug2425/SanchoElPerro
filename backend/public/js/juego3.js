// JUEGO 3 - Sistema de preguntas y respuestas
let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15; // Tiempo por defecto
let tiempoRestante = 15;
let intervaloTimer = null;
let respuestaEsCorrecto = false;

// Cargar preguntas del juego 3 desde la base de datos
async function cargarPreguntas() {
    const idJuego = 3; // ID fijo para el juego 3
    
    try {
        console.log('🎮 Cargando preguntas del juego 3...');
        const response = await fetch(`/preguntas/${idJuego}`);
        
        if (!response.ok) {
            throw new Error(`Error HTTP: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📦 Datos recibidos de la BD:', data);
        
        // Extraer preguntas y tiempo del objeto recibido
        preguntas = data.preguntas || data;
        tiempoLimite = data.tiempo || 15;
        
        console.log(`✅ ${preguntas.length} preguntas cargadas correctamente`);
        console.log(`⏱️ Tiempo límite: ${tiempoLimite} segundos`);
        
        // Validar que haya preguntas
        if (preguntas.length === 0) {
            throw new Error('No hay preguntas disponibles para este juego');
        }
        
        // Mostrar la primera pregunta
        mostrarPregunta(0);
        
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

// Iniciar el temporizador
function iniciarTimer() {
    // Limpiar timer anterior si existe
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }
    
    // Resetear tiempo al límite definido en la BD
    tiempoRestante = tiempoLimite;
    actualizarDisplayTimer();
    
    console.log(`⏰ Timer iniciado: ${tiempoLimite} segundos`);
    
    // Iniciar contador regresivo
    intervaloTimer = setInterval(() => {
        tiempoRestante--;
        actualizarDisplayTimer();
        
        // Cambiar color cuando queda poco tiempo
        const timerElement = document.getElementById('tiempo-restante');
        if (timerElement) {
            if (tiempoRestante <= 5) {
                timerElement.style.color = '#ef4444'; // Rojo
            } else {
                timerElement.style.color = '#966E31'; // Color original
            }
        }
        
        // Si se acaba el tiempo
        if (tiempoRestante <= 0) {
            clearInterval(intervaloTimer);
            console.log('⏱️ ¡Tiempo agotado!');
            tiempoAgotado();
        }
    }, 1000);
}

// Actualizar el display del temporizador
function actualizarDisplayTimer() {
    const timerElement = document.getElementById('tiempo-restante');
    if (timerElement) {
        timerElement.textContent = tiempoRestante;
    }
}

// Manejar cuando se agota el tiempo
function tiempoAgotado() {
    deshabilitarBotones();
    mostrarPopup('¡TIEMPO AGOTADO!', 'Se acabó el tiempo para responder esta pregunta.', false);
}

// Deshabilitar todos los botones de opciones
function deshabilitarBotones() {
    const botones = ['opcion1', 'opcion2', 'opcion3', 'opcion4'];
    botones.forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.disabled = true;
            boton.style.cursor = 'not-allowed';
            boton.style.opacity = '0.5';
        }
    });
}

// Habilitar todos los botones de opciones
function habilitarBotones() {
    const botones = ['opcion1', 'opcion2', 'opcion3', 'opcion4'];
    botones.forEach(id => {
        const boton = document.getElementById(id);
        if (boton) {
            boton.disabled = false;
            boton.style.cursor = 'pointer';
            boton.style.opacity = '1';
        }
    });
}

// Mostrar una pregunta específica
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

    // Actualizar los botones con las opciones desde la BD
    const opciones = [
        { id: 'opcion1', texto: pregunta.opcion_1 },
        { id: 'opcion2', texto: pregunta.opcion_2 },
        { id: 'opcion3', texto: pregunta.opcion_3 },
        { id: 'opcion4', texto: pregunta.opcion_4 }
    ];

    opciones.forEach(opcion => {
        const boton = document.getElementById(opcion.id);
        if (boton) {
            boton.textContent = opcion.texto;
        } else {
            console.error(`❌ No se encontró el botón #${opcion.id}`);
        }
    });
    
    // Habilitar botones y iniciar timer
    habilitarBotones();
    iniciarTimer();
}

// Verificar la respuesta seleccionada
function verificarRespuesta(opcionSeleccionada) {
    console.log(`🎯 Verificando respuesta: Opción ${opcionSeleccionada}`);
    
    // Detener el timer
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
    }
    
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


