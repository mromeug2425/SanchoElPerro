<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class NavigationController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function tienda()
    {
        Log::info('Usuario autenticado:', ['user' => auth()->user()->nombre_usuario]);
        $mejoras = Mejoras::where('activo', 1)
                        ->orderBy('id')
                        ->get();


        return view('tienda', ['mejoras' => $mejoras, 'nombreUsuario' => auth()->user()->nombre_usuario]);
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
