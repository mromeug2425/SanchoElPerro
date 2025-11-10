<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
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
				

				$totalSeconds = abs($createdAt->diffInSeconds($now));
				
				$hours = intval($totalSeconds / 3600);
				$minutes = intval(($totalSeconds % 3600) / 60);
				$seconds = intval($totalSeconds % 60);
				
				if ($hours > 23) {
					$durationString = '23:59:59';
				} else {
					$durationString = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
				}
				
				$openSession->duracion = $durationString;
				$openSession->save();
			}

			// Crear una nueva sesión usando Eloquent con unguarded para forzar los valores
			$currentDateTime = Carbon::now()->toDateTimeString();
			
			Log::info('Creating session', [
				'currentDateTime' => $currentDateTime,
				'userId' => $userId,
			]);
			
			$sesion = new Sesiones();
			$sesion->id_usuario = $userId;
			$sesion->duracion = null;
			$sesion->monedas_gastadas = 0;
			$sesion->timestamps = false;
			
			// Forzar el setAttribute para createdAt
			$sesion->setAttribute('createdAt', $currentDateTime);
			$sesion->save();
			
			// Verificar que se guardó correctamente
			$sesion->refresh();
			Log::info('Session created', [
				'id' => $sesion->id,
				'createdAt_saved' => $sesion->createdAt,
			]);

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
				// Asegurar que ambas fechas usan el mismo formato
				$createdAt = Carbon::createFromFormat('Y-m-d H:i:s', substr($sesion->createdAt, 0, 19));
				$now = Carbon::now();
				
				// DEBUG: Ver los valores
				Log::info('Logout Debug', [
					'sesion_id' => $sesion->id,
					'createdAt_raw' => $sesion->createdAt,
					'createdAt' => $createdAt->toDateTimeString(),
					'now' => $now->toDateTimeString(),
				]);
				
				// Calcular la duración total en segundos (absoluto para evitar negativos)
				$totalSeconds = abs($createdAt->diffInSeconds($now));
				
				Log::info('Duration Calculation', [
					'totalSeconds' => $totalSeconds,
				]);
				
				// Convertir a horas, minutos y segundos
				$hours = intval($totalSeconds / 3600);
				$minutes = intval(($totalSeconds % 3600) / 60);
				$seconds = intval($totalSeconds % 60);
				
				Log::info('Time Components', [
					'hours' => $hours,
					'minutes' => $minutes,
					'seconds' => $seconds,
				]);
				
				// SQL Server TIME solo soporta hasta 23:59:59
				if ($hours > 23) {
					$durationString = '23:59:59';
				} else {
					$durationString = sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
				}
				
				Log::info('Final Duration', ['duration' => $durationString]);
				
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

