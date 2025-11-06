<?php

namespace App\Models;

use App\Models\UsuariosMejoras;
use Illuminate\Database\Eloquent\Model;

class Usuario extends Model
{
    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function sesiones() {
        return $this->hasMany(Sesiones::class, 'id');
    }

    public function uusuariosMejoras() {
        return $this->hasMany(UsuariosMejoras::class, 'id_usuario');
    }
    
}
