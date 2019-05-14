<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Container\ContainerInterface;
use Zend\Expressive\Authentication\AuthenticationInterface;
use Zend\Expressive\Authentication\Exception\InvalidConfigException;
use Zend\Expressive\Router\RouterInterface;

/**
 * @see https://github.com/zendframework/zend-expressive-authentication/blob/master/src/AuthenticationMiddlewareFactory.php
 */
class AuthMiddlewareFactory
{
    public function __invoke(ContainerInterface $container) : AuthMiddleware
    {
        $router = $container->get(RouterInterface::class);
        $config = $container->get('config')['authentication'] ?? [];

        if (isset($config['pdo'], $config['pdo']['dsn'])) {
            $authentication = $container->has(AuthenticationInterface::class) ? $container->get(AuthenticationInterface::class) : null;
            if (null === $authentication) {
                throw new InvalidConfigException(
                    'AuthenticationInterface service is missing'
                );
            }
        }

        return new AuthMiddleware($router, $config, $authentication ?? null);
    }
}
