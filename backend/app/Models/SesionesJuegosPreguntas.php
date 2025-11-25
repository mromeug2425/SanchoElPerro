<?php

namespace App\Models;

use App\Models\Preguntas;
use Illuminate\Database\Eloquent\Model;

class SesionesJuegosPreguntas extends Model
{
    //
    protected $table = 'sesiones_juegos_preguntas';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function preguntas(){
        return $this->hasOne(Preguntas::class, 'id_pregunta');
    }

    public function sesionesJuegos() {
        return $this->belongsTo(SesionesJuegos::class, 'id_sesion_juego');
    }

    protected $fillable = [
        'id',
    'id_sesion_juegos',
    'id_pregunta',
    'acertada',
    'respuesta_usuario',
    'respuesta_correcta',
    'opciones' 
    ];

    protected $casts = [
    'acertada' => 'boolean',
    'opciones' => 'array'  // Convierte automáticamente entre JSON y array
];
}
