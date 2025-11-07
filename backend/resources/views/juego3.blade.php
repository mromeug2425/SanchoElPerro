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

		<main class="flex-1 flex items-center justify-center">
			<div class="animate-fade-in-scale">
				<!-- Contenido del Juego 3 -->
			</div>
		</main>

		<!-- Botones en la parte inferior -->
		<div class="w-full max-w-full p-4">
			<div class="grid grid-cols-2 gap-4">
				<x-boton color="blue" text="Texto del botón" height="large" />
				<x-boton text="Guardar" height="large" />
				<x-boton color="green" text="Aceptar" height="large" />
				<x-boton color="red" text="Eliminar" height="large" />
			</div>
		</div>
	</div>
@endsection
