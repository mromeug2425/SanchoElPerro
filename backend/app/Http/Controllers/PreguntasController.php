<?php

namespace App\Http\Controllers;

use App\Models\Juegos;
use App\Models\Preguntas;


class PreguntasController extends Controller{
    public function preguntasMostradas($id_juego = 1){

        $juego = Juegos::where('id', $id_juego)->first();

        if (!$juego) {
            return response()->json(['error' => 'Juego no encontrado'], 404);
        }

        $preguntas = Preguntas::where('id_juego', $id_juego)
            ->inRandomOrder()
            ->limit($juego->cantidad_preguntas)
            ->get();

        return response()->json([
            'preguntas' => $preguntas,
            'tiempo' => $juego->tiempo
        ]);
    }
    
}
