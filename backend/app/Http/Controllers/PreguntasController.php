<?php

namespace App\Http\Controllers;

use App\Models\Preguntas;


class PreguntasController extends Controller
    {
        // Devuelve un conjunto de preguntas aleatorias para un juego específico
        public function preguntasMostradas($id_juego = 1)
    {

        $preguntas = Preguntas::where('id_juego', $id_juego)
            ->inRandomOrder()
            ->limit(5)
            ->get();

        return response()->$preguntas;
    }
    
}
