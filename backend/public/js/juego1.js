function startNewGame() {
    currentProblem = game.generateProblem();

    // Actualizar pizarra izquierda
    const leftP = document.querySelector('div > p:first-child');
    const rightP = document.querySelector('div > p:nth-child(2)');
    leftP.textContent = `${currentProblem.numbers[0]} + ${currentProblem.numbers[1]}`;
    rightP.textContent = `${currentProblem.numbers[2]} + ?`;

    // Limpiar mensaje
    const msg = document.getElementById('mensaje');
    msg.textContent = '';
    msg.classList.remove('text-green-500', 'text-red-500');

    // Generar opciones para los botones
    const options = generateOptions(currentProblem.solution);
    const buttons = document.querySelectorAll('button[onclick^="comprobar"]');
    buttons.forEach((btn, i) => {
        btn.textContent = options[i];
        btn.dataset.value = options[i]; // guardamos valor real
    });
}

// Función para crear 3 números aleatorios + la solución y mezclarlos
function generateOptions(correct) {
    let opts = [correct];
    while (opts.length < 4) {
        let n = Math.floor(Math.random() * 10) + 1;
        if (!opts.includes(n)) opts.push(n);
    }
    return opts.sort(() => Math.random() - 0.5);
}

// Comprobar respuesta
function comprobar(opcion) {
    const btn = document.querySelector(`button[onclick="comprobar(${opcion})"]`);
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
