<?php

namespace App\Http\Controllers;

use App\Models\Sesiones;
use Illuminate\Http\Request;
use App\Models\SesionesJuegos;

class SesionesJuegosController extends Controller
{

    public function buscarSessionesUsuario(){

        $sesionUsuario = Sesiones::where('id_usuario', auth()->user()->id)
                        ->pluck('id');
        
        return $sesionUsuario;
    }

    public function buscarVictoria($id_juego){

        $sesionUsuario = $this->buscarSessionesUsuario();

        $juegoGanado = SesionesJuegos::whereIn('id_sesion', $sesionUsuario)
                        ->where('id_juego', $id_juego) 
                        ->where('ganado', 1)
                        ->get();

        $victoriaJuego =  !$juegoGanado->isEmpty();

        return $victoriaJuego;
        
    }

    public function buscarVictoriaMultiples($ids_juegos){

        $sesionUsuario = $this->buscarSessionesUsuario();

        // Si recibe un solo ID, lo convierte en array
        $juegos = is_array($ids_juegos) ? $ids_juegos : [$ids_juegos];

        $juegoGanado = SesionesJuegos::whereIn('id_sesion', $sesionUsuario)
                        ->whereIn('id_juego', $juegos) 
                        ->where('ganado', 1)
                        ->get();

        $victoriaJuego =  !$juegoGanado->isEmpty();

        return $victoriaJuego;
        
    }
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show(SesionesJuegos $sesionesJuegos)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(SesionesJuegos $sesionesJuegos)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, SesionesJuegos $sesionesJuegos)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(SesionesJuegos $sesionesJuegos)
    {
        //
    }
}
