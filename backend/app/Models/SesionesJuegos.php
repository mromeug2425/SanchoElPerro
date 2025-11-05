<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SesionesJuegos extends Model
{
    //
    protected $table = 'sesiones_juegos';
    protected $primaryKey = 'id';
    public $timestamps = false; 
}
