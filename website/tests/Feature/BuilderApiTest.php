<?php

use App\Models\User;

beforeEach(fn() => $this->actingAs(User::factory()->create()));

// response structure
it('successful response has correct structure', function () {
  generate(basePayload(1000))
    ->assertStatus(200)
    ->assertJsonStructure([
      'success',
      'build',
      'total_price',
      'remaining_budget',
      'attempts_needed',
      'error',
      'estimated_minimum_budget',
      'warnings',
      'notes',
    ]);
});

// budget tiers
it('min budget build succeeds', function () {
  generate(basePayload(350))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('min budget office build succeeds', function () {
  generate(basePayload(350, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget build succeeds', function () {
  generate(basePayload(500))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget office build succeeds', function () {
  generate(basePayload(500, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget gaming build succeeds', function () {
  generate(basePayload(500, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('mid budget streaming build succeeds', function () {
  generate(basePayload(500, ['type' => 'streaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget build succeeds', function () {
  generate(basePayload(1501))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget office build succeeds', function () {
  generate(basePayload(1501, ['type' => 'office']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget gaming build succeeds', function () {
  generate(basePayload(1501, ['type' => 'gaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget streaming build succeeds', function () {
  generate(basePayload(1501, ['type' => 'streaming']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});

it('high budget rendering build succeeds', function () {
  generate(basePayload(1501, ['type' => 'rendering']))
    ->assertStatus(200)
    ->assertJsonPath('success', true);
});
