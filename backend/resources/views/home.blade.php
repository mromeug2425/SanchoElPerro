@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Inicio')

@php
	$backgroundImage = asset('img/backgrounds/home.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col items-center justify-end p-4 pb-32">
		<main class="flex flex-col items-center space-y-8">
			<!-- Botones de acción -->
			<div class="flex flex-col md:flex-row gap-6 animate-fade-in-scale">
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
			</div>
		</main>
	</div>
@endsection
