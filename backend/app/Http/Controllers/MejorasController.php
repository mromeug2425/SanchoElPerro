<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use App\Models\Usuario;
use App\Models\UsuariosMejoras;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class MejorasController extends Controller
{
    public function comprar(Request $request)
    {
        $usuario = auth()->user();
        $idMejora = $request->input('id_mejora');
        
        $mejora = Mejoras::findOrFail($idMejora);
        
        $usuarioMejora = UsuariosMejoras::where('id_usuario', $usuario->id)
                                        ->where('id_mejora', $idMejora)
                                        ->first();
        
        $nivelActual = $usuarioMejora ? $usuarioMejora->nivel : 0;
        $siguienteNivel = $nivelActual + 1;
        
        $campoPrecios = 'precio_nv' . $siguienteNivel;
        $precio = $mejora->$campoPrecios ?? 0;

        if ($nivelActual >= 4) {
            return response()->json([
                'success' => false,
                'message' => 'Esta mejora ya está al nivel máximo'
            ], 400);
        }
        
        if ($usuario->monedas < $precio) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes suficientes monedas'
            ], 400);
        }
        
        DB::beginTransaction();
        
        try {
            $usuario->monedas -= $precio;
            $usuario->monedas_gastadas += $precio;
            $usuario->save();
            
            if ($usuarioMejora) {
                $usuarioMejora->nivel = $siguienteNivel;
                $usuarioMejora->save();
            } else {
                UsuariosMejoras::create([
                    'id_usuario' => $usuario->id,
                    'id_mejora' => $idMejora,
                    'nivel' => 1
                ]);
            }
            
            DB::commit();
            
            return response()->json([
                'success' => true,
                'message' => 'Mejora comprada exitosamente',
                'monedas_restantes' => $usuario->monedas
            ]);
            
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Error al comprar mejora: ' . $e->getMessage());
            Log::error('Stack trace: ' . $e->getTraceAsString());
            
            return response()->json([
                'success' => false,
                'message' => 'Error al procesar la compra'
            ], 500);
        }
    }
}