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

    const msg = document.getElementById('mensaje');
    msg.textContent = '';
    msg.classList.remove('text-green-500', 'text-red-500');

    const options = generateOptions(currentProblem.solution);
    const buttons = document.querySelectorAll('button[data-option]');

    buttons.forEach((btn, i) => {
        btn.textContent = options[i];
        btn.dataset.value = options[i];
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

function comprobar(btn) {
    const selected = parseInt(btn.dataset.value);
    const msg = document.getElementById('mensaje');

    if (game.verifySolution(selected)) {
        msg.textContent = '¡Correcto! ⚖️';
        msg.classList.remove('text-red-500');
        msg.classList.add('text-green-500');
        setTimeout(startNewGame, 1000);
    } else {
        msg.textContent = '¡Incorrecto! ❌ Intenta otra vez';
        msg.classList.remove('text-green-500');
        msg.classList.add('text-red-500');
    }
}
