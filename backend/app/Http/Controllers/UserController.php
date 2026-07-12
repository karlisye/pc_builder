<?php

namespace App\Http\Controllers;

use App\Mail\DeleteAccountMail;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Arr;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\URL;
use Illuminate\Validation\Rules\Password;

class UserController extends Controller
{
  public function update(Request $request, User $user): JsonResponse
  {
    if ($request->user()->id !== $user->id) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $validated = $request->validate([
      'name' => ['sometimes', 'string', 'min:3', 'max:255'],
      'description' => ['sometimes', 'nullable', 'string'],
      'password' => ['sometimes', 'required_with:new_password', 'string'],
      'new_password' => ['sometimes', 'string', 'confirmed', Password::min(8)->symbols()->letters()->numbers()->mixedCase()],
    ]);

    if (isset($validated['new_password'])) {
      if (!Hash::check($request->password, $user->password)) {
        return response()->json([
          'message' => __('messages.current_password_incorrect'),
          'errors' => ['password' => [__('messages.current_password_incorrect')]],
        ], 422);
      }

      $validated['password'] = bcrypt($validated['new_password']);
    }

    $user->update(Arr::except($validated, ['new_password', 'new_password_confirmation']));

    return response()->json($user, 200);
  }

  public function sendDeleteConfirmation(Request $request, User $user): JsonResponse
  {
    if ($request->user()->id !== $user->id) {
      return response()->json(['error' => __('messages.not_found')], 404);
    }

    $url = URL::temporarySignedRoute(
      'account.delete.verify',
      now()->addMinutes(60),
      ['id' => $user->id, 'hash' => sha1($user->email)],
    );

    Mail::to($user->email)->locale(app()->getLocale())->queue(new DeleteAccountMail($url));

    return response()->json(['message' => __('messages.delete_confirmation_sent')]);
  }

  public function confirmDelete(Request $request): RedirectResponse
  {
    $user = User::findOrFail($request->route('id'));

    if (! hash_equals(sha1($user->email), (string) $request->route('hash'))) {
      abort(403);
    }

    $user->delete();

    return redirect(config('app.frontend_url') . '/account-deleted');
  }
}
