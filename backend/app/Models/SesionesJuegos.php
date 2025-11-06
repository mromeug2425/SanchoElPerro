<?php

namespace App\Models;


use Illuminate\Database\Eloquent\Model;

class SesionesJuegos extends Model
{
    //
    protected $table = 'sesiones_juegos';
    protected $primaryKey = 'id';
    public $timestamps = false; 

    public function sesionesJuegosPreguntas(){
        return $this->hasMany(SesionesJuegosPreguntas::class, 'id_sesion_juegos');
    }      

    public function juegos(){
        return $this->hasOne(Juegos::class, 'id');
    }

    public function sesiones(){
        return $this->belongsTo(Sesiones::class, 'id');
    }

}