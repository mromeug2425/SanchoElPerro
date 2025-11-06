<?php

namespace App\Models;


use App\Models\Juegos;
use App\Models\SesionesJuegos;
use Illuminate\Database\Eloquent\Model;

class Preguntas extends Model
{
    //
    protected $table = 'preguntas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function juego() {
        return $this->belongsTo(Juegos::class, 'id_juego');
    }

    public function sesionesJuegos() {
        return $this->belongsTo(SesionesJuegos::class, 'id_pregunta');
    }
}
