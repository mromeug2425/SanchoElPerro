// Mini-Game UI Controller
let miniGame = null;
let miniGameActive = false;

// Initialize mini-game
function initMiniGame() {
    if (!miniGame) {
        miniGame = new MiniGameSancho("minigame-canvas");
        miniGame.init();
    }
}

// Start mini-game sequence
function startMiniGameSequence() {
    // Show special attack message
    alert("¡Sancho esta usando su ataque especial!");

    // Pause main game timer
    pauseMainTimer();

    // Show overlay
    showMiniGameOverlay();

    // Initialize if needed
    initMiniGame();

    // Start mini-game after brief delay
    setTimeout(() => {
        miniGameActive = true;
        miniGame.start(onMiniGameEnd);
    }, 500);
}

// Show mini-game overlay
function showMiniGameOverlay() {
    const overlay = document.getElementById("mini-game-overlay");
    if (overlay) {
        overlay.classList.remove("hidden");
        overlay.classList.add("flex");
    }
}

// Hide mini-game overlay
function hideMiniGameOverlay() {
    const overlay = document.getElementById("mini-game-overlay");
    if (overlay) {
        overlay.classList.add("hidden");
        overlay.classList.remove("flex");
    }
}

// Called when mini-game ends
function onMiniGameEnd(timeEarned) {
    miniGameActive = false;

    // Apply time earned/lost to main game
    tiempoRestante += timeEarned;

    // Don't let time go below 0
    if (tiempoRestante < 0) {
        tiempoRestante = 0;
    }

    // Update main timer display
    actualizarDisplayTimer();

    // Show result
    const message =
        timeEarned >= 0
            ? `¡Ataque especial completado!\n\nTime gained: +${timeEarned} seconds!`
            : `¡Ataque especial completado!\n\nTime lost: ${timeEarned} seconds`;

    alert(message);

    // Hide overlay
    hideMiniGameOverlay();

    // Resume main game timer
    resumeMainTimer();

    // Continue to next challenge
    setTimeout(startNewGame, 1000);
}

// Pause main game timer
function pauseMainTimer() {
    if (intervaloTimer) {
        clearInterval(intervaloTimer);
        intervaloTimer = null;
    }
}

// Resume main game timer
function resumeMainTimer() {
    // Don't restart if time is already at 0
    if (tiempoRestante <= 0) {
        tiempoAgotado();
        return;
    }

    // Restart timer from current tiempoRestante
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

        // Show clue button at 30 seconds
        if (tiempoRestante === 30 && !clueUsed) {
            document.getElementById("clue-btn").classList.remove("hidden");
        }

        // Si se acaba el tiempo
        if (tiempoRestante <= 0) {
            clearInterval(intervaloTimer);
            intervaloTimer = null;
            tiempoAgotado();
        }
    }, 1000);
}
