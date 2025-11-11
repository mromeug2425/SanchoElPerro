<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Sesiones;
use Carbon\Carbon;

class RegisterController extends Controller
{
    /** Mostrar formulario de registro */
    public function showRegistrationForm(Request $request)
    {
        try {
            if (Auth::check()) {
                return redirect()->intended('/');
            }
        } catch (\Exception $e) {
            $request->session()->invalidate();
            $request->session()->regenerateToken();
        }

        return view('register');
    }

    /** Procesar registro, comprobar si existe el email y auto-login */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'edad' => ['required', 'integer', 'min:1', 'max:120'],
            'trabajo' => ['required', 'string', 'max:255'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // Comprobar si ya existe usuario con ese nombre
        if (Usuario::where('nombre_usuario', $data['name'])->exists()) {
            return back()->withErrors(['name' => 'El nombre de usuario ya está en uso'])->withInput();
        }

        // Crear usuario 
        $user = new Usuario();
        $user->nombre_usuario = $data['name'];
        $user->edad = $data['edad'];
        $user->trabajo = $data['trabajo'];
        $user->password = Hash::make($data['password']);
        $user->tiquets_tienda = 0;
        $user->monedas = 0;
        $user->monedas_gastadas = 0;
        $user->save();

        // Auto-login -
        Auth::login($user);
        $request->session()->regenerate();

        // Crear una nueva sesión usando Eloquent
        $currentDateTime = Carbon::now()->toDateTimeString();
        
        $sesion = new Sesiones();
        $sesion->id_usuario = $user->id;
        $sesion->duracion = null;
        $sesion->monedas_gastadas = 0;
        // Guardar como string en formato SQL Server DATETIME (Y-m-d H:i:s)
        $sesion->createdAt = $currentDateTime;
        
        $sesion->timestamps = false;
        $sesion->save();

        session([
            'current_sesion_id' => $sesion->id,
            'sesion_created_at' => $currentDateTime,
        ]);

        return view('home');
    }
}
