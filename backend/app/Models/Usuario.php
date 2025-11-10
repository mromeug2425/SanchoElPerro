<?php

namespace App\Models;

use App\Models\UsuariosMejoras;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;
use Illuminate\Foundation\Auth\User as Authenticatable;

class Usuario extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $table = 'usuarios';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre_usuario',
        'password',
        'edad',
        'trabajo',
        'tiquets_tienda',
        'monedas',
        'monedas_gastadas',
    ];

    protected $hidden = [
        'password',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];

    public function username()
    {
        return 'nombre_usuario';
    }

    public function getAuthIdentifier()
    {
        return $this->id;
    }

    public function getAuthIdentifierName()
    {
        return 'id';
    }

    public function sesiones() {
        return $this->hasMany(Sesiones::class, 'id');
    }

    public function usuariosMejoras() {
        return $this->hasMany(UsuariosMejoras::class, 'id_usuario');
    }
    
}
