let preguntas = [];
let preguntaActual = 0;
let tiempoLimite = 15;
let tiempoRestante = 15;
let intervaloTimer = null;
let opcionArrastrada = null;
let dragAndDropHabilitado = true;

// Cargar preguntas al iniciar la página
document.addEventListener("DOMContentLoaded", function () {
    cargarPreguntas(1);
    inicializarDragAndDrop();
});

async function cargarPreguntas(idJuego = 1) {
    try {
        const baseUrl = window.BASE_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/preguntas/${idJuego}`);
        if (!response.ok) {
            throw new Error("Error al cargar las preguntas");
        }
        const data = await response.json();
        preguntas = data.preguntas || data;
        tiempoLimite = data.tiempo || 15;

        if (preguntas.length > 0) {
            mostrarPregunta(0);
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
    dragAndDropHabilitado = false;
    deshabilitarOpciones();
    mostrarPopup(
        "¡TIEMPO AGOTADO!",
        "Se acabó el tiempo para responder esta pregunta.",
        false
    );
}

function deshabilitarOpciones() {
    const opciones = document.querySelectorAll('[data-opcion]');
    opciones.forEach(opcion => {
        opcion.classList.add('opcion-disabled');
        opcion.setAttribute('draggable', 'false');
        opcion.style.pointerEvents = 'none';
    });
}

function habilitarOpciones() {
    const opciones = document.querySelectorAll('[data-opcion]');
    opciones.forEach(opcion => {
        opcion.classList.remove('opcion-disabled');
        opcion.setAttribute('draggable', 'true');
        opcion.style.pointerEvents = 'auto';
    });
}

function mostrarPregunta(index) {
    if (index >= preguntas.length) {
        console.log("No hay más preguntas disponibles.");
        return;
    }

    const pregunta = preguntas[index];
    preguntaActual = index;

    const dialogoTexto = document.querySelector("#dialogo-pregunta p");
    if (dialogoTexto) {
        const contador = `Pregunta ${index + 1}/${preguntas.length}`;
        dialogoTexto.textContent = `${contador} - ${pregunta.pregunta}`;
    }

    document.getElementById("opcion1").textContent = pregunta.opcion_1;
    document.getElementById("opcion2").textContent = pregunta.opcion_2;
    document.getElementById("opcion3").textContent = pregunta.opcion_3;
    document.getElementById("opcion4").textContent = pregunta.opcion_4;

    resetearDropZone();
    dragAndDropHabilitado = true;
    habilitarOpciones();
    
    const opciones = document.querySelectorAll('[data-opcion]');
    opciones.forEach(opcion => {
        opcion.addEventListener('dragstart', handleDragStart);
        opcion.addEventListener('dragend', handleDragEnd);
    });

    iniciarTimer();
}

function verificarRespuesta(opcionSeleccionada) {
    clearInterval(intervaloTimer);
    deshabilitarOpciones();

    const pregunta = preguntas[preguntaActual];

    if (pregunta.answer === opcionSeleccionada) {
        console.log("¡Respuesta correcta! ✅");
        mostrarPopup(
            "¡CORRECTO!",
            "¡Excelente! Has acertado la respuesta.",
            true
        );
    } else {
        console.log("Respuesta incorrecta ❌");
        mostrarPopup(
            "INCORRECTO",
            `La respuesta correcta era la opción ${pregunta.answer}.`,
            false
        );
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
    setTimeout(() => {
        popup.classList.add("hidden");
        siguientePregunta();
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

function inicializarDragAndDrop() {
    const dropZone = document.getElementById('drop-zone');

    if (dropZone) {
        dropZone.addEventListener('dragover', handleDragOver, false);
        dropZone.addEventListener('dragenter', handleDragOver, false);
        dropZone.addEventListener('dragleave', handleDragLeave, false);
        dropZone.addEventListener('drop', handleDrop, false);
        console.log('✅ Drag & Drop inicializado');
    } else {
        console.error('❌ No se encontró drop-zone');
    }
}

function handleDragStart(e) {
    if (!dragAndDropHabilitado) {
        e.preventDefault();
        return;
    }
    
    opcionArrastrada = e.target.dataset.opcion;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', opcionArrastrada);
    console.log('🎯 Arrastrando opción:', opcionArrastrada);
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDragOver(e) {
    e.preventDefault();
    e.stopPropagation();

    if (!dragAndDropHabilitado) {
        e.dataTransfer.dropEffect = 'none';
        return false;
    }

    e.dataTransfer.dropEffect = 'move';

    const dropZone = document.getElementById('drop-zone');
    if (dropZone && !dropZone.classList.contains('drag-over')) {
        dropZone.classList.add('drag-over');
    }

    return false;
}
function handleDragLeave(e) {
    const dropZone = document.getElementById('drop-zone');
    if (e.target === dropZone) {
        dropZone.classList.remove('drag-over');
    }
}

function handleDrop(e) {
    e.stopPropagation();
    e.preventDefault();

    console.log('📦 Drop event triggered');
    console.log('📦 dragAndDropHabilitado:', dragAndDropHabilitado);
    console.log('📦 opcionArrastrada:', opcionArrastrada);

    const dropZone = document.getElementById('drop-zone');
    if (dropZone) {
        dropZone.classList.remove('drag-over');
    }

    const opcion = opcionArrastrada || e.dataTransfer.getData('text/plain');
    console.log('📦 Opción final:', opcion);

    if (opcion && dragAndDropHabilitado) {
        dragAndDropHabilitado = false;
        deshabilitarOpciones();
        verificarRespuesta(parseInt(opcion));
    } else {
        console.error('❌ No se pudo obtener la opción o drag está deshabilitado');
    }

    return false;
}

function resetearDropZone() {
    const dropZone = document.getElementById('drop-zone');
    dropZone.innerHTML = `
        <div class="text-center">
            <svg class="w-24 h-24 mx-auto mb-4 text-[#966E31] opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4"></path>
            </svg>
            <p class="text-2xl font-jersey text-[#966E31] font-bold">Arrastra aquí la respuesta correcta</p>
        </div>
    `;
    dropZone.classList.remove('drag-over');

    dropZone.removeEventListener('dragover', handleDragOver, false);
    dropZone.removeEventListener('dragenter', handleDragOver, false);
    dropZone.removeEventListener('dragleave', handleDragLeave, false);
    dropZone.removeEventListener('drop', handleDrop, false);

    dropZone.addEventListener('dragover', handleDragOver, false);
    dropZone.addEventListener('dragenter', handleDragOver, false);
    dropZone.addEventListener('dragleave', handleDragLeave, false);
    dropZone.addEventListener('drop', handleDrop, false);
}