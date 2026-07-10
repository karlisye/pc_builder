<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class AuthController extends Controller
{
  private function verifyTurnstile(?string $token): bool
  {
    $secret = config('services.turnstile.secret');

    if (! $secret) {
      return true;
    }

    if (! $token) {
      return false;
    }

    $response = Http::asForm()->post('https://challenges.cloudflare.com/turnstile/v0/siteverify', [
      'secret' => $secret,
      'response' => $token,
    ])->json();

    return $response['success'] ?? false;
  }

  public function register(Request $request)
  {
    $credentials = $request->validate([
      'name' => ['required', 'string', 'min:3', 'max:100'],
      'email' => ['required', 'string', 'email', 'unique:users', 'max:255'],
      'password' => ['required', 'string', 'confirmed', Password::min(8)
        ->mixedCase()->letters()->symbols()->numbers()]
    ]);

    if (! $this->verifyTurnstile($request->input('turnstile_token'))) {
      return response()->json([
        'message' => __('messages.captcha_failed'),
        'errors' => ['email' => [__('messages.captcha_failed')]],
      ], 422);
    }

    $user = User::create([
      'name' => $credentials['name'],
      'email' => $credentials['email'],
      'password' => Hash::make($credentials['password']),
    ]);


    Auth::login($user);
    $request->session()->regenerate();
    $user->sendEmailVerificationNotification();

    return response()->json($user, 201);
  }

  public function verify(Request $request)
  {
    $user = User::findOrFail($request->route('id'));

    if (! hash_equals(sha1($user->getEmailForVerification()), (string) $request->route('hash'))) {
      abort(403);
    }

    if (! $user->hasVerifiedEmail()) {
      $user->markEmailAsVerified();
    }

    return redirect(config('app.frontend_url') . '/email-verified');
  }

  public function resendVerification(Request $request)
  {
    if ($request->user()->hasVerifiedEmail()) {
      return response()->json(['message' => __('messages.already_verified')], 400);
    }

    $request->user()->sendEmailVerificationNotification();

    return response()->json(['message' => __('messages.verification_sent')]);
  }

  public function login(Request $request)
  {
    $credentials = $request->validate([
      'email' => ['required', 'email'],
      'password' => ['required']
    ]);

    Log::debug('validation passed');

    if (! $this->verifyTurnstile($request->input('turnstile_token'))) {
      return response()->json([
        'message' => __('messages.captcha_failed'),
        'errors' => ['email' => [__('messages.captcha_failed')]],
      ], 422);
    }

    if (Auth::attempt($credentials)) {
      $request->session()->regenerate();
      Log::debug('session regenerated');
      return response()->json($request->user());
    }

    return response()->json([
      'message' => 'The given data was invalid.',
      'errors' => ['email' => [__('messages.incorrect_credentials')]],
    ], 422);
  }

  public function logout(Request $request)
  {
    Auth::guard('web')->logout();
    $request->session()->invalidate();
    $request->session()->regenerateToken();
    return response()->json(['message' => 'Logged out']);
  }

  public function user(Request $request)
  {
    return response()->json($request->user());
  }
}
