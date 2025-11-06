<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>@yield('title', config('app.name', 'SanchoElPerro'))</title>
		
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			tailwind.config = {
				theme: {
					extend: {},
				},
			};
		</script>

		@stack('styles')
	</head>
	<body class="antialiased bg-gray-900">
		<div class="min-h-screen w-full flex items-center justify-center p-4">
			<div class="relative mx-auto">
				@if(isset($backgroundImage) && $backgroundImage)
					{{-- Background image that dictates the container size --}}
					<img src="{{ $backgroundImage }}" 
						alt="Background" 
						class="w-full h-auto max-w-full rounded-lg shadow-2xl">
					
					{{-- Content layer positioned over the image --}}
					<div class="absolute inset-0 z-10">
						@yield('content')
					</div>
				@else
					{{-- Fallback if no background image --}}
					<div class="w-full min-h-screen">
						@yield('content')
					</div>
				@endif
			</div>
		</div>

		@stack('scripts')
	</body>
</html>
