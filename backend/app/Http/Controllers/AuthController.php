<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Password as PasswordBroker;
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

    if (! $this->verifyTurnstile($request->input('turnstile_token'))) {
      return response()->json([
        'message' => __('messages.captcha_failed'),
        'errors' => ['email' => [__('messages.captcha_failed')]],
      ], 422);
    }

    if (Auth::attempt($credentials)) {
      $request->session()->regenerate();
      return response()->json($request->user());
    }

    return response()->json([
      'message' => 'The given data was invalid.',
      'errors' => ['email' => [__('messages.incorrect_credentials')]],
    ], 422);
  }

  public function forgotPassword(Request $request)
  {
    $request->validate([
      'email' => ['required', 'email'],
    ]);

    if (! $this->verifyTurnstile($request->input('turnstile_token'))) {
      return response()->json([
        'message' => __('messages.captcha_failed'),
        'errors' => ['email' => [__('messages.captcha_failed')]],
      ], 422);
    }

    PasswordBroker::sendResetLink($request->only('email'));

    return response()->json(['message' => __('messages.reset_link_sent')]);
  }

  public function resetPassword(Request $request)
  {
    $request->validate([
      'token' => ['required', 'string'],
      'email' => ['required', 'email'],
      'password' => ['required', 'string', 'confirmed', Password::min(8)
        ->mixedCase()->letters()->symbols()->numbers()]
    ]);

    $status = PasswordBroker::reset(
      $request->only('email', 'password', 'password_confirmation', 'token'),
      function (User $user, string $password) {
        $user->forceFill(['password' => Hash::make($password)])->save();
      }
    );

    if ($status !== PasswordBroker::PASSWORD_RESET) {
      return response()->json([
        'message' => __('messages.reset_invalid_token'),
        'errors' => ['email' => [__('messages.reset_invalid_token')]],
      ], 422);
    }

    return response()->json(['message' => __('messages.password_reset_success')]);
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
