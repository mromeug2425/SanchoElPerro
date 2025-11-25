<?php

namespace App\Http\Controllers;

use App\Models\Sesiones;
use App\Models\SesionesJuegos;
use App\Models\SesionesJuegosPreguntas;
use Illuminate\Http\Request;
use Carbon\Carbon;

class SesionesController extends Controller
{
    
    public function iniciarSesionJuego(Request $request)
    {
        // 1. Obtener el usuario autenticado
        $usuario = auth()->user();
        
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
        
        // 3. Actualizar los campos
        $sesionJuego->update([
            'duracion' => $duracion,
            'monedas_ganadas' => $request->monedas_ganadas ?? 0,
            'monedas_gastadas' => $request->monedas_gastadas ?? 0,
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
        'respuesta_usuario' => $request->respuesta_usuario,
        'respuesta_correcta' => $request->respuesta_correcta,
        'opciones' => $request->opciones  // Array con las 4 opciones
    ]);
    
    return response()->json([
        'success' => true,
        'respuesta_id' => $respuesta->id
    ]);
    
    }

}
