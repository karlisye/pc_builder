<?php

namespace App\Providers;

use Illuminate\Cache\RateLimiting\Limit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\ServiceProvider;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        RateLimiter::for('builder-generate', function (Request $request) {
            return $this->app->environment('testing')
                ? Limit::none()
                : Limit::perMinute(10)->by($request->user()->id);
        });

        RateLimiter::for('component-browse', function (Request $request) {
            return $this->app->environment('testing')
                ? Limit::none()
                : Limit::perMinute(60)->by($request->user()?->id ?: $request->ip());
        });

        RateLimiter::for('auth', function (Request $request) {
            return $this->app->environment('testing')
                ? Limit::none()
                : Limit::perMinute(5)->by($request->ip());
        });
    }
}
