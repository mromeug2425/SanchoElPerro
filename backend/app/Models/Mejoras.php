<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mejoras extends Model
{
    //
    protected $table = 'mejoras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    public function usuariosMejoras() {
        return $this->belongsTo(UsuariosMejoras::class, 'id_mejora');
    }

}
