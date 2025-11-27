<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use App\Models\Sesiones;
use Illuminate\Http\Request;
use App\Models\SesionesJuegos;
use Illuminate\Support\Facades\Log;
use App\Models\SesionesJuegosPreguntas;

class SesionesController extends Controller
{
    
    public function iniciarSesionJuego(Request $request)
    {
        // 1. Obtener el usuario autenticado
        $usuario = auth()->user();

        Log::info('Iniciando sesión de juego para el usuario ID: ' . $usuario);
        
        // 2. Obtener la sesión activa del usuario
        $sesionActiva = Sesiones::where('id_usuario', $usuario->id)
                                ->whereNull('duracion') // Sesión aún activa
                                ->latest('createdAt')
                                ->first();
        
        // 3. Validar que exista una sesión activa
        if (!$sesionActiva) {
            $sesionActiva = Sesiones::create([
                'id_usuario' => $usuario->id,
                'duracion' => null,
                'monedas_gastadas' => 0,
                'createdAt' => Carbon::now(),
            ]);
        }
        // 4. Crear el registro en sesiones_juegos
        $sesionJuego = SesionesJuegos::create([
            'id_juego' => $request->id_juego, // Recibido desde el frontend
            'id_sesion' => $sesionActiva->id,
            'duracion' => null, // Se calculará al finalizar
            'monedas_ganadas' => 0,
            'monedas_perdidas' => 0,
            'ganado' => false,
            'createdAt' => Carbon::now()
        ]);
        
        return response()->json([
            'success' => true,
            'sesion_juego_id' => $sesionJuego->id
        ]);
    }

    public function finalizarSesionJuego(Request $request)
    {
        // 1. Buscar la sesión de juego
        $sesionJuego = SesionesJuegos::find($request->sesion_juego_id);
        
        if (!$sesionJuego) {
            return response()->json(['error' => 'Sesión de juego no encontrada'], 404);
        }
        
        // 2. Calcular la duración
        $inicio = Carbon::parse($sesionJuego->createdAt);
        $duracion = $inicio->diffInSeconds(Carbon::now());
        
        // Obtener el usuario autenticado
        $usuario = auth()->user();

        // Obtener monedas ganadas y perdidas de la petición
        $monedasGanadas = $request->monedas_ganadas ?? 0;
        $monedasPerdidas = $request->monedas_perdidas ?? 0;

        // Actualizar el total de monedas del usuario
        $usuario->monedas += $monedasGanadas;
        $usuario->monedas -= $monedasPerdidas;
        $usuario->save();

        // 3. Actualizar los campos
        $sesionJuego->update([
            'duracion' => gmdate('H:i:s', $inicio->diffInSeconds(Carbon::now())),
            'monedas_ganadas' => $monedasGanadas,
            'monedas_perdidas' => $monedasPerdidas,
            'ganado' => $request->ganado ?? false
        ]);
        
        return response()->json([
            'success' => true,
            'duracion' => $duracion
        ]);
    }
    
    public function guardarRespuesta(Request $request){

        // 1. Validar que exista la sesión de juego
        $sesionJuego = SesionesJuegos::find($request->id_sesion_juegos);
        
        if (!$sesionJuego) {
            return response()->json(['error' => 'Sesión de juego no encontrada'], 404);
        }
        
        // 2. Crear el registro de la respuesta
            $respuesta = SesionesJuegosPreguntas::create([
                'id_sesion_juegos' => $request->id_sesion_juegos,
                'id_pregunta' => $request->id_pregunta,
                'acertada' => $request->acertada,
                'respuesta_usuario' => strval($request->respuesta_usuario),
                'respuesta_correcta' => strval($request->respuesta_correcta),
                'opciones' => json_encode($request->opciones), // Convierte el array a JSON
            ]);
        
        return response()->json([
            'success' => true,
            'respuesta_id' => $respuesta->id
        ]);
    
    }

}
