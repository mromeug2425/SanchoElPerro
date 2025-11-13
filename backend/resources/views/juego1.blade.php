@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Juego 1')

@php
    // Asegúrate de que esta imagen sea la del escritorio/oficina (joc1.png)
    $backgroundImage = asset('img/backgrounds/joc1.png'); 
@endphp

@section('content')
<div class="w-full h-full relative" style="background: url('{{ $backgroundImage }}') no-repeat center/cover; background-size: cover;">

    <div class="absolute top-4 left-4 z-20">
        <a href="{{ route('home') }}" 
           class="bg-gray-800 hover:bg-gray-700 text-white font-bold py-2 px-6 rounded-full shadow-lg uppercase tracking-wider text-sm transition transform hover:scale-105">
            Atrás
        </a>
    </div>

    <main class="w-full h-full relative">
        
	<div class="absolute top-[27%] left-[27%] transform -translate-x-1/2 -translate-y-1/2 
             w-[262px] h-[190px] flex flex-col items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black">
   	 	<p class="text-3xl font-extrabold tracking-wider text-gray-800">3 + 4</p>
    	<p class="text-3xl font-extrabold tracking-wider mt-2 text-gray-800">5 + ?</p>
	</div>

      <div class="absolute top-[27%] right-[11%] transform -translate-y-1/2 
             w-[258px] h-[190px] flex items-center justify-center 
             p-12 rounded-xl shadow-xl bg-white bg-opacity-90 border-4 border-black">
    	 <h2 class="text-3xl font-extrabold text-gray-800">¡Equilíbralo!</h2>
	</div>
        
        <div class="absolute left-[18%] top-[65%] w-[160px] z-10">
            <button onclick="comprobar(1)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">1</button>
        </div>

        <div class="absolute right-[18%] top-[65%] w-[160px] z-10">
            <button onclick="comprobar(2)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">2</button>
        </div>

        <div class="absolute left-[18%] top-[80%] w-[160px] z-10">
            <button onclick="comprobar(3)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">3</button>
        </div>

        <div class="absolute right-[18%] top-[80%] w-[160px] z-10">
            <button onclick="comprobar(4)" class="w-full bg-cyan-500 hover:bg-cyan-400 text-white font-bold py-3 rounded-xl shadow-lg transition text-xl border-4 border-cyan-700 hover:scale-105">4</button>
        </div>

        <div class="absolute top-[50%] left-1/2 transform -translate-x-1/2 w-full text-center z-20">
            <span id="mensaje" class="text-3xl font-extrabold text-white bg-gray-900 bg-opacity-70 p-2 rounded-lg shadow-xl"></span>
        </div>

    </main>
</div>
</script>
@endsection