<?php

namespace App\Models;

use App\Models\UsuariosMejoras;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as ModeAuthenticatable;

class Usuario extends ModeAuthenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function sesiones() {
        return $this->hasMany(Sesiones::class, 'id');
    }

    public function usuariosMejoras() {
        return $this->hasMany(UsuariosMejoras::class, 'id_usuario');
    }
    
}
