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
        alert('¡Correcto!');
    } else {
        console.log('Respuesta incorrecta ❌');
        alert('Incorrecto. La respuesta correcta era: ' + pregunta.answer);
    }
    
    setTimeout(() => {
        siguientePregunta();
    }, 1000);
}

function siguientePregunta() {
    if (preguntaActual < preguntas.length - 1) {
        mostrarPregunta(preguntaActual + 1);
    } else {
        console.log('Fin del juego 🎉');
        alert('¡Has completado todas las preguntas!');
    }
}


