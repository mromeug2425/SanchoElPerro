@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Registro')

@php
	$backgroundImage = asset('img/backgrounds/landing.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-4">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('login') }}" 
			id="backBtn"
			class="bg-gray-800 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm">
				Atrás
			</a>
		</div>

		<main class="flex-1 flex items-center justify-center">
			<div class="relative">
				<!-- Recuadro amarillo con borde negro -->
				<div id="formBox" class="bg-gradient-to-b from-yellow-400 to-yellow-500 border-4 border-black rounded-2xl p-6 shadow-2xl w-[380px] opacity-0 scale-95">
					
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
						
						<div class="form-field">
							<label for="name" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Nombre de Usuario</label>
							<input 
								id="name" 
								name="name" 
								value="{{ old('name') }}" 
								required 
								autofocus
								class="input-field w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm">
						</div>

						<div class="form-field">
							<label for="email" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Email</label>
							<input 
								id="email" 
								name="email" 
								type="email" 
								value="{{ old('email') }}" 
								required
								class="input-field w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm">
						</div>

						<div class="form-field">
							<label for="password" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Contraseña</label>
							<input 
								id="password" 
								name="password" 
								type="password" 
								required
								class="input-field w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm">
						</div>

						<div class="form-field">
							<label for="password_confirmation" class="block text-black font-bold mb-1 uppercase text-xs tracking-wide">Confirmar Contraseña</label>
							<input 
								id="password_confirmation" 
								name="password_confirmation" 
								type="password" 
								required
								class="input-field w-full px-3 py-2 rounded-lg bg-white border-2 border-gray-300 focus:border-black focus:outline-none text-gray-800 text-sm">
						</div>

						<button 
							type="submit" 
							id="submitBtn"
							class="w-full bg-green-600 text-white font-bold py-3 px-4 rounded-lg shadow-lg uppercase tracking-wider border-2 border-green-800 text-sm">
							Registrarse
						</button>
					</form>

					<p class="text-center text-black mt-4 text-xs font-semibold">
						¿Ya tienes cuenta? 
						<a href="{{ route('login') }}" class="text-blue-800 font-bold underline hover-link">
							Inicia sesión
						</a>
					</p>
				</div>
			</div>
		</main>
	</div>
@endsection

@push('scripts')
<script>
	// Animación de entrada del formulario
	document.addEventListener('DOMContentLoaded', function() {
		const formBox = document.getElementById('formBox');
		const backBtn = document.getElementById('backBtn');
		const submitBtn = document.getElementById('submitBtn');
		const formFields = document.querySelectorAll('.form-field');
		const inputFields = document.querySelectorAll('.input-field');
		
		// Animación de entrada del formulario
		setTimeout(() => {
			formBox.style.transition = 'all 0.5s ease-out';
			formBox.style.opacity = '1';
			formBox.style.transform = 'scale(1)';
		}, 100);
		
		// Animación de los campos del formulario
		formFields.forEach((field, index) => {
			setTimeout(() => {
				field.style.opacity = '0';
				field.style.transform = 'translateY(10px)';
				field.style.transition = 'all 0.3s ease-out';
				
				setTimeout(() => {
					field.style.opacity = '1';
					field.style.transform = 'translateY(0)';
				}, 50);
			}, 200 + (index * 100));
		});
		
		// Efecto hover en inputs
		inputFields.forEach(input => {
			input.addEventListener('focus', function() {
				this.style.transform = 'scale(1.02)';
				this.style.transition = 'transform 0.2s ease';
			});
			
			input.addEventListener('blur', function() {
				this.style.transform = 'scale(1)';
			});
		});
		
		// Efecto hover en botón Atrás
		backBtn.addEventListener('mouseenter', function() {
			this.style.transform = 'scale(1.05)';
			this.style.backgroundColor = '#374151';
			this.style.transition = 'all 0.2s ease';
		});
		
		backBtn.addEventListener('mouseleave', function() {
			this.style.transform = 'scale(1)';
			this.style.backgroundColor = '#1f2937';
		});
		
		// Efecto de clic en botón de registro
		submitBtn.addEventListener('mouseenter', function() {
			this.style.transform = 'scale(1.05)';
			this.style.backgroundColor = '#15803d';
			this.style.transition = 'all 0.2s ease';
		});
		
		submitBtn.addEventListener('mouseleave', function() {
			this.style.transform = 'scale(1)';
			this.style.backgroundColor = '#16a34a';
		});
		
		submitBtn.addEventListener('click', function(e) {
			this.style.transform = 'scale(0.95)';
			setTimeout(() => {
				this.style.transform = 'scale(1)';
			}, 100);
		});
		
		// Efecto hover en enlaces
		document.querySelectorAll('.hover-link').forEach(link => {
			link.addEventListener('mouseenter', function() {
				this.style.color = '#1e3a8a';
				this.style.transition = 'color 0.2s ease';
			});
			
			link.addEventListener('mouseleave', function() {
				this.style.color = '#1e40af';
			});
		});
	});
</script>
@endpush
