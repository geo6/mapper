<?php

/**
 * This file generated by Mezzio\Tooling\Factory\ConfigInjector.
 *
 * Modifications should be kept at a minimum, and restricted to adding or
 * removing factory definitions; other dependency types may be overwritten
 * when regenerating this file via mezzio-tooling commands.
 */

declare(strict_types=1);

return [
    'dependencies' => [
        'factories' => [
            App\Handler\HomeHandler::class => App\Handler\HomeHandlerFactory::class,
            App\Handler\LoginHandler::class => App\Handler\LoginHandlerFactory::class,
            App\Middleware\AuthMiddleware::class => App\Middleware\AuthMiddlewareFactory::class,
            App\Middleware\UIMiddleware::class => App\Middleware\UIMiddlewareFactory::class,
        ],
    ],
];
