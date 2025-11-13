@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Tienda')

@php
	$backgroundImage = asset('img/backgrounds/tienda.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-8 relative">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<x-boton color="gray" text="Atrás" size="md" height="small" href="{{ route('home') }}" />
		</div>
		
		<!-- Visor de Monedas -->
		<div class="absolute top-4 right-4 z-20">
			<div class="bg-[#FFD700] border-4 border-[#8B4513] rounded-xl shadow-2xl px-6 py-3 flex items-center gap-3">
				<span class="text-3xl">💰</span>
				<div>
					<p class="text-xs font-jersey text-[#8B4513] uppercase tracking-wide">Monedas</p>
					<p class="text-2xl font-bold font-jersey text-[#8B4513]">{{ $monedas }}</p>
				</div>
			</div>
		</div>
	
	<main class="flex-1 flex items-center justify-end pr-16">
		<!-- Botones de mejoras -->
		<div class="flex flex-col gap-6 items-center">
			@forelse($mejoras as $mejora)
				<div class="flex items-center gap-4">
					<x-boton 
						color="#8B4513" 
						border_color="black"
						text="{{ $mejora->nombre }}" 
						size="lg" 
						type="button"
						onclick="comprarMejora({{ $mejora->id }})"
					/>
					<x-dialogo 
						bg_color="#F5DEB3" 
						border_color="#8B4513" 
						text="{{ $mejora->precio_nv1 }}"
						class="!text-xs !p-2"
					/>
				</div>
			@empty
				<p class="text-white text-center">No hay mejoras disponibles</p>
			@endforelse
		</div>
	</main>
	
	<!-- Imagen del toro abajo a la izquierda -->
	<div class="absolute bottom-0 -left-64 z-10 h-[32rem] overflow-hidden">
			<img src="{{ asset('img/personajes/toro/toro.png') }}" alt="Toro" class="h-[64rem] w-auto relative bottom-0">
		</div>

		<!-- Diálogo centrado en la parte inferior de la pantalla, encima del toro -->
		<div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
			<x-dialogo bg_color="#D9D9D9" border_color="#000000" text="¡Bienvenido a mi tienda! Aquí puedes comprar mejoras para tu aventura." />
		</div>
	</div>

	<!-- Script para cargar mejoras dinámicamente -->
	<script src="{{ asset('js/tienda.js') }}"></script>
@endsection

