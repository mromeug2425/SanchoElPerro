@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Registro')

@php
	$backgroundImage = asset('img/backgrounds/landing.png');
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

		<main class="flex-1 flex items-center justify-center">
			<div class="relative">
				<!-- Recuadro amarillo con borde negro -->
				<div class="bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 border-black rounded-2xl p-6 shadow-2xl w-[380px] animate-fade-in-scale">
					
					@if($errors->any())
						<div class="bg-red-600 text-white p-3 rounded-lg mb-4 border-2 border-red-800">
							<ul class="list-disc list-inside text-xs">
								@foreach($errors->all() as $error)
									<li>{{ $error }}</li>
								@endforeach
							</ul>
						</div>
					@endif

					<form method="POST" action="{{ route('register') }}" class="space-y-4">
						@csrf
						
						<div class="animate-slide-up" style="animation-delay: 0.2s;">
							<label for="name" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Nombre de Usuario</label>
							<input 
								id="name" 
								name="name" 
								value="{{ old('name') }}" 
								required 
								autofocus
								class="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm transition-transform duration-200 focus:scale-[1.02]">
						</div>

						<div class="animate-slide-up" style="animation-delay: 0.3s;">
							<label for="email" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Email</label>
							<input 
								id="email" 
								name="email" 
								type="email" 
								value="{{ old('email') }}" 
								required
								class="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm transition-transform duration-200 focus:scale-[1.02]">
						</div>

						<div class="animate-slide-up" style="animation-delay: 0.4s;">
							<label for="password" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Contraseña</label>
							<input 
								id="password" 
								name="password" 
								type="password" 
								required
								class="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm transition-transform duration-200 focus:scale-[1.02]">
						</div>

						<div class="animate-slide-up" style="animation-delay: 0.5s;">
							<label for="password_confirmation" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Confirmar Contraseña</label>
							<input 
								id="password_confirmation" 
								name="password_confirmation" 
								type="password" 
								required
								class="w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm transition-transform duration-200 focus:scale-[1.02]">
						</div>

						<button 
							type="submit" 
							class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg uppercase tracking-wider border-2 border-green-800 text-sm transition-all duration-200 hover:scale-105 active:scale-95 animate-slide-up"
							style="animation-delay: 0.6s;">
							Registrarse
						</button>
					</form>

					<p class="text-center text-black mt-4 text-xs font-semibold animate-slide-up" style="animation-delay: 0.7s;">
						¿Ya tienes cuenta? 
						<a href="{{ route('login') }}" class="text-blue-800 hover:text-blue-600 font-bold underline transition-colors duration-200">
							Inicia sesión
						</a>
					</p>
				</div>
			</div>
		</main>
	</div>
@endsection
