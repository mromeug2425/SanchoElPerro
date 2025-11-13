@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 1')

@php
    $backgroundImage = asset('img/backgrounds/joc1.png'); 
@endphp

@section('content')
<div class="w-full h-full relative" style="background: url('{{ $backgroundImage }}') no-repeat center/cover; background-size: cover;">

    <!-- Botón Atrás -->
    <div class="absolute top-4 left-4 z-20">
        <a href="{{ route('home') }}" 
           class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition transform hover:scale-105">
            Atrás
        </a>
    </div>

    <main class="w-full h-full relative">
        <!-- Pizarra izquierda (problema) -->
        <div class="absolute top-[27%] left-[27%] transform -translate-x-1/2 -translate-y-1/2 
             w-[262px] h-[190px] flex flex-col items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black">
            <p class="text-3xl font-extrabold tracking-wider text-gray-800">3 + 4</p>
            <p class="text-3xl font-extrabold tracking-wider mt-2 text-gray-800">5 + ?</p>
        </div>

        <!-- Indicaciones -->
        <div class="absolute top-[27%] right-[11%] transform -translate-y-1/2 
             w-[258px] h-[190px] flex items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black">
            <h2 class="text-3xl font-extrabold text-gray-800">¡Equilíbralo!</h2>
        </div>

        <!-- Botones de opciones -->
        <div class="absolute left-[18%] top-[65%] w-[160px] z-10">
            <button onclick="comprobar(1)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">1</button>
        </div>

        <div class="absolute right-[18%] top-[65%] w-[160px] z-10">
            <button onclick="comprobar(2)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">2</button>
        </div>

        <div class="absolute left-[18%] top-[80%] w-[160px] z-10">
            <button onclick="comprobar(3)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">3</button>
        </div>

        <div class="absolute right-[18%] top-[80%] w-[160px] z-10">
            <button onclick="comprobar(4)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">4</button>
        </div>

        <!-- Mensaje de feedback -->
        <div class="absolute top-[50%] left-1/2 transform -translate-x-1/2 w-full text-center z-20">
            <span id="mensaje" class="text-3xl font-extrabold text-white bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-xl"></span>
        </div>

    </main>
</div>

<!-- JS del juego 1 dinámico corregido -->
<script>
class SimpleMathGame {
    constructor() {
        this.operations = ['+','-'];
        this.target = 0;
        this.solution = 0;
    }

    generateProblem() {
        const num1 = Math.floor(Math.random() * 10) + 1;
        const num2 = Math.floor(Math.random() * 10) + 1;
        const num3 = Math.floor(Math.random() * 10) + 1;

        const opLeft = this.operations[Math.floor(Math.random() * this.operations.length)];

        let leftResult = opLeft === '+' ? num1 + num2 : num1 - num2;
        const missing = leftResult - num3;

        this.target = leftResult;
        this.solution = missing;

        return {
            left: [num1, num2],
            right: [num3, '?'],
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

    // Actualizar pizarra izquierda
    const leftP = document.querySelector('div > p:first-child');
    const rightP = document.querySelector('div > p:nth-child(2)');
    leftP.textContent = `${currentProblem.left[0]} + ${currentProblem.left[1]}`;
    rightP.textContent = `${currentProblem.right[0]} + ?`;

    // Limpiar mensaje
    const msg = document.getElementById('mensaje');
    msg.textContent = '';
    msg.classList.remove('text-green-500', 'text-red-500');

    // Generar opciones para los botones
    const options = generateOptions(currentProblem.solution);
    const buttons = document.querySelectorAll('button[onclick^="comprobar"]');
    buttons.forEach((btn, i) => {
        btn.textContent = options[i];
        btn.dataset.value = options[i]; // valor real del botón
    });
}

// Crear 3 números aleatorios + la solución y mezclarlos
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
</script>
@endsection
