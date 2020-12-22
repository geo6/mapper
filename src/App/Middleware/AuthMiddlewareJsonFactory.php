<?php

declare(strict_types=1);

namespace App\Middleware;

use Mezzio\Authentication\AuthenticationInterface;
use Mezzio\Router\RouterInterface;
use Psr\Http\Server\MiddlewareInterface;

class AuthMiddlewareJsonFactory extends AbstractAuthMiddlewareFactory
{
    public function middleware(RouterInterface $router, array $config, ?AuthenticationInterface $authentication = null): MiddlewareInterface
    {
        return new AuthMiddlewareJson($router, $config, $authentication);
    }
}
