<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\App;

class SetLocaleFromHeader
{
  public function handle(Request $request, Closure $next)
  {
    $locale = $request->header('X-Locale');

    if (in_array($locale, config('app.supported_locales', ['en', 'lv']))) {
      App::setLocale($locale);
    }

    return $next($request);
  }
}
