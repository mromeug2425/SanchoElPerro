@extends('layouts.app')

@section('title', config('app.name', 'SanchoElPerro') . ' - Tienda')

@php
	$backgroundImage = asset('img/backgrounds/tienda.png');
@endphp

@section('content')
	<div class="w-full h-full flex flex-col p-8">
		<main class="flex-1 flex items-center justify-center">
			<div class="text-center">
				<x-dialogo color="green" text="Welcome to the store!" />
			</div>
		</main>

	</div>
@endsection

