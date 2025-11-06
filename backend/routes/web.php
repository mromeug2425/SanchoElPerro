<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\NavigationController;

Route::get('/', function () {
    return view('welcome');
});

Route::get('/tienda', [NavigationController::class, 'tienda'])->name('tienda');
