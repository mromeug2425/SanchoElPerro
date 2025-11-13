<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use App\Models\Usuario;
use App\Models\UsuariosMejoras;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class UsuarioController extends Controller
{

    public function ganarMonedas(){
        $usuario = Usuario::first(); // Suponiendo que hay un solo usuario

        if ($usuario) {
            $usuario->monedas += 100; // Añadir 100 monedas
            $usuario->save();

            return response()->json(['message' => 'Monedas añadidas correctamente', 'monedas' => $usuario->monedas]);
        } else {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
    }

    public function gastarMonedas(){
        $usuario = Usuario::first(); // Suponiendo que hay un solo usuario

        if ($usuario) {
            if ($usuario->monedas >= 50) {
                $usuario->monedas -= 50; // Restar 50 monedas
                $usuario->save();

                return response()->json(['message' => 'Monedas gastadas correctamente', 'monedas' => $usuario->monedas]);
            } else {
                return response()->json(['error' => 'No tienes suficientes monedas'], 400);
            }
        } else {
            return response()->json(['error' => 'Usuario no encontrado'], 404);
        }
    }

    public function mostrarMejoras($id_usuario){
        // Obtener todas las mejoras del usuario con la relación a la tabla mejoras
        $mejorasUsuario = UsuariosMejoras::where('id_usuario', $id_usuario)
            ->with('mejora')
            ->get();

        // Si no hay mejoras, retornar array vacío
        if ($mejorasUsuario->isEmpty()) {
            return response()->json([
                'message' => 'Este usuario no tiene mejoras',
                'mejoras' => []
            ], 200);
        }

        Log::info('Mejoras del usuario obtenidas:', $mejorasUsuario->toArray());

        // Mapear los datos para incluir la imagen según el nivel
        $mejorasConImagen = $mejorasUsuario->map(function($mejoraUsuario) {
            // Verificar que existe la relación con mejora
            if (!$mejoraUsuario->mejora) {
                return null;
            }

            $mejora = $mejoraUsuario->mejora;
            $nivel = $mejoraUsuario->nivel;

            // Seleccionar la imagen según el nivel
            $imagenUrl = $mejora->img; // Imagen por defecto (nivel 1)
            
            switch($nivel) {
                case 2:
                    $imagenUrl = $mejora->img_n2 ?? $mejora->img;
                    break;
                case 3:
                    $imagenUrl = $mejora->img_n3 ?? $mejora->img;
                    break;
                case 4:
                    $imagenUrl = $mejora->img_n4 ?? $mejora->img;
                    break;
                default:
                    $imagenUrl = $mejora->img;
            }

            return [
                'id' => $mejoraUsuario->id,
                'id_usuario' => $mejoraUsuario->id_usuario,
                'id_mejora' => $mejoraUsuario->id_mejora,
                'nivel' => $mejoraUsuario->nivel,
                'nombre_mejora' => $mejora->nombre,
                'imagen' => $imagenUrl,
                'activo' => $mejora->activo,
                'precio_siguiente_nivel' => $this->getPrecioSiguienteNivel($mejora, $nivel)
            ];
        })->filter(); // Filtrar nulls en caso de mejoras sin relación

        return response()->json([
            'message' => 'Mejoras obtenidas correctamente',
            'mejoras' => $mejorasConImagen->values()
        ], 200);
    }

    /**
     * Obtiene el precio del siguiente nivel de una mejora
     * 
     * @param Mejoras $mejora
     * @param int $nivelActual
     * @return int|null
     */
    private function getPrecioSiguienteNivel($mejora, $nivelActual) {
        switch($nivelActual) {
            case 1:
                return $mejora->precio_nv2;
            case 2:
                return $mejora->precio_nv3;
            case 3:
                return $mejora->precio_nv4;
            case 4:
                return null; // Ya está en el nivel máximo
            default:
                return $mejora->precio_nv2;
        }
    }

}
