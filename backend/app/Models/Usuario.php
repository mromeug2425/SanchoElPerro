<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function sesiones() {
        return $this->hasMany(Sesiones::class, 'id');
    }

    public function usuarios_mejoras() {
        return $this->belongsToMany(Mejoras::class, 'usuarios_mejoras', 'id_usuario', 'id_mejora');
    }
    
}
