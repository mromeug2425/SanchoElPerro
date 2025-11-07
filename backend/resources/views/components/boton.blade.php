@props(['color' => 'blue', 'text' => '', 'size' => 'md', 'type' => 'button', 'href' => null, 'height' => 'normal'])

@if($href)
	<a href="{{ $href }}" class="bg-[{{ $color }}] hover:bg-[{{ $color }}] text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $height == 'small' ? '2' : ($height == 'large' ? '6' : ($height == 'xlarge' ? '8' : '3')) }} text-{{ $size }} transition duration-200 inline-block text-center">
		{{ $text }}
	</a>
@else
	<button type="{{ $type }}" class="bg-[{{ $color }}] hover:bg-[{{ $color }}] text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $height == 'small' ? '2' : ($height == 'large' ? '6' : ($height == 'xlarge' ? '8' : '3')) }} text-{{ $size }} transition duration-200">
		{{ $text }}
	</button>
@endif
