<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;
use App\Models\Sesiones;
use App\Models\UsuariosMejoras;
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

        $existingUser = Usuario::where('nombre_usuario', $data['name'])->first();
        if ($existingUser) {
            return back()->withErrors(['name' => 'Este nombre de usuario ya está en uso'])->withInput();
        }

        try {
            $user = Usuario::create([
                'nombre_usuario' => $data['name'],
                'password' => Hash::make($data['password']),
                'edad' => $data['edad'],
                'trabajo' => $data['trabajo'],
                'tiquets_tienda' => 0,
                'monedas' => 0,
                'monedas_gastadas' => 0,
            ]);

            Auth::login($user);

            $sesion = Sesiones::create([
                'id_usuario' => $user->id,
                'duracion' => null,
                'monedas_gastadas' => 0,
                'createdAt' => Carbon::now(),
            ]);

            session(['current_sesion_id' => $sesion->id]);

            return redirect()->route('home')->with('success', '¡Bienvenido/a a Sancho El Perro!');
        } catch (\Exception $e) {
            return back()->withErrors(['error' => 'Error al crear la cuenta. Por favor, intenta de nuevo.'])->withInput();
        }
    }
}
