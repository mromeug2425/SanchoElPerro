<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuariosMejoras extends Model
{
    protected $table = 'usuarios_mejoras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_mejora',
        'nivel'
    ];

    // Relación: una mejora de usuario pertenece a una mejora
    public function mejora() {
        return $this->belongsTo(Mejoras::class, 'id_mejora');
    }

    // Relación: una mejora de usuario pertenece a un usuario
    public function usuario() {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}
