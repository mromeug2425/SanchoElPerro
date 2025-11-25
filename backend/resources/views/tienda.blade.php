@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Tienda')

@php
	$backgroundImage = asset('img/backgrounds/tienda.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-8 relative">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('home') }}" 
				class="bg-gray-700 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-lg shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105 border-2 border-black">
				Atrás
			</a>
		</div>

	<!-- Visor de monedas -->
	<div class="absolute top-4 right-4 z-20">
		<div class="bg-yellow-400 border-4 border-yellow-600 rounded-lg px-6 py-3 shadow-lg">
			<div class="flex items-center gap-2">
				<span class="text-2xl">💰</span>
				<span class="text-xl font-bold text-gray-800">{{ $monedas }}</span>
			</div>
		</div>
	</div>
	
	<main class="flex-1 flex items-center justify-end pr-16">
		<!-- Caja contenedora con estilo de diálogo -->
		<div class="bg-[#529725]/70 border-4 border-[##4aa36a] rounded-xl shadow-2xl p-8 w-96">
			<div class="flex flex-col gap-6 items-center">
				@forelse($mejoras as $mejora)
					<!-- Mejora {{ $mejora->id }} -->
					<form class="mejora-form w-full" data-mejora-id="{{ $mejora->id }}" data-precio="{{ $mejora->precio_actual }}">
						@csrf
						<button type="submit" 
							class="bg-[#428121] hover:brightness-75 hover:scale-95 text-white font-bold py-3 px-5 rounded-lg shadow-lg uppercase tracking-wider text-lg transition-all duration-200 w-full whitespace-normal break-words border-2 border-black">
							{{ $mejora->nombre }} - {{ $mejora->es_nivel_maximo ? 'MAX. LVL' : $mejora->precio_actual . ' monedas (Nivel ' . ($mejora->nivel_actual + 1) . ')' }}
						</button>
					</form>
				@empty
					<p class="text-white text-center">No hay mejoras disponibles</p>
				@endforelse
			</div>
		</div>
	</main>
	
	<!-- Imagen del toro abajo a la izquierda -->
	<div class="absolute bottom-0 -left-64 z-10 h-[32rem] overflow-hidden">
			<img src="{{ asset('img/personajes/toro/toro.png') }}" alt="Toro" class="h-[64rem] w-auto relative bottom-0">
		</div>

		<!-- Diálogo centrado en la parte inferior de la pantalla, encima del toro -->
		<div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
			<x-dialogo bg_color="#D9D9D9" border_color="#000000" text="¡Bienvenido {{ $nombreUsuario }}!, !haz mas grande y libre tu homepage comprando mejoras en esta tienda local de barrio!" />
		</div>
	</main>	
	<script>
    window.comprarMejoraUrl = "{{ route('mejoras.comprar') }}";
	</script>
<script src="{{ asset('js/tienda.js') }}"></script>
@endsection

