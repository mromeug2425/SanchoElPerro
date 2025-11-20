@props(['color' => 'blue', 'text' => '', 'size' => 'md', 'type' => 'button', 'href' => null, 'height' => 'normal', 'width' => "full" ,'border_color' => 'black', 'draggable' => false])

@if($href)
	<a href="{{ $href }}" class="bg-[{{ $color }}] border-2 border-[{{ $border_color }}] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $height == 'small' ? '2' : ($height == 'large' ? '6' : ($height == 'xlarge' ? '8' : '3')) }} text-{{ $size }} transition-all duration-200 inline-block text-center w-full whitespace-normal break-words">
		{{ $text }}
	</a>
@else
	<button type="{{ $type }}" class="bg-[{{ $color }}] border-2 border-[{{ $border_color }}] hover:brightness-75 hover:scale-95 text-white font-medium rounded-lg px-{{ $size == 'sm' ? '3' : ($size == 'lg' ? '6' : '5') }} py-{{ $height == 'small' ? '2' : ($height == 'large' ? '6' : ($height == 'xlarge' ? '8' : '3')) }} text-{{ $size }} transition-all duration-200 w-full whitespace-normal break-words text-center">
		{{ $text }}
	</button>
@endif