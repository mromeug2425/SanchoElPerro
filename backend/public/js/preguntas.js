let preguntas = [];
let preguntaActual = 0;

// Cargar preguntas al iniciar la página
document.addEventListener('DOMContentLoaded', function() {
    cargarPreguntas(1);     // ID del juego 1 (cambiar cuando haya preguntas del juego 3)
});

async function cargarPreguntas(idJuego = 1) {
    try {
        const response = await fetch(`/preguntas/${idJuego}`);
        if (!response.ok) {
            throw new Error('Error al cargar las preguntas');
        }
        preguntas = await response.json();
        
        if (preguntas.length > 0) {
            mostrarPregunta(0);
        }
        
        return preguntas;
    } catch (error) {
        console.error('Error:', error);
    }
}

function mostrarPregunta(index) {
    if (index >= preguntas.length) {  
        console.log('No hay más preguntas disponibles.');
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    // Actualizar el texto del diálogo con la pregunta
    const dialogoTexto = document.querySelector('#dialogo-pregunta p');
    if (dialogoTexto) {
        dialogoTexto.textContent = pregunta.pregunta;
    }

    // Actualizar los botones con las opciones
    document.getElementById('opcion1').textContent = pregunta.opcion_1;
    document.getElementById('opcion2').textContent = pregunta.opcion_2;
    document.getElementById('opcion3').textContent = pregunta.opcion_3;
    document.getElementById('opcion4').textContent = pregunta.opcion_4;
}

function verificarRespuesta(opcionSeleccionada) {
    const pregunta = preguntas[preguntaActual];
    
    if (pregunta.answer === opcionSeleccionada) {
        console.log('¡Respuesta correcta! ✅');
        mostrarPopup('¡CORRECTO!', '¡Excelente! Has acertado la respuesta.', true);
    } else {
        console.log('Respuesta incorrecta ❌');
        mostrarPopup('INCORRECTO', `La respuesta correcta era la opción ${pregunta.answer}.`, false);
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


