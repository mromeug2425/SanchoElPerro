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
		<div class="flex flex-col gap-6">
			<!-- Mejora 1 -->
			<div class="flex items-center gap-4">
				<x-boton color="#8B4513" text="Mejora 1" size="lg" height="normal" border_color="#000000" type="button" />
				<div class="w-24 h-12">
					<x-dialogo bg_color="#F5DEB3" border_color="#8B4513" text="100" text_size="text-xs" />
				</div>
			</div>
			
			<!-- Mejora 2 -->
			<div class="flex items-center gap-4">
				<x-boton color="#8B4513" text="Mejora 2" size="lg" height="normal" border_color="#000000" type="button" />
				<div class="w-24 h-12">
					<x-dialogo bg_color="#F5DEB3" border_color="#8B4513" text="250" text_size="text-xs" />
				</div>
			</div>
			
			<!-- Mejora 3 -->
			<div class="flex items-center gap-4">
				<x-boton color="#8B4513" text="Mejora 3" size="lg" height="normal" border_color="#000000" type="button" />
				<div class="w-24 h-12">
					<x-dialogo bg_color="#F5DEB3" border_color="#8B4513" text="500" text_size="text-xs" />
				</div>
			</div>
			
			<!-- Mejora 4 -->
			<div class="flex items-center gap-4">
				<x-boton color="#8B4513" text="Mejora 4" size="lg" height="normal" border_color="#000000" type="button" />
				<div class="w-24 h-12">
					<x-dialogo bg_color="#F5DEB3" border_color="#8B4513" text="1000" text_size="text-xs" />
				</div>
			</div>
		</div>
	</main>		<!-- Imagen del toro abajo a la izquierda -->
		<div class="absolute bottom-0 -left-64 z-10 h-[32rem] overflow-hidden">
			<img src="{{ asset('img/personajes/toro/toro.png') }}" alt="Toro" class="h-[64rem] w-auto relative bottom-0">
		</div>

		<!-- Diálogo centrado en la parte inferior de la pantalla, encima del toro -->
		<div class="absolute bottom-16 left-1/2 transform -translate-x-1/2 z-20 w-full max-w-3xl px-4">
			<x-dialogo bg_color="#D9D9D9" border_color="#000000" text="¡Bienvenido a mi tienda! Aquí puedes comprar mejoras para tu aventura." />
		</div>
	</div>
@endsection

