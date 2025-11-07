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
			<x-dialogo 
				bg_color="white" 
				border_color="brown" 
				text="Aquí va el texto del diálogo para el juego 3. Puedes personalizar este mensaje según las necesidades del juego." 
			/>
		</div>

		<main class="flex-1 flex items-center justify-center">
			<div class="animate-fade-in-scale">
				<!-- Contenido del Juego 3 -->
			</div>
		</main>

		<!-- Botones en la parte inferior -->
		<div class="w-full max-w-full p-4">
			<div class="grid grid-cols-2 gap-4">
				<x-boton color="#966E31" text="Texto del botón" height="large" />
				<x-boton color="#572009" text="#572009" height="large" />
				<x-boton color="#814113" text="Aceptar" height="large" />
				<x-boton color="#96601A" text="Eliminar" height="large" />
			</div>
		</div>
	</div>
@endsection
