<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Juegos extends Model
{
    //
    protected $table = 'juegos';
    protected $primaryKey = 'id';
    public $timestamps = false; 

    public function preguntas(){
        return $this->hasMany(Preguntas::class, 'id_juego');
    }

    public function sesionesJuegos(){
        return $this->belongsToMany(SesionesJuegos::class, 'id_juego');
    }
}
