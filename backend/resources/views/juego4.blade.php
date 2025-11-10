@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 4')

@php
	$backgroundImage = asset('img/backgrounds/joc4.png');
	$maxLife = 100;
	$currentLife = 20; // Change this value to see the bar change
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

		<main class="flex-1 flex items-start justify-center pt-20">
			<div class="animate-fade-in-scale w-full">
				<!-- Contenido del Juego 4 -->
				<div class="text-center w-full justify-between flex items-center">
					<div class="text-center flex gap-4">
						<div class="text-center flex flex-col gap-4">
							<x-boton color="#347E2B" text="23" height="large" />
							<x-boton color="#347E2B" text="2" height="large" />
							<x-boton color="#347E2B" text="4" height="large" />
							<x-boton color="#347E2B" text="5" height="large" />
						</div>
						<div class="text-center flex flex-col gap-4">
							<x-boton color="#0C3826" text="x" height="large" />
							<x-boton color="#0C3826"text="+" height="large" />
							<x-boton color="#0C3826" text="-" height="large" />
						</div>
					</div>
					<div class="text-center flex gap-4">
						<div class="text-center flex flex-col gap-4">
							<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="2x14-5" />
							<x-boton color="#3C3B4F" text="Submit" height="large" />
						</div>
						<div class="text-center flex flex-col gap-4">
							<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="100" />
							<x-dialogo bg_color="#3C3B4F" border_color="#000000" text="25" />
						</div>
						<div class="text-center flex flex-col gap-4">
							<div class="flex flex-col items-center">
								<div class="relative w-12 h-64 bg-gray-800 rounded-full border-4 border-black shadow-lg overflow-hidden">
									<div class="absolute inset-0 bg-red-900/30"></div>
									
									<div class="absolute bottom-0 left-0 right-0 transition-all duration-300 ease-out"
										 style="height: {{ ($currentLife / $maxLife) * 100 }}%;">
										<div class="w-full h-full bg-red-600"></div>
									</div>
									
									<div class="absolute inset-0 flex items-center justify-center z-10">
										<span class="font-jersey text-white text-lg font-bold drop-shadow-lg">
											{{ $currentLife }}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</main>
	</div>
@endsection
