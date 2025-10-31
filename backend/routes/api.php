<?php


use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;

Route::prefix('auth')->group(function () {
    Route::post('/register', 'App\Http\Controllers\AuthController@register');
    Route::post('/login', 'App\Http\Controllers\AuthController@login');
    
    Route::middleware('jwt.auth')->group(function () {
        Route::post('/logout', 'App\Http\Controllers\AuthController@logout');
        Route::post('/refresh', 'App\Http\Controllers\AuthController@refresh');
        Route::get('/me', 'App\Http\Controllers\AuthController@me');
    });
});

// Rota protegida de exemplo
Route::middleware('jwt.auth')->get('/user', function (Request $request) {
    return $request->user();
});