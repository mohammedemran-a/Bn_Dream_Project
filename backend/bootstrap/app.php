<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        //
        $middleware->web(append: [
            // أمثلة إن أردت إضافة شيء مثل:
            // \App\Http\Middleware\VerifyCsrfToken::class,
        ]);
          $middleware->alias([
        'auth' => \Laravel\Sanctum\Http\Middleware\EnsureFrontendRequestsAreStateful::class,
        'permission' => \App\Http\Middleware\CheckPermission::class,
    ]);
        
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();


