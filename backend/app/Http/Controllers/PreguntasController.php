<?php

namespace App\Http\Controllers;

use App\Models\Juegos;
use App\Models\Preguntas;
use Illuminate\Support\Facades\Log;


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

        // Extraer los segundos del tiempo (formato: 00:00:10.0000000)
        $tiempoString = $juego->tiempo;
        $tiempoSegundos = 15; // Valor por defecto
        
        if ($tiempoString) {
            // Log para debugging
            Log::info('Tiempo original de la BD: ' . $tiempoString);
            
            // Convertir el objeto Carbon o string a segundos
            if (is_object($tiempoString)) {
                // Si es un objeto Carbon/DateTime
                $tiempoSegundos = ($tiempoString->hour * 3600) + ($tiempoString->minute * 60) + $tiempoString->second;
            } else {
                // Si es string, extraer HH:MM:SS
                preg_match('/(\d{2}):(\d{2}):(\d{2})/', $tiempoString, $matches);
                if (!empty($matches)) {
                    $horas = (int)$matches[1];
                    $minutos = (int)$matches[2];
                    $segundos = (int)$matches[3];
                    $tiempoSegundos = ($horas * 3600) + ($minutos * 60) + $segundos;
                }
            }
            
            Log::info('Tiempo en segundos: ' . $tiempoSegundos);
        }

        return response()->json([
            'preguntas' => $preguntas,
            'tiempo' => $tiempoSegundos
        ]);
    }
    
}
