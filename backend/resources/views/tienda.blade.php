<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
	<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">

		<title>{{ config('app.name', 'SanchoElPerro') }} - Tienda</title>
		
		<!-- Tailwind CDN (page-scoped) -->
		<script src="https://cdn.tailwindcss.com"></script>
		<script>
			// Optional: minimal page-scoped Tailwind config
			tailwind.config = {
				theme: {
					extend: {},
				},
			};
		</script>
	</head>
	<body class="bg-[#FDFDFC] text-[#1b1b18] min-h-screen max-h-screen">

		<main class="container mx-auto p-6">
			<h1 class="text-2xl font-bold mb-4">Tienda</h1>
		</main>
	</body>
</html>

