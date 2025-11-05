<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class UsuariosMejoras extends Model
{
    //
    protected $table = 'usuarios_mejoras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function mejoras() {
        return $this->hasOne(Mejoras::class, 'id');
    }

    public function usuarios() {
        return $this->belongsTo(Usuario::class, 'id');
    }
}
