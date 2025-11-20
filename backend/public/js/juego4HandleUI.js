// Game state variables
let game;
let challenge;
let playerNumbers = [];
let playerOperations = [];
let tiempoLimite = 60;
let tiempoRestante = 60;
let intervaloTimer = null;
let clueUsed = false;
let challengesCompleted = 0;
let correctAnswers = 0;
let totalChallenges = 5;

// Initialize game on DOM load
document.addEventListener("DOMContentLoaded", function () {
    game = new MathChallengeGame();
    cargarInfoJuego(3);
});

// Load game information from backend
async function cargarInfoJuego(idJuego = 3) {
    try {
        const baseUrl = window.BASE_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/juego/info/${idJuego}`);
        if (!response.ok) {
            throw new Error("Error al cargar la información del juego");
        }
        const data = await response.json();
        tiempoLimite = data.tiempo || 60;
        totalChallenges = data.cantidad_preguntas || 5;
        tiempoRestante = tiempoLimite;
        challengesCompleted = 0;
        correctAnswers = 0;
        console.log(
            "Game info loaded - Time:",
            tiempoLimite,
            "Challenges:",
            totalChallenges
        );
        startNewGame();
    } catch (error) {
        console.error("Error:", error);
        startNewGame();
    }
}

// Timer functions
function iniciarTimer() {
    // Only start timer if not already running
    if (intervaloTimer) {
        return; // Timer already running, don't restart
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

function actualizarDisplayTimer() {
    const timerElement = document.getElementById("tiempo-restante");
    if (timerElement) {
        timerElement.textContent = tiempoRestante;
    }
}

function tiempoAgotado() {
    // Time's up - all remaining challenges are failed
    const remainingChallenges = totalChallenges - challengesCompleted;

    alert(
        `⏰ ¡TIEMPO AGOTADO!\n\n🎮 Game Over!\nCompleted: ${challengesCompleted}/${totalChallenges}\nCorrect: ${correctAnswers}\nFailed: ${remainingChallenges} (timeout)\n\nFinal Score: ${correctAnswers}/${totalChallenges}`
    );

    // Reset game
    challengesCompleted = 0;
    correctAnswers = 0;
    intervaloTimer = null;
    setTimeout(startNewGame, 2000);
}

// Game flow functions
function startNewGame() {
    challenge = game.generateChallenge();
    playerNumbers = [];
    playerOperations = [];

    // Hide clue button for new challenge
    clueUsed = false;
    document.getElementById("clue-btn").classList.add("hidden");

    // Update progress display
    document
        .getElementById("target-display")
        .querySelector("p").textContent = `Challenge ${
        challengesCompleted + 1
    }/${totalChallenges} - Target: ${challenge.target}`;
    document
        .getElementById("player-expression")
        .querySelector("p").textContent = "Click numbers & operations";

    renderNumbers(challenge.numbers, challenge.decoyIndices.numbers);

    renderOperations(challenge.operations, challenge.decoyIndices.operations);

    // Only start timer on first challenge
    if (challengesCompleted === 0) {
        iniciarTimer();
    }

    console.log("New challenge started!");
}

// Rendering functions
function renderNumbers(numbers, decoyIndices) {
    const container = document.getElementById("numbers-container");
    container.innerHTML = "";

    numbers.forEach((num, index) => {
        const btn = document.createElement("button");
        btn.className =
            "bg-[#347E2B] hover:bg-[#2C6B23] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all min-h-[60px] min-w-[80px] text-xl";
        btn.textContent = num;
        btn.onclick = () => addNumber(num, index);
        btn.id = "num-" + index;
        btn.dataset.isDecoy = decoyIndices.includes(index) ? "true" : "false";
        container.appendChild(btn);
    });
}

function renderOperations(operations, decoyIndices) {
    const container = document.getElementById("operations-container");
    container.innerHTML = "";

    operations.forEach((op, index) => {
        const btn = document.createElement("button");
        btn.className =
            "bg-[#0C3826] hover:bg-[#0A2E1F] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all min-h-[60px] min-w-[80px] text-xl";
        btn.textContent = op;
        btn.onclick = () => addOperation(op, index);
        btn.id = "op-" + index;
        btn.dataset.isDecoy = decoyIndices.includes(index) ? "true" : "false";
        container.appendChild(btn);
    });
}

// Clue system
function useClue() {
    if (clueUsed) return;

    clueUsed = true;

    // Clear current selection
    clearSelection();

    // Block decoy numbers
    challenge.decoyIndices.numbers.forEach((index) => {
        const btn = document.getElementById("num-" + index);
        if (btn) {
            btn.disabled = true;
            btn.classList.add("opacity-30", "cursor-not-allowed");
            btn.classList.remove("hover:bg-[#2C6B23]");
            btn.style.border = "3px solid #ef4444";
            btn.style.textDecoration = "line-through";
        }
    });

    // Block decoy operations
    challenge.decoyIndices.operations.forEach((index) => {
        const btn = document.getElementById("op-" + index);
        if (btn) {
            btn.disabled = true;
            btn.classList.add("opacity-30", "cursor-not-allowed");
            btn.classList.remove("hover:bg-[#0A2E1F]");
            btn.style.border = "3px solid #ef4444";
            btn.style.textDecoration = "line-through";
        }
    });

    // Disable clue button
    const clueBtn = document.getElementById("clue-btn");
    clueBtn.disabled = true;
    clueBtn.classList.remove("animate-pulse");
    clueBtn.classList.add("opacity-50", "cursor-not-allowed");
    clueBtn.textContent = "Pista Usada";
}

// Player interaction functions
function addNumber(num, index) {
    const btn = document.getElementById("num-" + index);
    if (btn.disabled) return;

    playerNumbers.push(num);
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
    updateExpression();
}

function addOperation(op, index) {
    const btn = document.getElementById("op-" + index);
    if (btn.disabled) return;

    playerOperations.push(op);
    btn.disabled = true;
    btn.classList.add("opacity-50", "cursor-not-allowed");
    updateExpression();
}

function updateExpression() {
    let expr = "";
    for (let i = 0; i < playerNumbers.length; i++) {
        expr += playerNumbers[i];
        if (i < playerOperations.length) {
            expr += " " + playerOperations[i] + " ";
        }
    }
    document
        .getElementById("player-expression")
        .querySelector("p").textContent = expr || "Click numbers & operations";
}

function clearSelection() {
    playerNumbers = [];
    playerOperations = [];

    // Re-enable all non-decoy number buttons
    challenge.numbers.forEach((num, index) => {
        const btn = document.getElementById("num-" + index);
        if (btn && btn.dataset.isDecoy === "false") {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    // Re-enable all non-decoy operation buttons
    challenge.operations.forEach((op, index) => {
        const btn = document.getElementById("op-" + index);
        if (btn && btn.dataset.isDecoy === "false") {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    updateExpression();
}

// Validation function
function isValidExpression(numbers, operations) {
    // Need at least one number
    if (numbers.length === 0) {
        return { valid: false, message: "Please select at least one number!" };
    }

    // Operations must always be one less than numbers (can't end with operation)
    if (operations.length >= numbers.length) {
        return {
            valid: false,
            message: "Expression cannot end with an operation!",
        };
    }

    // If we have operations, we need at least 2 numbers
    if (operations.length > 0 && numbers.length < 2) {
        return {
            valid: false,
            message: "Need at least 2 numbers for an operation!",
        };
    }

    // Valid expression pattern: num (op num)*
    // This means: operations.length should equal numbers.length - 1
    if (operations.length !== numbers.length - 1) {
        return {
            valid: false,
            message:
                "Invalid expression! Must alternate numbers and operations.",
        };
    }

    return { valid: true };
}

// Solution checking
function checkSolution() {
    // Validate expression syntax
    const validation = isValidExpression(playerNumbers, playerOperations);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    const isCorrect = game.verifySolution(playerNumbers, playerOperations);
    const result = game.evaluateExpression(playerNumbers, playerOperations);

    if (isCorrect) {
        challengesCompleted++;
        correctAnswers++;

        // Check if player has completed all challenges
        if (challengesCompleted >= totalChallenges) {
            // Stop timer when game is won
            if (intervaloTimer) {
                clearInterval(intervaloTimer);
                intervaloTimer = null;
            }

            alert(
                `🎉🏆 ¡FELICIDADES!\n\nYou completed all challenges!\nFinal Score: ${correctAnswers}/${totalChallenges} correct answers!`
            );

            // Reset game
            challengesCompleted = 0;
            correctAnswers = 0;
            setTimeout(startNewGame, 2000);
        } else if (challengesCompleted === 2) {
            // Trigger mini-game after 2nd challenge
            alert(
                `🎉 Correct! Challenge ${challengesCompleted}/${totalChallenges} completed!`
            );

            // Start mini-game sequence
            setTimeout(startMiniGameSequence, 1000);
        } else {
            alert(
                `🎉 Correct! Challenge ${challengesCompleted}/${totalChallenges} completed!`
            );
            setTimeout(startNewGame, 1000);
        }
    } else {
        // Wrong answer - stay on same challenge, just clear selection
        alert(
            "❌ Wrong! Try again. (Target: " +
                challenge.target +
                ", You got: " +
                result +
                ")"
        );

        // Clear selection but DON'T start new game
        playerNumbers = [];
        playerOperations = [];
        clearSelection();

        // Timer keeps running, don't restart it
    }
}
