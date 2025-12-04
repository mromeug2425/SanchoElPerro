@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 1')

@push('head')
	<meta name="csrf-token" content="{{ csrf_token() }}">
@endpush

@php
    $backgroundImage = asset('img/backgrounds/joc1.png'); 
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-4" data-id-juego="{{ $id_juego }}">
		<!-- Botón Atrás -->
		<div class="absolute top-4 left-4 z-20">
			<a href="{{ route('home') }}" 
			class="bg-gray-800 hover:bg-gray-600 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition-all duration-200 hover:scale-105">
				Atrás
			</a>
		</div>

		<main class="flex-1 flex items-center justify-center">
			<div class="animate-fade-in-scale">
			</div>
		</main>
	</div>
	
	<!-- Cargar sesiones.js para tracking -->
	<script src="{{ asset('js/sesiones.js') }}"></script>
@endsection