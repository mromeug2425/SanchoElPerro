<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use App\Models\Usuario;

class RegisterController extends Controller
{
    /** Mostrar formulario de registro */
    public function showRegistrationForm()
    {
        if (Auth::check()) {
            return redirect()->intended('/dashboard');
        }

        return view('register');
    }

    /** Procesar registro, comprobar si existe el email y auto-login */
    public function register(Request $request)
    {
        $data = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'password' => ['required', 'confirmed', 'min:8'],
        ]);

        // Comprobar si ya existe usuario con ese email
        if (Usuario::where('email', $data['email'])->exists()) {
            return back()->withErrors(['email' => 'El usuario ya está registrado'])->withInput();
        }

        // Crear usuario 
        $user = new Usuario();
        $user->name = $data['name'];
        $user->email = $data['email'];
        $user->password = Hash::make($data['password']);
        $user->save();

        // Auto-login
        Auth::login($user);
        $request->session()->regenerate();

        return redirect()->intended('/dashboard');
    }
}
