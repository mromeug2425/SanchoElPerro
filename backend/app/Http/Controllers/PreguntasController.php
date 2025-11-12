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

        // Extraer los segundos del tiempo 
        // Formato SQL Server: "Jan 1 1900 12:00:15:0000000AM" donde 12:00:15 significa 00:00:15 (medianoche)
        $tiempoString = $juego->tiempo;
        $tiempoSegundos = 15; // Valor por defecto
        
        if ($tiempoString) {
            Log::info('Tiempo original de la BD: ' . $tiempoString . ' (tipo: ' . gettype($tiempoString) . ')');
            
            // Si es un objeto Carbon/DateTime
            if (is_object($tiempoString)) {
                // Para objetos, usar solo minutos y segundos (ignorar horas si es medianoche)
                $horas = $tiempoString->hour == 12 ? 0 : $tiempoString->hour;
                $tiempoSegundos = ($horas * 3600) + ($tiempoString->minute * 60) + $tiempoString->second;
            } else {
                // Si es string, buscar el patrón HH:MM:SS
                if (preg_match('/(\d{1,2}):(\d{2}):(\d{2})/', $tiempoString, $matches)) {
                    $horas = (int)$matches[1];
                    $minutos = (int)$matches[2];
                    $segundos = (int)$matches[3];
                    
                    // Si las horas son 12 y hay AM, significa medianoche (00:00)
                    if ($horas == 12 && stripos($tiempoString, 'AM') !== false) {
                        $horas = 0;
                    }
                    
                    $tiempoSegundos = ($horas * 3600) + ($minutos * 60) + $segundos;
                    Log::info("Extraído - Horas: {$horas}, Minutos: {$minutos}, Segundos: {$segundos}");
                }
            }
            
            Log::info('Tiempo convertido a segundos: ' . $tiempoSegundos);
        }

        return response()->json([
            'preguntas' => $preguntas,
            'tiempo' => $tiempoSegundos
        ]);
    }
    
}
