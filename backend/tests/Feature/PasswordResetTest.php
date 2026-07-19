<?php

use App\Models\User;
use App\Notifications\ResetPasswordNotification;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Notification;
use Illuminate\Support\Facades\Password;

function makeOtherUser(): User
{
  return User::updateOrCreate(
    ['email' => 'other@test.com'],
    [
      'name' => 'Other User',
      'password' => bcrypt('Secret123!'),
      'email_verified_at' => now(),
    ]
  );
}

afterEach(function () {
  User::where('email', 'other@test.com')->delete();
  DB::table('password_reset_tokens')->where('email', 'other@test.com')->delete();
});

describe('user route ownership', function () {
  it('rejects profile updates for another user', function () {
    $other = makeOtherUser();

    $this->patchJson("/api/users/{$other->id}", ['name' => 'Hacked Name'])
      ->assertStatus(404);

    expect($other->fresh()->name)->toBe('Other User');
  });

  it('rejects sending a delete confirmation for another user', function () {
    Mail::fake();
    $other = makeOtherUser();

    $this->postJson("/api/users/{$other->id}/delete-confirmation")
      ->assertStatus(404);

    Mail::assertNothingQueued();
  });

  it('allows a user to update their own profile', function () {
    $me = User::where('email', 'test@test.com')->firstOrFail();

    $this->patchJson("/api/users/{$me->id}", ['name' => 'Test User'])
      ->assertStatus(200);
  });
});

describe('forgot password', function () {
  beforeEach(function () {
    config(['services.turnstile.secret' => null]);
  });

  it('sends a reset link to an existing user', function () {
    Notification::fake();
    $other = makeOtherUser();
    auth()->guard('web')->logout();

    $this->postJson('/api/forgot-password', ['email' => 'other@test.com'])
      ->assertStatus(200)
      ->assertJson(['message' => __('messages.reset_link_sent')]);

    Notification::assertSentTo($other, ResetPasswordNotification::class);
  });

  it('returns the same response for unknown emails', function () {
    Notification::fake();
    auth()->guard('web')->logout();

    $this->postJson('/api/forgot-password', ['email' => 'nobody@test.com'])
      ->assertStatus(200)
      ->assertJson(['message' => __('messages.reset_link_sent')]);

    Notification::assertNothingSent();
  });
});

describe('reset password', function () {
  it('resets the password with a valid token', function () {
    $other = makeOtherUser();
    $token = Password::broker()->createToken($other);
    auth()->guard('web')->logout();

    $this->postJson('/api/reset-password', [
      'token' => $token,
      'email' => 'other@test.com',
      'password' => 'NewSecret123!',
      'password_confirmation' => 'NewSecret123!',
    ])->assertStatus(200);

    expect(Hash::check('NewSecret123!', $other->fresh()->password))->toBeTrue();
  });

  it('rejects an invalid reset token', function () {
    $other = makeOtherUser();
    auth()->guard('web')->logout();

    $this->postJson('/api/reset-password', [
      'token' => 'not-a-real-token',
      'email' => 'other@test.com',
      'password' => 'NewSecret123!',
      'password_confirmation' => 'NewSecret123!',
    ])->assertStatus(422);

    expect(Hash::check('Secret123!', $other->fresh()->password))->toBeTrue();
  });

  it('rejects a weak new password', function () {
    $other = makeOtherUser();
    $token = Password::broker()->createToken($other);
    auth()->guard('web')->logout();

    $this->postJson('/api/reset-password', [
      'token' => $token,
      'email' => 'other@test.com',
      'password' => 'weak',
      'password_confirmation' => 'weak',
    ])->assertStatus(422);
  });
});
