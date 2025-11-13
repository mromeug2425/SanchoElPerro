<?php

namespace App\Http\Controllers;

use App\Models\Usuario;
use Illuminate\Http\Request;

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

}
