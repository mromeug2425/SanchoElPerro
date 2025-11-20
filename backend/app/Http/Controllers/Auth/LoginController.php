<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use App\Models\Sesiones;
use App\Models\Usuario;
use Carbon\Carbon;

class LoginController extends Controller
{
	

	/** Mostrar el formulario de login */
	public function showLoginForm(Request $request)
	{
		try {
			if (Auth::check()) {
				return redirect()->intended('/');
			}
		} catch (\Exception $e) {
			$request->session()->invalidate();
			$request->session()->regenerateToken();
		}

		return view('login');
	}

	/** Procesar el intento de login */
	public function login(Request $request)
	{
		$credentials = $request->validate([
			'username' => ['required', 'string'],
			'password' => ['required'],
		]);

		$user = Usuario::where('nombre_usuario', $credentials['username'])->first();

		if ($user) {
			$openSessions = Sesiones::where('id_usuario', $user->id)
				->whereNull('duracion')
				->get();

			foreach ($openSessions as $openSession) {
				$createdAt = Carbon::parse($openSession->createdAt);
				$now = Carbon::now();
				$durationSeconds = $now->diffInSeconds($createdAt);
				
				// Convert seconds to TIME format (HH:MM:SS)
				$hours = floor($durationSeconds / 3600);
				$minutes = floor(($durationSeconds % 3600) / 60);
				$seconds = $durationSeconds % 60;
				$durationTime = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
				
				// Update the session with calculated duration
				$openSession->duracion = $durationTime;
				$openSession->save();
			}
		}

		$loginCredentials = [
			'nombre_usuario' => $credentials['username'],
			'password' => $credentials['password'],
		];

		if (Auth::attempt($loginCredentials, $request->filled('remember'))) {
			$request->session()->regenerate();

			$sesion = Sesiones::create([
				'id_usuario' => Auth::id(),
				'duracion' => null,
				'monedas_gastadas' => 0,
				'createdAt' => Carbon::now(),
			]);

			session(['current_sesion_id' => $sesion->id]);

			return redirect()->intended('/')->with('success', '¡Bienvenido/a de nuevo!');
		}

		return back()->withErrors(['username' => 'Credenciales inválidas'])->withInput($request->only('username'));
	}

	/** Cerrar sesión */
	public function logout(Request $request)
	{
		$sesionId = session('current_sesion_id');

		if ($sesionId) {
			try {
				$sesion = Sesiones::find($sesionId);
				
				if ($sesion && $sesion->duracion === null) {
					// Calculate duration using Carbon
					$createdAt = Carbon::parse($sesion->createdAt);
					$now = Carbon::now();
					$durationSeconds = $now->diffInSeconds($createdAt);
					
					// Convert seconds to TIME format (HH:MM:SS)
					$hours = floor($durationSeconds / 3600);
					$minutes = floor(($durationSeconds % 3600) / 60);
					$seconds = $durationSeconds % 60;
					$durationTime = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
					
					$sesion->duracion = $durationTime;
					$sesion->save();
				}
			} catch (\Exception $e) {
				Log::error('Error closing session: ' . $e->getMessage());
			}
		}

		Auth::logout();

		$request->session()->invalidate();

		$request->session()->regenerateToken();

		return redirect()->route('home')->with('success', '¡Hasta pronto!');
	}
}

