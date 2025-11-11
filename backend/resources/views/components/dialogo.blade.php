@props(['bg_color' => 'white', 'border_color' => 'black', 'text' => '', 'text_size' => 'text-md', 'text_color' => null])

<div class="bg-[{{ $bg_color }}]/80 border-2 border-[{{ $border_color }}] {{ $text_color ? 'text-[' . $text_color . ']' : 'text-[' . $border_color . ']' }} p-4 rounded-xl shadow-md w-full h-full">
	<div class="flex items-start">
        <p class="{{ $text_size }} font-medium font-jersey">
            {{ $text }} 
        </p>
    </div>
</div>
