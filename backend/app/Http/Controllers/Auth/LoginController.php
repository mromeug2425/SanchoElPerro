<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Sesiones;
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

		$remember = $request->boolean('remember');

		if (Auth::attempt(['nombre_usuario' => $credentials['username'], 'password' => $credentials['password']], $remember)) {
			$request->session()->regenerate();

			// Obtener el ID del usuario autenticado
			$userId = Auth::user()->id;
			
			// Cerrar cualquier sesión anterior que esté abierta (duracion = null)
			$openSessions = Sesiones::where('id_usuario', $userId)
				->whereNull('duracion')
				->get();

			foreach ($openSessions as $openSession) {
				$createdAt = Carbon::parse($openSession->createdAt);
				$now = Carbon::now();
				$duration = $now->diff($createdAt);
				
				$durationString = sprintf('%02d:%02d:%02d', 
					$duration->h + ($duration->days * 24),
					$duration->i, 
					$duration->s
				);
				
				$openSession->duracion = $durationString;
				$openSession->save();
			}

			// Crear una nueva sesión
			$sesion = new Sesiones();
			$sesion->id_usuario = $userId;
			$sesion->duracion = null;
			$sesion->monedas_gastadas = 0;
			$sesion->createdAt = now();
			$sesion->save();

			session(['current_sesion_id' => $sesion->id]);

			return redirect()->route('home');
		}

		return back()->withErrors(['username' => 'Credenciales inválidas'])->withInput($request->only('username'));
	}

	/** Cerrar sesión */
	public function logout(Request $request)
	{
		$sesionId = session('current_sesion_id');
		
		if ($sesionId) {
			$sesion = Sesiones::find($sesionId);
			
			if ($sesion) {
				$createdAt = Carbon::parse($sesion->createdAt);
				$now = Carbon::now();
				$duration = $now->diff($createdAt);
				
				$durationString = sprintf('%02d:%02d:%02d', 
					$duration->h + ($duration->days * 24),
					$duration->i, 
					$duration->s
				);
				
				$sesion->duracion = $durationString;
				$sesion->save();
			}
			session()->forget('current_sesion_id');
		}

		Auth::logout();

		$request->session()->invalidate();
		$request->session()->regenerateToken();

		return redirect()->route('home');
	}
}

