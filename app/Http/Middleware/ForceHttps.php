<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\URL;

class ForceHttps
{
    /**
     * Handle an incoming request.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \Closure(\Illuminate\Http\Request): (\Illuminate\Http\Response|\Illuminate\Http\RedirectResponse)  $next
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function handle(Request $request, Closure $next)
    {
        // Force HTTPS if behind a proxy (like Render)
        if (
            $request->header('X-Forwarded-Proto') === 'https' ||
            $request->server('HTTP_X_FORWARDED_PROTO') === 'https' ||
            $request->server('HTTPS') === 'on' ||
            (config('app.url') && str_contains(config('app.url'), 'https://'))
        ) {
            URL::forceScheme('https');
        }

        return $next($request);
    }
}