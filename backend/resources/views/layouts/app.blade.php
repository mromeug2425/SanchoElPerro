<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>@yield('title', config('app.name', 'SanchoElPerro'))</title>
		
		<link rel="preconnect" href="https://fonts.googleapis.com">
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
		<link href="https://fonts.googleapis.com/css2?family=Jersey+10&display=swap" rel="stylesheet">
		
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			tailwind.config = {
				theme: {
					extend: {
						fontFamily: {
							'jersey': ['"Jersey 10"', 'cursive'],
						},
					},
				},
			};
		</script>

	<script>
		window.BASE_URL = '{{ url("/") }}';
		window.API_PATH = '{{ env("API_PATH", "") }}'; // Keep for backward compatibility if needed
	</script>		@stack('styles')
	</head>
	<body class="antialiased bg-gray-900">
		<div class="min-h-screen w-full flex items-center justify-center p-4">
			<div class="relative mx-auto">
				@if(isset($backgroundImage) && $backgroundImage)
					<img src="{{ $backgroundImage }}" 
						alt="Background" 
						class="w-full h-auto max-w-full rounded-lg shadow-2xl">
					
					<div class="absolute inset-0 z-10">
						@yield('content')
					</div>
				@else
					<div class="w-full min-h-screen">
						@yield('content')
					</div>
				@endif
			</div>
		</div>

		@stack('scripts')
	</body>
</html>
