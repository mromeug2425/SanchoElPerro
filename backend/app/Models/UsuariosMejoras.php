<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuariosMejoras extends Model
{
    //
    protected $table = 'usuarios_mejoras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id_usuario',
        'id_mejora',
        'nivel'
    ];

    public function mejoras() {
        return $this->hasOne(Mejoras::class, 'id_usuarios');
    }

    public function usuarios() {
        return $this->belongsTo(Usuario::class, 'id');
    }

    public function usuariosMejoras(){
        return $this->hasMany(UsuariosMejoras::class, 'id_usuario');
    }

}
