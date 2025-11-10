@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 3')

@php
	$backgroundImage = asset('img/backgrounds/joc3.png');
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

		<!-- Marco de texto con el componente dialogo debajo del botón atrás -->
		<div class="absolute top-20 left-1/2 transform -translate-x-1/2 z-10 max-w-2xl w-full px-4">
			<div class="flex items-center gap-4">
				<div id="dialogo-pregunta" class="flex-1">
					<x-dialogo 
						bg_color="white" 
						border_color="brown" 
						text="" 
					/>
				</div>
				<div id="timer" class="bg-white border-2 border-brown rounded-xl shadow-md px-6 py-4 text-center">
					<div class="text-sm font-jersey text-gray-600">TIEMPO</div>
					<div id="tiempo-restante" class="text-4xl font-bold font-jersey text-[#966E31]">15</div>
				</div>
			</div>
		</div>

		<main class="flex-1 flex items-center justify-center">
			<div class="animate-fade-in-scale">
			</div>
		</main>

		<!-- Botones en la parte inferior -->
		<div class="w-full max-w-full p-4">
			<div class="grid grid-cols-2 gap-4">
				<button id="opcion1" class="bg-[#966E31] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-5 py-6 text-md transition-all duration-200" onclick="verificarRespuesta(1)">Opción 1</button>
				<button id="opcion2" class="bg-[#572009] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-5 py-6 text-md transition-all duration-200" onclick="verificarRespuesta(2)">Opción 2</button>
				<button id="opcion3" class="bg-[#814113] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-5 py-6 text-md transition-all duration-200" onclick="verificarRespuesta(3)">Opción 3</button>
				<button id="opcion4" class="bg-[#96601A] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-5 py-6 text-md transition-all duration-200" onclick="verificarRespuesta(4)">Opción 4</button>
			</div>
		</div>
	</div>

	<!-- Popup personalizado -->
	<div id="popup-resultado" class="fixed inset-0 flex items-center justify-center z-50 hidden">
		<div class="absolute inset-0 bg-black opacity-50"></div>
		<div class="relative bg-white border-4 rounded-xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95" id="popup-contenido">
			<h2 id="popup-titulo" class="text-3xl font-bold mb-4 text-center font-jersey"></h2>
			<p id="popup-mensaje" class="text-lg text-center mb-6 font-jersey"></p>
			<button onclick="cerrarPopup()" class="w-full bg-[#966E31] hover:brightness-75 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-95 font-jersey">
				Continuar
			</button>
		</div>
	</div>

	<script src="{{ asset('js/preguntas.js') }}"></script>
@endsection

