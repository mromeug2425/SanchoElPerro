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

        // Extraer los segundos del tiempo (formato: 1900-01-01 12:00:15:0000000)
        $tiempoString = $juego->tiempo;
        $tiempoSegundos = $juego->tiempo; // Valor por defecto
        
        if ($tiempoString) {
            // Extraer solo los segundos de la cadena (formato: HH:MM:SS)
            preg_match('/(\d{2}):(\d{2}):(\d{2})/', $tiempoString, $matches);
            if (!empty($matches)) {
                $horas = (int)$matches[1] - 12; // Restar 12 porque la BD usa 12:00:XX
                $minutos = (int)$matches[2];
                $segundos = (int)$matches[3];
                $tiempoSegundos = ($horas * 3600) + ($minutos * 60) + $segundos;
            }
        }

        return response()->json([
            'preguntas' => $preguntas,
            'tiempo' => $tiempoSegundos
        ]);
    }
    
}
