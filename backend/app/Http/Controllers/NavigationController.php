<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class NavigationController extends Controller
{
    public function tienda()
    {
        return view('tienda');
    }
}
