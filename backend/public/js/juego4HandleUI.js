let game;
let challenge;
let playerNumbers = [];
let playerOperations = [];
let tiempoLimite = 120;
let tiempoRestante = 120;
let intervaloTimer = null;
let clueUsed = false;
let challengesCompleted = 0;
let correctAnswers = 0;
let totalChallenges = 4;
let initialCoins = 0; // User's coins at game start
let challengeAttempts = []; // Track all challenge attempts

document.addEventListener("DOMContentLoaded", async function () {
    // Initialize session tracking
    if (window.ensureSesionJuego) {
        try {
            await window.ensureSesionJuego();
        } catch (e) {
            console.error("Failed to initialize session:", e);
        }
    }

    // Wait for session to be ready
    try {
        if (window.sesionJuegoReady) {
            await window.sesionJuegoReady;
        }
    } catch (e) {
        console.error("Session not ready:", e);
    }

    game = new MathChallengeGame();

    // Fetch user's current coins
    await fetchUserCoins();

    // Load game info (fixed: was 3, should be 4)
    await cargarInfoJuego(4);
});

async function cargarInfoJuego(idJuego = 4) {
    try {
        const baseUrl = window.BASE_URL || window.location.origin;
        const response = await fetch(`${baseUrl}/juego/info/${idJuego}`);
        if (!response.ok) {
            throw new Error("Error al cargar la información del juego");
        }
        const data = await response.json();
        tiempoLimite = data.tiempo || 120;
        totalChallenges = data.cantidad_preguntas || 4;
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
    }
}

async function fetchUserCoins() {
    try {
        // Get user coins from current authenticated user
        // Since we don't have a specific API endpoint, we'll fetch from window or set to 0
        // The backend will handle the actual coin deduction based on user's current coins
        const usuario = window.usuario || {};
        initialCoins = usuario.monedas || 0;
        console.log("Game 4: Initial coins:", initialCoins);

        // Note: If coins aren't available client-side, backend will use current user coins
        // This is just for displaying to user during game
    } catch (error) {
        console.error("Error fetching user coins:", error);
        initialCoins = 0;
    }
}

function iniciarTimer() {
    if (intervaloTimer) {
        return;
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

function actualizarDisplayTimer() {
    const timerElement = document.getElementById("tiempo-restante");
    if (timerElement) {
        timerElement.textContent = tiempoRestante;
    }
}

function tiempoAgotado() {
    const remainingChallenges = totalChallenges - challengesCompleted;

    console.log(
        "Game 4: Tiempo agotado. Desafíos restantes:",
        remainingChallenges
    );

    // Save incomplete challenges as failed (timeout)
    for (let i = 0; i < remainingChallenges; i++) {
        guardarJuego4EnBD(
            challenge,
            [],
            [],
            false,
            true, // wasTimeout
            game.correctNumbers || [],
            game.correctOperations || []
        );

        challengeAttempts.push({
            correct: false,
            timeout: true,
            target: challenge.target,
        });
    }

    // Finalize session and redirect
    setTimeout(() => finalizarYRedirigir(), 1000);
}

function startNewGame() {
    challenge = game.generateChallenge();
    playerNumbers = [];
    playerOperations = [];

    clueUsed = false;
    document.getElementById("clue-btn").classList.add("hidden");

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

    if (challengesCompleted === 0) {
        iniciarTimer();
    }

    console.log("New challenge started!");
}

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

function useClue() {
    if (clueUsed) return;

    clueUsed = true;

    clearSelection();

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

    const clueBtn = document.getElementById("clue-btn");
    clueBtn.disabled = true;
    clueBtn.classList.remove("animate-pulse");
    clueBtn.classList.add("opacity-50", "cursor-not-allowed");
    clueBtn.textContent = "Pista Usada";
}

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

    challenge.numbers.forEach((num, index) => {
        const btn = document.getElementById("num-" + index);
        if (btn && btn.dataset.isDecoy === "false") {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    challenge.operations.forEach((op, index) => {
        const btn = document.getElementById("op-" + index);
        if (btn && btn.dataset.isDecoy === "false") {
            btn.disabled = false;
            btn.classList.remove("opacity-50", "cursor-not-allowed");
        }
    });

    updateExpression();
}

function isValidExpression(numbers, operations) {
    if (numbers.length === 0) {
        return { valid: false, message: "Please select at least one number!" };
    }

    if (operations.length >= numbers.length) {
        return {
            valid: false,
            message: "Expression cannot end with an operation!",
        };
    }

    if (operations.length > 0 && numbers.length < 2) {
        return {
            valid: false,
            message: "Need at least 2 numbers for an operation!",
        };
    }

    if (operations.length !== numbers.length - 1) {
        return {
            valid: false,
            message:
                "Invalid expression! Must alternate numbers and operations.",
        };
    }

    return { valid: true };
}

function checkSolution() {
    const validation = isValidExpression(playerNumbers, playerOperations);
    if (!validation.valid) {
        alert(validation.message);
        return;
    }

    const isCorrect = game.verifySolution(playerNumbers, playerOperations);
    const result = game.evaluateExpression(playerNumbers, playerOperations);

    // Save to database
    guardarJuego4EnBD(
        challenge,
        playerNumbers,
        playerOperations,
        isCorrect,
        false, // not a timeout
        game.correctNumbers || [],
        game.correctOperations || []
    );

    // Track locally
    challengeAttempts.push({
        correct: isCorrect,
        playerNumbers: [...playerNumbers],
        playerOperations: [...playerOperations],
        target: challenge.target,
    });

    if (isCorrect) {
        challengesCompleted++;
        correctAnswers++;

        if (challengesCompleted >= totalChallenges) {
            if (intervaloTimer) {
                clearInterval(intervaloTimer);
                intervaloTimer = null;
            }

            // Game complete - finalize session
            finalizarYRedirigir();
        } else if (challengesCompleted === 2) {
            alert(
                `Correct! Challenge ${challengesCompleted}/${totalChallenges} completed!`
            );

            setTimeout(startMiniGameSequence, 1000);
        } else {
            alert(
                `Correct! Challenge ${challengesCompleted}/${totalChallenges} completed!`
            );
            setTimeout(startNewGame, 1000);
        }
    } else {
        alert(
            "Wrong! Try again. (Target: " +
                challenge.target +
                ", You got: " +
                result +
                ")"
        );

        playerNumbers = [];
        playerOperations = [];
        clearSelection();
    }
}

async function finalizarYRedirigir() {
    // Calculate results
    const totalChallenges = challengeAttempts.length;
    const correctCount = challengeAttempts.filter((a) => a.correct).length;
    const incorrectCount = totalChallenges - correctCount;
    const incorrectPercentage = incorrectCount / totalChallenges;

    // Calculate coin loss (percentage of incorrect answers)
    const coinsLost = Math.floor(initialCoins * incorrectPercentage);

    // Determine if won (>= 50% correct)
    const isWinner = correctCount >= totalChallenges / 2;

    console.log("Game 4 Summary:", {
        total: totalChallenges,
        correct: correctCount,
        incorrect: incorrectCount,
        incorrectPercentage: (incorrectPercentage * 100).toFixed(1) + "%",
        initialCoins: initialCoins,
        coinsLost: coinsLost,
        isWinner: isWinner,
    });

    // Show result popup
    showResultPopup(correctCount, totalChallenges, coinsLost, isWinner);

    // Finalize session
    try {
        await finalizarSesionJuego(
            0, // monedas_ganadas (always 0 for Game 4)
            coinsLost, // monedas_perdidas
            isWinner // ganado
        );

        console.log("Game 4: Session finalized successfully");
    } catch (error) {
        console.error("Game 4: Error finalizing session:", error);
    }
}

/**
 * Show final result popup with game stats
 */
function showResultPopup(correct, total, coinsLost, isWinner) {
    const percentage = Math.round((correct / total) * 100);

    let title, message;

    if (isWinner) {
        title = "¡FELICIDADES!";
        message =
            `¡Has ganado!\n\n` +
            `Aciertos: ${correct}/${total} (${percentage}%)\n` +
            `Monedas perdidas: ${coinsLost}\n` +
            `¡Has ganado 1 ticket!`;

        // Show win animation
        showWinAnimation();
        setTimeout(() => hideWinAnimation(), 2000);
    } else {
        title = "GAME OVER";
        message =
            `No has alcanzado el mínimo.\n\n` +
            `Aciertos: ${correct}/${total} (${percentage}%)\n` +
            `Monedas perdidas: ${coinsLost}\n` +
            `Necesitas al menos ${Math.ceil(total / 2)} aciertos.`;
    }

    // Show alert
    alert(title + "\n\n" + message);

    // Redirect to home
    setTimeout(() => {
        window.location.href = "/";
    }, 500);
}
