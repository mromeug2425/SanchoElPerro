<?php

namespace App\Models;


use App\Models\Juegos;
use App\Models\SesionesJuegosPreguntas;
use Illuminate\Database\Eloquent\Model;

class Preguntas extends Model
{
    //
    protected $table = 'preguntas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function preguntasAJuegos() {
        return $this->belongsTo(Juegos::class, 'id');
    }

    public function preguntasASesionJuegosPreguntas() {
        return $this->belongsTo(SesionesJuegosPreguntas::class, 'id_pregunta');
    }
}
