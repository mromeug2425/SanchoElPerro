<?php

namespace App\Http\Controllers;

use App\Models\Mejoras;
use Illuminate\Http\Request;
use App\Models\UsuariosMejoras;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\SesionesJuegosController;

class NavigationController extends Controller
{
    public function home(){
    $usuario = auth()->user();
    
    // Obtener todas las mejoras
    $mejoras = Mejoras::all();
    
    // Obtener las mejoras que el usuario tiene compradas (nivel > 0)
    $mejorasCompradas = [];
    if ($usuario) {
        $mejorasCompradas = UsuariosMejoras::where('id_usuario', $usuario->id)
            ->where('nivel', '>', 0)
            ->pluck('id_mejora')
            ->toArray();
    }
    
    return view('home', compact('mejoras', 'mejorasCompradas'));
}

    public function tienda()
    {
        $usuario = auth()->user();

        // Verificar si el usuario tiene al menos 1 tiquet
        if ($usuario->tiquets_tienda < 1) {
            return redirect()->route('home')->with('error', 'No tienes tiquets para acceder a la tienda.');
        }

        // Restar un tiquet al usuario
        $usuario->tiquets_tienda -= 1;
        $usuario->save();

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
            'monedas' => $monedasUsuario,
            'tiquets_actuales' => $usuario->tiquets_tienda
        ]);
    }

    public function niveles()
    {   
        $sesionesJuegosController = new SesionesJuegosController();
        
        // El juego 1 siempre está desbloqueado
        $juego1Desbloqueado = true;
        
        // El juego 2 se desbloquea si se pasa el juego 2
        $juego2Desbloqueado = true;
        
        // El juego 3 se desbloquea si se pasa el juego 3
        $juego3Desbloqueado = $sesionesJuegosController->buscarVictoria(3);
        
        // El juego 4 se desbloquea si se pasa el juego 4
        $juego4Desbloqueado = $sesionesJuegosController->buscarVictoria(1);

        return view('niveles', compact('juego1Desbloqueado', 'juego2Desbloqueado', 'juego3Desbloqueado', 'juego4Desbloqueado'));
    }    public function register()
    {
        return view('register');
    }

    public function juego1()
    {
        return view('juego1', ['id_juego' => 3]);
    }

    public function juego2()
    {
        return view('juego2', ['id_juego' => 2]);
    }

    public function juego3()
    {
        return view('juego3', ['id_juego' => 1]);
    }

    public function juego4()
    {
        return view('juego4', ['id_juego' => 4]);
    }

}
