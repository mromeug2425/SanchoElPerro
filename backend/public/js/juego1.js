class SimpleMathGame {
    constructor() {
        this.solution = 0;
    }

    generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;

        const leftResult = num1 + num2;

        const num3 = Math.floor(Math.random() * (leftResult - 1)) + 1;
        const missing = leftResult - num3;

        this.solution = missing;

        return {
            numbers: [num1, num2, num3],
            solution: missing
        };
    }

    verifySolution(answer) {
        return answer === this.solution;
    }
}
let tiempoLimite = 15;
let tiempoRestante = 15;
let intervaloTimer = null;

let game;
let currentProblem;

document.addEventListener('DOMContentLoaded', function() {
    game = new SimpleMathGame();
    startNewGame();
});

function startNewGame() {
    currentProblem = game.generateProblem();

    const container = document.querySelector('.left-operation-box');
    const leftP = container.querySelector('p:nth-child(1)');
    const rightP = container.querySelector('p:nth-child(2)');

    leftP.textContent = `${currentProblem.numbers[0]} + ${currentProblem.numbers[1]}`;
    rightP.textContent = `${currentProblem.numbers[2]} + ?`;

    iniciarTimer();

    const options = generateOptions(currentProblem.solution);
    const buttons = document.querySelectorAll('button[data-option]');

    buttons.forEach((btn, i) => {
        btn.textContent = options[i];
        btn.dataset.value = options[i];
        btn.disabled = false; 
    });
}

function generateOptions(correct) {
    let opts = [correct];
    while (opts.length < 4) {
        let n = Math.floor(Math.random() * 10) + 1;
        if (!opts.includes(n)) opts.push(n);
    }
    return opts.sort(() => Math.random() - 0.5);
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
        
        const timerElement = document.getElementById('tiempo-restante');
        if (tiempoRestante <= 5) {
            timerElement.style.color = '#ef4444';
        } else {
            timerElement.style.color = '#966E31';
        }
        
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
    deshabilitarBotones();
    mostrarPopup('¡TIEMPO AGOTADO!', 'Se acabó el tiempo para responder esta pregunta.', false);
}

function deshabilitarBotones() {
    const buttons = document.querySelectorAll('button[data-option]');
    buttons.forEach(btn => {
        btn.disabled = true;
    });
}

function habilitarBotones() {
    const buttons = document.querySelectorAll('button[data-option]');
    buttons.forEach(btn => {
        btn.disabled = false;
    });
}

function comprobar(btn) {
    clearInterval(intervaloTimer);
    deshabilitarBotones();
    
    const selected = parseInt(btn.dataset.value);

    if (game.verifySolution(selected)) {
        mostrarPopup('¡CORRECTO!', '¡Excelente! Has acertado la respuesta.', true);
    } else {
        mostrarPopup('INCORRECTO', `La respuesta correcta era ${currentProblem.solution}.`, false);
    }
}

function mostrarPopup(titulo, mensaje, esCorrecto) {
    const popup = document.getElementById('popup-resultado');
    const popupContenido = document.getElementById('popup-contenido');
    const popupTitulo = document.getElementById('popup-titulo');
    const popupMensaje = document.getElementById('popup-mensaje');
    
    if (esCorrecto) {
        popupContenido.style.borderColor = '#22c55e';
        popupTitulo.style.color = '#22c55e';
        popupTitulo.textContent = titulo;
    } else {
        popupContenido.style.borderColor = '#ef4444';
        popupTitulo.style.color = '#ef4444';
        popupTitulo.textContent = titulo;
    }
    
    popupMensaje.textContent = mensaje;
    popupMensaje.style.color = '#4b5563';
    
    popup.classList.remove('hidden');
    setTimeout(() => {
        popupContenido.style.transform = 'scale(1)';
    }, 10);
}

function cerrarPopup() {
    const popup = document.getElementById('popup-resultado');
    const popupContenido = document.getElementById('popup-contenido');
    
    popupContenido.style.transform = 'scale(0.95)';
    setTimeout(() => {
        popup.classList.add('hidden');
        startNewGame();
    }, 200);
}