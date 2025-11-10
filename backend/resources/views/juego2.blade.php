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
		<!-- Diálogo 1: Pregunta (más grande) -->
			<div class="flex-[3]">
				<x-dialogo 
					bg_color="#6B7FBF" 
					border_color="rgb(107, 127, 191)"
					text="¿dani tiene el culo grande?"
				text_size="text-2xl"
			text_color="white" 
				/>
			</div>
			<!-- Diálogo 2: Timer (cuadrado pequeño) -->
			<div class="w-32 h-32 flex items-center justify-center">
				<x-dialogo 
					bg_color="#D4A574" 
					border_color="rgb(212, 165, 116)" 
					text="00:30"
				text_size="text-2xl"
				text_color="white" 
				/>
		</div>
	</div>
		<!-- Sección Central: Botones de Respuesta (más abajo) -->
		<div class="w-full max-w-3xl grid grid-cols-2 gap-3 mb-8 mt-1">
			<!-- Botón Respuesta 1 -->
			<x-boton 
				color="#6B7FBF" 
				border_color="rgb(107, 127, 191)" 
				text="SÍ" 
				height="large" 
				size="lg" 
			/>

			<!-- Botón Respuesta 2 -->
			<x-boton 
				color="#6B7FBF" 
				border_color="rgb(107, 127, 191)" 
				text="SÍ" 
				height="large" 
				size="lg" 
			/>

			<!-- Botón Respuesta 3 -->
			<x-boton 
				color="#6B7FBF" 
				border_color="rgb(107, 127, 191)" 
				text="SÍ" 
				height="large" 
				size="lg" 
			/>

			<!-- Botón Respuesta 4 -->
			<x-boton 
				color="#6B7FBF" 
				border_color="rgb(107, 127, 191)" 
				text="SÍ" 
				height="large" 
				size="lg" 
			/>
		</div>
	</main>		<!-- Personajes en la acera/carretera (parte inferior central) -->
		<div class="absolute left-1 flex items-end gap-2 pointer-events-none z-30" style="bottom: 230px;">
			<!-- Camello (izquierda) -->
			<div>
				<img src="{{ asset('img/personajes/camello/camel.png') }}" 
						alt="Camello" 
						class="w-16 h-auto">
			</div>

			<!-- Player corriendo (derecha del camello) -->
			<div style="margin-bottom: 35px;">
				<img src="{{ asset('img/personajes/player/player_corre.png') }}" 
						alt="Player" 
						class="w-16 h-auto">
			</div>
		</div>
	</div>
@endsection
