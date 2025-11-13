<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use App\Models\Usuario;


class NavigationController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function tienda($id_usuario)
    {
        $mejoras = Mejoras::where('activo', 1)
                        ->orderBy('id')
                        ->get();
        
        // Obtener el usuario (asumiendo que hay un solo usuario por ahora)
        $usuario = Usuario::find($id_usuario);
        $monedas = $usuario ? $usuario->monedas : 0;

        return view('tienda', [
            'mejoras' => $mejoras,
            'monedas' => $monedas
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
