@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 2')

@php
	$backgroundImage = asset('img/backgrounds/joc2.png');
@endphp

@push('styles')
<link rel="stylesheet" href="{{ asset('css/juegos.css') }}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet">
<style>
	.font-jersey {
		font-family: 'Jersey 10', sans-serif;
	}
	
	@keyframes camelMovingAnimation {
		0% {
			transform: translateX(-100vw);
			opacity: 1;
		}
		100% {
			transform: translateX(100vw);
			opacity: 1;
		}
	}
</style>
@endpush

@section('content')
	<div class="w-full h-full flex flex-col p-4 relative font-jersey">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('niveles') }}" 
				class="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105">
				Atrás
			</a>
		</div>

		<!-- Contenido Principal -->
		<main class="flex-1 flex flex-col items-center justify-start pt-8 px-8">
			<!-- Sección Superior: Diálogos -->
			<div class="w-full max-w-4xl flex gap-4 mb-12">
				<!-- Diálogo 1: Pregunta -->
				<div class="flex-[3]" id="dialogo-pregunta">
					<div class="bg-[#6B7FBF]/80 border-2 border-[rgb(107, 127, 191)] text-white p-4 rounded-xl shadow-md w-full h-full">
						<div class="flex items-start">
							<p class="text-2xl font-medium font-jersey" id="texto-pregunta">
								Pregunta 1/25 - Cargando...
							</p>
						</div>
					</div>
				</div>
				<!-- Diálogo 2: Timer -->
				<div class="w-32 h-32 flex items-center justify-center" id="timer">
					<div class="bg-[#D4A574]/80 border-2 border-[rgb(212, 165, 116)] text-white p-4 rounded-xl shadow-md w-full h-full flex flex-col items-center justify-center">
						<div class="text-sm font-jersey text-gray-600">TIEMPO</div>
						<div id="tiempo-restante" class="text-4xl font-bold font-jersey">5</div>
					</div>
				</div>
			</div>
		
		<div class="w-full max-w-3xl grid grid-cols-2 gap-3 mb-8 mt-1">
			<!-- Botón Respuesta 1 -->
			<button 
				id="opcion1"
				class="bg-[#6B7FBF] border-2 border-[rgb(107, 127, 191)] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-6 py-6 text-lg transition-all duration-200" 
				onclick="verificarRespuesta(1)"
			>
				Opción 1
			</button>

			<!-- Botón Respuesta 2 -->
			<button 
				id="opcion2"
				class="bg-[#6B7FBF] border-2 border-[rgb(107, 127, 191)] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-6 py-6 text-lg transition-all duration-200" 
				onclick="verificarRespuesta(2)"
			>
				Opción 2
			</button>

			<!-- Botón Respuesta 3 -->
			<button 
				id="opcion3"
				class="bg-[#6B7FBF] border-2 border-[rgb(107, 127, 191)] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-6 py-6 text-lg transition-all duration-200" 
				onclick="verificarRespuesta(3)"
			>
				Opción 3
			</button>

			<!-- Botón Respuesta 4 -->
			<button 
				id="opcion4"
				class="bg-[#6B7FBF] border-2 border-[rgb(107, 127, 191)] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-6 py-6 text-lg transition-all duration-200" 
				onclick="verificarRespuesta(4)"
			>
				Opción 4
			</button>
		</div>
	</main>

		<!-- Personajes -->
		<div class="absolute flex items-end gap-2 pointer-events-none z-30" style="bottom: 230px; left: 0; width: 100%;">
			<!-- Contenedor del Camello -->
			<div id="contenedor-camello" class="absolute flex items-end" style="transform: translateX(0px);">
				<img src="{{ asset('img/personajes/camello/camel.png') }}" 
						alt="Camello" 
						class="w-16 h-auto">
			</div>

			<!-- Contenedor del Jugador -->
			<div id="contenedor-player" class="absolute flex items-end" style="transform: translateX(0px); margin-bottom: 35px;">
				<img src="{{ asset('img/personajes/player/player_corre.png') }}" 
						alt="Player" 
						class="w-16 h-auto">
			</div>
		</div>

		<!-- Popup personalizado -->
		<div id="popup-resultado" class="fixed inset-0 flex items-center justify-center z-50 hidden">
			<div class="absolute inset-0 bg-black opacity-50"></div>
			<div class="relative bg-white border-4 rounded-xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95" id="popup-contenido">
				<h2 id="popup-titulo" class="text-3xl font-bold mb-4 text-center font-jersey"></h2>
				<p id="popup-mensaje" class="text-lg text-center mb-6 font-jersey"></p>
				<button onclick="cerrarPopup()" class="w-full bg-[#6B7FBF] hover:brightness-75 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-95 font-jersey">
					Continuar
				</button>
			</div>
		</div>
	</div>

	<script src="{{ asset('js/juego2.js') }}"></script>
	<script>
		// Inicializar el juego 2 al cargar la página
		document.addEventListener('DOMContentLoaded', function() {
			cargarPreguntas(2); // Cargar preguntas del juego 2
		});
	</script>
@endsection
