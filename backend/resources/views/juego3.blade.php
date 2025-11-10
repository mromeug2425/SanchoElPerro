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
			<div id="dialogo-pregunta">
				<x-dialogo 
					bg_color="white" 
					border_color="brown" 
					text="" 
				/>
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

	<script src="{{ asset('js/preguntas.js') }}"></script>
@endsection

