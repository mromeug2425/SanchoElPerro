@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 4')

@push('head')
	<meta name="csrf-token" content="{{ csrf_token() }}">
@endpush

@php
	$backgroundImage = asset('img/backgrounds/joc4.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-4" data-id-juego="4">
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('home') }}" 
			class="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105">
				Atrás
			</a>
		</div>

		<div class="absolute top-[60%] right-[35%] z-20">
			<img src="{{ asset('img/personajes/sancho/sancho.png') }}" alt="sancho" class="w-48 h-48 object-contain">
		</div>

		<div class="absolute bottom-[-1%] right-[55%] z-20">
			<img src="{{ asset('img/personajes/player/player_espaldas.png') }}" alt="player_espaldas" class="w-32 h-32 object-contain">
		</div>

		<main class="flex-1 flex items-start justify-center pt-20">
			<div class="animate-fade-in-scale w-full">
				<div class="text-center w-full justify-between flex items-start">

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
						</div>
						<div class="text-center flex flex-col gap-4">
							<div id="target-display">
								<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="0" />
							</div>
							<div id="timer" class="bg-white border-2 border-[#3C3B4F] rounded-xl shadow-md px-6 py-4 text-center">
								<div class="text-sm font-jersey text-gray-600">TIEMPO</div>
								<div id="tiempo-restante" class="text-4xl font-bold font-jersey text-[#3C3B4F]">60</div>
							</div>
							<button id="clue-btn" onclick="useClue()" class="hidden bg-[#FBB900] hover:bg-[#E5A800] border-2 border-black text-white font-jersey p-4 rounded-xl shadow-md transition-all animate-pulse">
								Pista
							</button>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>

	<div id="mini-game-overlay" class="hidden fixed inset-0 z-50 items-center justify-center bg-black bg-opacity-80">
		<div class="relative bg-gray-900 rounded-xl p-8 shadow-2xl">
			<div class="text-center mb-4">
				<h2 class="text-3xl font-jersey text-white mb-2">¡ATAQUE ESPECIAL DE SANCHO!</h2>
				<div class="flex justify-center gap-8 items-center">
					<div class="text-center">
						<div class="text-sm font-jersey text-gray-400">TIEMPO</div>
						<div id="minigame-timer" class="text-4xl font-bold font-jersey text-[#FBB900]">20</div>
					</div>
					<div class="text-center">
						<div class="text-sm font-jersey text-gray-400">SEGUNDOS</div>
						<div id="minigame-score" class="text-4xl font-bold font-jersey text-white">+0s</div>
					</div>
				</div>
			</div>
			
			<canvas id="minigame-canvas" class="border-4 border-[#3C3B4F] rounded-lg bg-gray-800"></canvas>
			
			<div class="mt-4 text-center">
				<p class="text-gray-400 font-jersey mt-2">Mueve el ratón para apuntar | Presiona ESPACIO para disparar</p>
			</div>
		</div>
	</div>

	<!-- Animated win -->
	<div id="win-character" class="hidden fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
		<img id="character-sprite" src="{{ asset('img/personajes/black/up.png') }}" alt="Character" class="w-64 h-64 object-contain animate-bounce">
	</div>

	<script>
		let characterAnimationInterval = null;
		
		function showWinAnimation() {
			const winContainer = document.getElementById('win-character');
			const sprite = document.getElementById('character-sprite');
			const images = [
				'{{ asset('img/personajes/black/up.png') }}',
				'{{ asset('img/personajes/black/down.png') }}'
			];
			let currentIndex = 0;
			
			winContainer.classList.remove('hidden');
			
			if (characterAnimationInterval) {
				clearInterval(characterAnimationInterval);
			}
			
			characterAnimationInterval = setInterval(function() {
				currentIndex = (currentIndex + 1) % 2;
				sprite.src = images[currentIndex];
			}, 300);
		}
		
		function hideWinAnimation() {
			const winContainer = document.getElementById('win-character');
			winContainer.classList.add('hidden');
			
			if (characterAnimationInterval) {
				clearInterval(characterAnimationInterval);
				characterAnimationInterval = null;
			}
		}
	</script>

	<!-- Load sesiones.js FIRST for session tracking -->
	<script src="{{ asset('js/sesiones.js') }}"></script>
	<script src="{{ asset('js/juego4.js') }}"></script>
	<script src="{{ asset('js/miniGameSancho.js') }}"></script>
	<script src="{{ asset('js/miniGameSanchoUI.js') }}"></script>
	<script src="{{ asset('js/juego4HandleUI.js') }}"></script>
@endsection
