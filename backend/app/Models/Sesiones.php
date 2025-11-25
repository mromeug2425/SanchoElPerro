<?php

namespace App\Models;

use App\Models\Usuario;
use Illuminate\Database\Eloquent\Model;
class Sesiones extends Model
{
    protected $table = 'sesiones';
    protected $primaryKey = 'id';
    public $timestamps = false;

    protected $fillable = [
        'id',
        'id_usuario',
        'duracion',
        'monedas_gastadas',
        'createdAt',
    ];

    protected $casts = [
        'createdAt' => 'datetime',
    ];

    public function sesionJuegos() {
        return $this->hasMany(Usuario::class, 'id_sesion');
    }

    public function usuario() {
        return $this->belongsTo(Usuario::class, 'id_usuario');
    }
}

