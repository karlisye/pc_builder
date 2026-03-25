<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
  public function register(Request $request)
  {
    $credentials = $request->validate([
      'name' => ['required', 'string', 'min:3', 'max:100'],
      'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
      'password' => ['required', 'string', 'confirmed', Password::min(8)
        ->mixedCase()->letters()->symbols()->numbers()]
    ]);
    $user = User::create([
      'name' => $credentials['name'],
      'email' => $credentials['email'],
      'password' => Hash::make($credentials['password']),
    ]);

    Auth::login($user);
    $request->session()->regenerate();

    return redirect('/');
  }

  public function login(Request $request)
  {
    $credentials = $request->validate([
      'email' => ['required', 'email'],
      'password' => ['required']
    ]);

    if (Auth::attempt($credentials)) {
      $request->session()->regenerate();
      return redirect('/');
    }

    return back()->withErrors([
      'email' => 'Incorrect credentials'
    ]);
  }

  public function logout(Request $request)
  {
    Auth::logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return redirect('/');
  }
}
