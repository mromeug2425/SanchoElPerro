<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use Illuminate\Http\Request;
use App\Models\UsuariosMejoras;
use Illuminate\Support\Facades\Log;

class NavigationController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function tienda()
    {
        $usuario = auth()->user();
        
        $mejoras = Mejoras::where('activo', 1)
                        ->orderBy('id')
                        ->get();
        
        $mejorasConPrecio = $mejoras->map(function($mejora) use ($usuario) {
            $usuarioMejora = UsuariosMejoras::where('id_usuario', $usuario->id)
                                            ->where('id_mejora', $mejora->id)
                                            ->first();
            
            $nivelActual = $usuarioMejora ? $usuarioMejora->nivel : 0;
            $siguienteNivel = $nivelActual + 1;
            
            $campoPrecios = 'precio_nv' . $siguienteNivel;
            $mejora->precio_actual = $mejora->$campoPrecios ?? 0;
            $mejora->nivel_actual = $nivelActual;
            $mejora->es_nivel_maximo = $nivelActual >=4;

            if($mejora->es_nivel_maximo){
                $mejora->precio_actual = 0; 
            } else {
                $campoPrecios = 'precio_nv' . $siguienteNivel;
                $mejora->precio_actual = $mejora-> $campoPrecios ?? 0;
            }
            
            return $mejora;
        });

        $monedasUsuario = $usuario->monedas;

        $nombreUsuario = $usuario->nombre_usuario;

        return view('tienda', [
            'mejoras' => $mejorasConPrecio,
            'nombreUsuario' => $nombreUsuario,
            'monedas' => $monedasUsuario
        ]);
    }

    public function niveles()
    {
        return view('niveles');
    }

    public function register()
    {
        return view('register');
    }

    public function juego1()
    {
        return view('juego1');
    }

    public function juego2()
    {
        return view('juego2');
    }

    public function juego3()
    {
        return view('juego3');
    }

    public function juego4()
    {
        return view('juego4');
    }

}
