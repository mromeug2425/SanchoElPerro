@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 4')

@php
	$backgroundImage = asset('img/backgrounds/joc4.png');
	$maxLife = 100;
	$currentLife = 20; // Change this value to see the bar change
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-4">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('home') }}" 
			class="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105">
				Atrás
			</a>
		</div>

		<main class="flex-1 flex items-start justify-center pt-20">
			<div class="animate-fade-in-scale w-full">
				<!-- Contenido del Juego 4 -->
				<div class="text-center w-full justify-between flex items-center">
					<div class="text-center flex gap-4">
						<div id="numbers-container" class="text-center flex flex-col gap-4">
							<!-- Numbers will be dynamically generated here -->
						</div>
						<div id="operations-container" class="text-center flex flex-col gap-4">
							<!-- Operations will be dynamically generated here -->
						</div>
					</div>
					<div class="text-center flex gap-4">
						<div class="text-center flex flex-col gap-4">
							<div id="player-expression">
								<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="Click numbers & operations" />
							</div>
							<button id="submit-btn" onclick="checkSolution()" class="bg-[#3C3B4F] hover:bg-[#2C2B3F] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all">
								Submit
							</button>
							<button id="clear-btn" onclick="clearSelection()" class="bg-[#D97706] hover:bg-[#B45309] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all">
								Clear
							</button>
							<button id="new-game-btn" onclick="startNewGame()" class="bg-[#347E2B] hover:bg-[#2C6B23] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all">
								New Game
							</button>
						</div>
						<div class="text-center flex flex-col gap-4">
							<div id="target-display">
								<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="0" />
							</div>
							<div id="result-display">
								<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="Result: ?" />
							</div>
						</div>
						<div class="text-center flex flex-col gap-4">
							<div class="flex flex-col items-center">
								<div class="relative w-12 h-64 bg-gray-800 rounded-full border-4 border-black shadow-lg overflow-hidden">
									<div class="absolute inset-0 bg-red-900/30"></div>
									
									<div id="life-bar" class="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out"
										 style="height: {{ ($currentLife / $maxLife) * 100 }}%;">
										<div class="w-full h-full bg-red-600"></div>
									</div>
									
									<div class="absolute inset-0 flex items-center justify-center z-10">
										<span id="life-text" class="font-jersey text-white text-lg font-bold drop-shadow-lg">
											{{ $currentLife }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>

	<!-- Include the game script -->
	<script src="{{ asset('js/juego4.js') }}"></script>
	<script>
		let game;
		let challenge;
		let playerNumbers = [];
		let playerOperations = [];
		let maxLife = {{ $maxLife }};
		let currentLife = {{ $currentLife }};

		// Initialize game on page load
		document.addEventListener('DOMContentLoaded', function() {
			game = new MathChallengeGame();
			startNewGame();
		});

		function startNewGame() {
			challenge = game.generateChallenge();
			playerNumbers = [];
			playerOperations = [];
			
			// Update target display
			document.getElementById('target-display').querySelector('p').textContent = 'Target: ' + challenge.target;
			document.getElementById('result-display').querySelector('p').textContent = 'Result: ?';
			document.getElementById('player-expression').querySelector('p').textContent = 'Click numbers & operations';
			
			// Render numbers
			renderNumbers(challenge.numbers);
			
			// Render operations
			renderOperations(challenge.operations);
			
			console.log('New challenge:', challenge);
			console.log('Solution:', challenge.solution.expression);
		}

		function renderNumbers(numbers) {
			const container = document.getElementById('numbers-container');
			container.innerHTML = '';
			
			numbers.forEach((num, index) => {
				const btn = document.createElement('button');
				btn.className = 'bg-[#347E2B] hover:bg-[#2C6B23] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all min-h-[60px] min-w-[80px] text-xl';
				btn.textContent = num;
				btn.onclick = () => addNumber(num, index);
				btn.id = 'num-' + index;
				container.appendChild(btn);
			});
		}

		function renderOperations(operations) {
			const container = document.getElementById('operations-container');
			container.innerHTML = '';
			
			operations.forEach((op, index) => {
				const btn = document.createElement('button');
				btn.className = 'bg-[#0C3826] hover:bg-[#0A2E1F] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all min-h-[60px] min-w-[80px] text-xl';
				btn.textContent = op;
				btn.onclick = () => addOperation(op, index);
				btn.id = 'op-' + index;
				container.appendChild(btn);
			});
		}

		function addNumber(num, index) {
			const btn = document.getElementById('num-' + index);
			if (btn.disabled) return;
			
			playerNumbers.push(num);
			btn.disabled = true;
			btn.classList.add('opacity-50', 'cursor-not-allowed');
			updateExpression();
		}

		function addOperation(op, index) {
			const btn = document.getElementById('op-' + index);
			if (btn.disabled) return;
			
			playerOperations.push(op);
			btn.disabled = true;
			btn.classList.add('opacity-50', 'cursor-not-allowed');
			updateExpression();
		}

		function updateExpression() {
			let expr = '';
			for (let i = 0; i < playerNumbers.length; i++) {
				expr += playerNumbers[i];
				if (i < playerOperations.length) {
					expr += ' ' + playerOperations[i] + ' ';
				}
			}
			document.getElementById('player-expression').querySelector('p').textContent = expr || 'Click numbers & operations';
		}

		function clearSelection() {
			// Reset player selections
			playerNumbers = [];
			playerOperations = [];
			
			// Re-enable all number buttons
			challenge.numbers.forEach((num, index) => {
				const btn = document.getElementById('num-' + index);
				if (btn) {
					btn.disabled = false;
					btn.classList.remove('opacity-50', 'cursor-not-allowed');
				}
			});
			
			// Re-enable all operation buttons
			challenge.operations.forEach((op, index) => {
				const btn = document.getElementById('op-' + index);
				if (btn) {
					btn.disabled = false;
					btn.classList.remove('opacity-50', 'cursor-not-allowed');
				}
			});
			
			// Reset expression display
			updateExpression();
		}

		function checkSolution() {
			if (playerNumbers.length !== 4 || playerOperations.length !== 3) {
				alert('Please select all 4 numbers and 3 operations!');
				return;
			}

			const isCorrect = game.verifySolution(playerNumbers, playerOperations);
			const result = game.evaluateExpression(playerNumbers, playerOperations);
			
			document.getElementById('result-display').querySelector('p').textContent = 'Result: ' + result;
			
			if (isCorrect) {
				alert('🎉 Correct! You solved it!');
				currentLife = Math.min(maxLife, currentLife + 10);
				updateLifeBar();
				setTimeout(startNewGame, 1000);
			} else {
				alert('❌ Wrong! Try again. (Target: ' + challenge.target + ', You got: ' + result + ')');
				currentLife = Math.max(0, currentLife - 10);
				updateLifeBar();
				
				// Reset player selection
				playerNumbers = [];
				playerOperations = [];
				startNewGame();
			}
		}

		function updateLifeBar() {
			const percentage = (currentLife / maxLife) * 100;
			document.getElementById('life-bar').style.height = percentage + '%';
			document.getElementById('life-text').textContent = currentLife;
		}
	</script>
@endsection
