@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Inicio')

@php
	$backgroundImage = Auth::check() 
		? asset('img/backgrounds/landing.png') 
		: asset('img/backgrounds/home.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col items-center justify-end p-4 pb-32">
		@auth
			<div class="absolute top-4 right-4 z-20">
				<form method="POST" action="{{ route('logout') }}">
					@csrf
					<x-boton color="#dc2626" text="Cerrar Sesión" size="sm" height="small" type="submit" width="auto" />
				</form>
			</div>

			<div class="relative w-full h-full">
				@foreach($mejoras as $mejora)
					<img src="{{ asset(str_replace('img/', 'img/mejoras/', $mejora->img)) }}" 
						class="mejora-img absolute" 
						data-mejora-id="{{ $mejora->id }}"
						data-comprada="{{ in_array($mejora->id, $mejorasCompradas) ? 'true' : 'false' }}"
						alt="{{ $mejora->nombre }}">
				@endforeach
			</div>

			<!-- Botones de Tienda y Juegos a la derecha (cuando está autenticado) -->
			<div class="absolute right-8 bottom-32 z-20 flex flex-col gap-6">
				<!-- Botón TIENDA -->
				<x-boton 
					id="boton-tienda" 
					color="#a855f7" 
					text="Tienda" 
					size="lg" 
					height="xlarge" 
					border_color="black"
					data-tiquets="{{ Auth::user()->tiquets_tienda ?? 0 }}"
					data-href="{{ route('tienda') }}"
				/>

				<!-- Botón JUEGOS -->
				<x-boton color="#3b82f6" text="Juegos" size="lg" height="xlarge" href="{{ route('niveles') }}" border_color="black" />
			</div>
		@endauth

		<main class="flex flex-col items-center space-y-8">
			<!-- Botones de acción -->
			<div class="flex flex-col md:flex-row gap-6 animate-fade-in-scale">
				@guest
					<!-- Botón LOG IN -->
					<x-boton color="#facc15" text="Log In" size="lg" height="xlarge" href="{{ route('login') }}" border_color="black" />

					<!-- Botón REGISTER -->
					<x-boton color="#374151" text="Register" size="lg" height="xlarge" href="{{ route('register') }}" border_color="black" />
				@endguest
			</div>
		</main>
	</div>

	<script src="{{ asset('js/mejoras.js') }}"></script>

	@auth
	<script src="{{ asset('js/tiendaTikets.js') }}"></script>
	@endauth
@endsection
