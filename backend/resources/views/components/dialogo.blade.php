@props(['bg_color' => 'white', 'border_color' => 'black', 'text' => ''])

<div class="bg-[{{ $bg_color }}]/50 border-2 border-[{{ $border_color }}] text-[{{ $border_color }}] p-4 rounded-xl shadow-md">
	<div class="flex items-start">
        <p class="text-sm font-medium">
            {{ $text }} 
        </p>
    </div>
</div>
