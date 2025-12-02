@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Niveles')

@php
	$backgroundImage = asset('img/backgrounds/landing.png');
@endphp

@push('styles')
<link rel="stylesheet" href="{{ asset('css/niveles.css') }}">
@endpush

@section('content')
	<div class="w-full h-full flex flex-col items-center justify-center p-4">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('home') }}" 
			class="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105 border-2 border-black">
				Atrás
			</a>
		</div>

		<main class="flex items-center justify-center w-full h-full">
			<!-- Contenedor del Tablón -->
			<div class="relative tablon-container animate-fade-in-scale">
				<!-- Imagen del Tablón -->
				<img src="{{ asset('img/backgrounds/tablon.png') }}" 
					alt="Tablón de Niveles" 
					class="w-full h-auto">

				<!-- Grid de Niveles sobre el Tablón -->
				<div class="absolute inset-0 flex items-center justify-center" style="padding: 15% 12%;">
					<div class="grid grid-cols-2 gap-x-8 gap-y-12 w-full h-full">
						<!-- Nivel 1 -->
						<div class="nivel-card">
							@if($juego1Desbloqueado)
								<a href="{{ route('juego1') }}" class="nivel-link">
									<div class="nivel-wrapper">
										<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
											alt="Chincheta" 
											class="chincheta chincheta-1">
										<img src="{{ asset('img/backgrounds/joc1.png') }}" 
											alt="Nivel 1" 
											class="nivel-image">
									</div>
								</a>
							@else
								<div class="nivel-wrapper opacity-50 cursor-not-allowed">
									<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
										alt="Chincheta" 
										class="chincheta chincheta-1">
									<img src="{{ asset('img/backgrounds/joc1.png') }}" 
										alt="Nivel 1" 
										class="nivel-image">
									<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
										<span class="text-white font-bold text-lg">BLOQUEADO</span>
									</div>
								</div>
							@endif
						</div>

						<!-- Nivel 2 -->
						<div class="nivel-card">
							@if($juego2Desbloqueado)
								<a href="{{ route('juego2') }}" class="nivel-link">
									<div class="nivel-wrapper">
										<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
											alt="Chincheta" 
											class="chincheta chincheta-2">
										<img src="{{ asset('img/backgrounds/joc2.png') }}" 
											alt="Nivel 2" 
											class="nivel-image">
									</div>
								</a>
							@else
								<div class="nivel-wrapper opacity-50 cursor-not-allowed">
									<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
										alt="Chincheta" 
										class="chincheta chincheta-2">
									<img src="{{ asset('img/backgrounds/joc2.png') }}" 
										alt="Nivel 2" 
										class="nivel-image">
									<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
										<span class="text-white font-bold text-lg">BLOQUEADO</span>
									</div>
								</div>
							@endif
						</div>

						<!-- Nivel 3 -->
						<div class="nivel-card">
							@if($juego3Desbloqueado)
								<a href="{{ route('juego3') }}" class="nivel-link">
									<div class="nivel-wrapper">
										<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
											alt="Chincheta" 
											class="chincheta chincheta-3">
										<img src="{{ asset('img/backgrounds/joc3.png') }}" 
											alt="Nivel 3" 
											class="nivel-image">
									</div>
								</a>
							@else
								<div class="nivel-wrapper opacity-50 cursor-not-allowed">
									<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
										alt="Chincheta" 
										class="chincheta chincheta-3">
									<img src="{{ asset('img/backgrounds/joc3.png') }}" 
										alt="Nivel 3" 
										class="nivel-image">
									<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
										<span class="text-white font-bold text-lg">BLOQUEADO</span>
									</div>
								</div>
							@endif
						</div>

						<!-- Nivel 4 -->
						<div class="nivel-card">
							@if($juego4Desbloqueado)
								<a href="{{ route('juego4') }}" class="nivel-link">
									<div class="nivel-wrapper">
										<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
											alt="Chincheta" 
											class="chincheta chincheta-4">
										<img src="{{ asset('img/backgrounds/joc4.png') }}" 
											alt="Nivel 4" 
											class="nivel-image">
									</div>
								</a>
							@else
								<div class="nivel-wrapper opacity-50 cursor-not-allowed">
									<img src="{{ asset('img/backgrounds/chincheta.png') }}" 
										alt="Chincheta" 
										class="chincheta chincheta-4">
									<img src="{{ asset('img/backgrounds/joc4.png') }}" 
										alt="Nivel 4" 
										class="nivel-image">
									<div class="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 rounded">
										<span class="text-white font-bold text-lg">BLOQUEADO</span>
									</div>
								</div>
							@endif
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
@endsection
