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
        // Telescope is a dev dependency — production images are built with
        // composer --no-dev, so the class won't exist there
        if ($this->app->environment('local') && class_exists(\Laravel\Telescope\TelescopeServiceProvider::class)) {
            $this->app->register(\Laravel\Telescope\TelescopeServiceProvider::class);
            $this->app->register(TelescopeServiceProvider::class);
        }
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
