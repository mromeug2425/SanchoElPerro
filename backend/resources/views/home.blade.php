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
					<button type="submit" 
						class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105">
						Cerrar Sesión
					</button>
				</form>
			</div>

			<!-- Botones de Tienda y Juegos a la derecha (cuando está autenticado) -->
			<div class="absolute right-8 bottom-32 z-20 flex flex-col gap-6">
				<!-- Botón TIENDA -->
				<a href="{{ route('tienda') }}" 
				class="bg-gradient-to-b from-purple-500 to-purple-700 hover:from-purple-600 hover:to-purple-800 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] uppercase tracking-wider text-2xl border-4 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-105 [text-shadow:_2px_2px_0_rgb(0_0_0)]">
					Tienda
				</a>

				<!-- Botón JUEGOS -->
				<a href="{{ route('niveles') }}" 
				class="bg-gradient-to-b from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] uppercase tracking-wider text-2xl border-4 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-105 [text-shadow:_2px_2px_0_rgb(0_0_0)]">
					Juegos
				</a>
			</div>
		@endauth

		<main class="flex flex-col items-center space-y-8">
			<!-- Botones de acción -->
			<div class="flex flex-col md:flex-row gap-6 animate-fade-in-scale">
				@guest
					<!-- Botón LOG IN -->
					<a href="{{ route('login') }}" 
					class="bg-gradient-to-b from-yellow-400 to-yellow-500 hover:from-yellow-500 hover:to-yellow-600 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] uppercase tracking-wider text-2xl border-4 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-105 [text-shadow:_2px_2px_0_rgb(0_0_0)]">
						Log In
					</a>

					<!-- Botón REGISTER -->
					<a href="{{ route('register') }}" 
					class="bg-gradient-to-b from-gray-700 to-gray-900 hover:from-gray-600 hover:to-gray-800 text-white font-black py-6 px-16 rounded-2xl shadow-2xl hover:shadow-[0_20px_40px_rgba(0,0,0,0.5)] uppercase tracking-wider text-2xl border-4 border-black transition-all duration-200 hover:scale-110 hover:-translate-y-1 active:scale-105 [text-shadow:_2px_2px_0_rgb(0_0_0)]">
						Register
					</a>
				@endguest
			</div>
		</main>
	</div>
@endsection
