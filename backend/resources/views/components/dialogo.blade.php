@props(['bg_color' => 'white', 'border_color' => 'black', 'text' => ''])

<div class="bg-[{{ $bg_color }}]/50 border-2 border-[{{ $border_color }}] text-[{{ $border_color }}] p-4 rounded-xl shadow-md w-full h-full">
	<div class="flex items-start">
        <p class="text-md font-medium font-jersey">
            {{ $text }} 
        </p>
    </div>
</div>
