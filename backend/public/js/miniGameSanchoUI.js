let miniGame = null;
let miniGameActive = false;

function initMiniGame() {
    if (!miniGame) {
        miniGame = new MiniGameSancho("minigame-canvas");
        miniGame.init();
    }
}

function startMiniGameSequence() {
    alert("¡Sancho esta usando su ataque especial!");

    pauseMainTimer();

    showMiniGameOverlay();

    initMiniGame();

    setTimeout(() => {
        miniGameActive = true;
        miniGame.start(onMiniGameEnd);
    }, 500);
}

function showMiniGameOverlay() {
    const overlay = document.getElementById("mini-game-overlay");
    if (overlay) {
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
    }
}

function hideMiniGameOverlay() {
    const overlay = document.getElementById("mini-game-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
    }
}

function onMiniGameEnd(timeEarned) {
    miniGameActive = false;

    tiempoRestante += timeEarned;

    if (tiempoRestante < 0) {
        tiempoRestante = 0;
    }

    actualizarDisplayTimer();

    const message =
        timeEarned >= 0
            ? `¡Ataque especial completado!\n\nTime gained: +${timeEarned} seconds!`
            : `¡Ataque especial completado!\n\nTime lost: ${timeEarned} seconds`;

    alert(message);

    hideMiniGameOverlay();

    resumeMainTimer();

    setTimeout(startNewGame, 1000);
}

function pauseMainTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
    }
}

function resumeMainTimer() {
    if (tiempoRestante <= 0) {
        tiempoAgotado();
        return;
    }

    actualizarDisplayTimer();

    intervaloTimer = setInterval(() => {
        tiempoRestante--;
        actualizarDisplayTimer();

        const timerElement = document.getElementById("tiempo-restante");
        if (tiempoRestante <= 5) {
            timerElement.style.color = "#ef4444";
        } else {
            timerElement.style.color = "#3C3B4F";
        }

        if (tiempoRestante === 30 && !clueUsed) {
            document.getElementById("clue-btn").classList.remove("hidden");
        }

        if (tiempoRestante <= 0) {
            clearInterval(intervaloTimer);
            intervaloTimer = null;
            tiempoAgotado();
        }
    }, 1000);
}
