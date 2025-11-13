<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use App\Models\Usuario;
use App\Models\UsuariosMejoras;
use Illuminate\Http\Request;

class NavigationController extends Controller
{
    public function home()
    {
        return view('home');
    }

    public function tienda()
    {
        $mejoras = Mejoras::where('activo', 1)
                        ->orderBy('id')
                        ->get();
        
        // Obtener el usuario (asumiendo que hay un solo usuario por ahora)
        $usuario = Usuario::first();
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

    // Comprar mejora en la tienda
    public function comprarMejora(Request $request)
    {
        $mejoraId = $request->input('mejora_id');
        $nivel = $request->input('nivel', 1); // Por defecto nivel 1
        
        // Obtener el usuario (asumiendo que hay un solo usuario por ahora)
        $usuario = Usuario::first();
        
        if (!$usuario) {
            return response()->json([
                'success' => false,
                'message' => 'Usuario no encontrado'
            ], 404);
        }
        
        // Obtener la mejora
        $mejora = Mejoras::find($mejoraId);
        
        if (!$mejora) {
            return response()->json([
                'success' => false,
                'message' => 'Mejora no encontrada'
            ], 404);
        }
        
        // Determinar el precio según el nivel
        $precio = match($nivel) {
            1 => $mejora->precio_nv1,
            2 => $mejora->precio_nv2,
            3 => $mejora->precio_nv3,
            4 => $mejora->precio_nv4,
            default => $mejora->precio_nv1
        };
        
        // Verificar si el usuario tiene suficientes monedas
        if ($usuario->monedas < $precio) {
            return response()->json([
                'success' => false,
                'message' => 'No tienes suficientes monedas',
                'monedas_actuales' => $usuario->monedas,
                'precio' => $precio
            ], 400);
        }
        
        // Verificar si ya tiene esta mejora
        $yaComprada = UsuariosMejoras::where('id_usuario', $usuario->id)
                                     ->where('id_mejora', $mejoraId)
                                     ->first();
        
        if ($yaComprada) {
            return response()->json([
                'success' => false,
                'message' => 'Ya has comprado esta mejora'
            ], 400);
        }
        
        // Restar las monedas
        $usuario->monedas -= $precio;
        $usuario->monedas_gastadas += $precio;
        $usuario->save();
        
        // Registrar la compra
        $usuarioMejora = new UsuariosMejoras();
        $usuarioMejora->id_usuario = $usuario->id;
        $usuarioMejora->id_mejora = $mejoraId;
        $usuarioMejora->nivel = $nivel;
        $usuarioMejora->save();
        
        return response()->json([
            'success' => true,
            'message' => '¡Mejora comprada con éxito!',
            'mejora' => $mejora->nombre,
            'precio_pagado' => $precio,
            'monedas_restantes' => $usuario->monedas
        ]);
    }

}
