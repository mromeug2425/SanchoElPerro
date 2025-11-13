<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PreguntasController;
use App\Http\Controllers\Auth\LoginController;
use App\Http\Controllers\NavigationController;
use App\Http\Controllers\Auth\RegisterController;
use App\Http\Controllers\MejorasController;

Route::get('/', [NavigationController::class, 'home'])->name('home');

Route::get('/tienda', [NavigationController::class, 'tienda'])->name('tienda');

Route::get('/niveles', [NavigationController::class, 'niveles'])->name('niveles');

// Juegos
Route::get('/juego1', [NavigationController::class, 'juego1'])->name('juego1');
Route::get('/juego2', [NavigationController::class, 'juego2'])->name('juego2');
Route::get('/juego3', [NavigationController::class, 'juego3'])->name('juego3');
Route::get('/juego4', [NavigationController::class, 'juego4'])->name('juego4');

// Autenticación: login / logout
Route::get('/login', [LoginController::class, 'showLoginForm'])->name('login');
Route::post('/login', [LoginController::class, 'login']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

// Registro
Route::get('/register', [RegisterController::class, 'showRegistrationForm'])->name('register');
Route::post('/register', [RegisterController::class, 'register']);  
Route::post('/register', [RegisterController::class, 'register']);
Route::post('/logout', [LoginController::class, 'logout'])->name('logout')->middleware('auth');

Route::get('preguntas/{id_juego?}', [PreguntasController::class, 'preguntasMostradas']);