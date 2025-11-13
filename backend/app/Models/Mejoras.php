<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Mejoras extends Model
{
    protected $table = 'mejoras';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'nombre',
        'activo',
        'img',
        'precio_nv1',
        'img_n2',
        'precio_nv2',
        'img_n3',
        'precio_nv3',
        'img_n4',
        'precio_nv4'
    ];

    // Relación: una mejora puede tener muchos usuarios_mejoras
    public function usuariosMejoras() {
        return $this->hasMany(UsuariosMejoras::class, 'id_mejora');
    }
}
