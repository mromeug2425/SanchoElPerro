@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 1')

@php
    $backgroundImage = asset('img/backgrounds/joc1.png'); 
@endphp

@push('styles')
<style>
    .font-jersey {
        font-family: 'Jersey 10', sans-serif;
    }
</style>
@endpush

@section('content')
<div class="w-full h-full relative" style="background: url('{{ $backgroundImage }}') no-repeat center/cover; background-size: cover;">

    <div class="absolute top-4 left-4 z-20">
        <a href="{{ route('home') }}" 
           class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition transform hover:scale-105">
            Atrás
        </a>
    </div>

    <div class="absolute top-4 right-4 z-20 w-24 h-24 flex items-center justify-center">
        <div class="bg-[#D4A574]/80 border-2 border-[rgb(212, 165, 116)] text-white p-4 rounded-xl shadow-md w-full h-full flex flex-col items-center justify-center">
            <div class="text-sm font-jersey text-gray-600">TIEMPO</div>
            <div id="tiempo-restante" class="text-3xl font-bold font-jersey">15</div>
        </div>
    </div>

    <main class="w-full h-full relative">

        <div class="absolute top-[27%] left-[27%] transform -translate-x-1/2 -translate-y-1/2 
             w-[262px] h-[190px] flex flex-col items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black left-operation-box">
            <p class="text-3xl font-extrabold tracking-wider text-gray-800">0 + 0</p>
            <p class="text-3xl font-extrabold tracking-wider mt-2 text-gray-800">0 + ?</p>
        </div>

        <div class="absolute top-[27%] right-[11%] transform -translate-y-1/2 
             w-[258px] h-[190px] flex items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black">
            <h2 class="text-3xl font-extrabold text-gray-800">¡Equilíbralo!</h2>
        </div>

        <div class="absolute left-[18%] top-[65%] w-[160px] z-10">
            <button data-option onclick="comprobar(this)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">1</button>
        </div>

        <div class="absolute right-[18%] top-[65%] w-[160px] z-10">
            <button data-option onclick="comprobar(this)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">2</button>
        </div>

        <div class="absolute left-[18%] top-[80%] w-[160px] z-10">
            <button data-option onclick="comprobar(this)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">3</button>
        </div>

        <div class="absolute right-[18%] top-[80%] w-[160px] z-10">
            <button data-option onclick="comprobar(this)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">4</button>
        </div>
    </main>

    <div id="popup-resultado" class="fixed inset-0 flex items-center justify-center z-50 hidden">
        <div class="absolute inset-0 bg-black opacity-50"></div>
        <div class="relative bg-white border-4 rounded-xl shadow-2xl p-8 max-w-md mx-4 transform transition-all duration-300 scale-95" id="popup-contenido">
            <h2 id="popup-titulo" class="text-3xl font-bold mb-4 text-center font-jersey"></h2>
            <p id="popup-mensaje" class="text-lg text-center mb-6 font-jersey"></p>
            <button onclick="cerrarPopup()" class="w-full bg-[#6B7FBF] hover:brightness-75 text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 hover:scale-95 font-jersey">
                Continuar
            </button>
        </div>
    </div>
</div>

<script src="{{ asset('js/juego1.js') }}"></script>
<script>
    document.addEventListener('DOMContentLoaded', function() {
        iniciarTimer();
    });
</script>
@endsection