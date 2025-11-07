@props(['color' => 'blue', 'text' => '', 'size' => 'md', 'type' => 'button', 'href' => null])

@if($href)
	<a href="{{ $href }}" class="bg-{{ $color }}-600 hover:bg-{{ $color }}-700 text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $size == 'sm' ? '1.5' : ($size == 'lg' ? '3' : '2.5') }} text-{{ $size }} transition duration-200 inline-block text-center">
		{{ $text }}
	</a>
@else
	<button type="{{ $type }}" class="bg-{{ $color }}-600 hover:bg-{{ $color }}-700 text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $size == 'sm' ? '1.5' : ($size == 'lg' ? '3' : '2.5') }} text-{{ $size }} transition duration-200">
		{{ $text }}
	</button>
@endif
