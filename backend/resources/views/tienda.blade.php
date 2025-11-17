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
	
	<main class="flex-1 flex items-center justify-end pr-16">
		<!-- Caja contenedora con estilo de diálogo -->
		<div class="bg-[#D2691E]/70 border-4 border-[#8B4513] rounded-xl shadow-2xl p-8 w-96">
			<div class="flex flex-col gap-6 items-center">
				@forelse($mejoras as $mejora)
					<!-- Mejora {{ $mejora->id }} -->
					<div class="flex items-center gap-4">
						<x-boton 
							color="#8B4513" 
							text="{{ $mejora->nombre }}" 
							size="lg" 
							height="normal" 
							border_color="#000000" 
							type="button" 
						/>
						<div class="w-24 h-12">
							<x-dialogo 
								bg_color="#F5DEB3" 
								border_color="#8B4513" 
								text="{{ $mejora->precio_nv1 }}" 
								text_size="text-xs" 
							/>
						</div>
					</div>
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
			<x-dialogo bg_color="#D9D9D9" border_color="#000000" text="¡Bienvenido a mi tienda! Aquí puedes comprar mejoras para tu aventura." />
		</div>
	</main>		<!-- Imagen del toro abajo a la izquierda -->
@endsection

