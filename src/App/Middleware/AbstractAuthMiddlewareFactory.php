<?php

declare(strict_types=1);

namespace App\Middleware;

use Mezzio\Authentication\AuthenticationInterface;
use Mezzio\Authentication\Exception\InvalidConfigException;
use Mezzio\Router\RouterInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Server\MiddlewareInterface;

/**
 * @see https://github.com/mezzio/mezzio-authentication/blob/master/src/AuthenticationMiddlewareFactory.php
 */
abstract class AbstractAuthMiddlewareFactory
{
    public abstract function middleware(RouterInterface $router, array $config, ?AuthenticationInterface $authentication = null): MiddlewareInterface;

    public function __invoke(ContainerInterface $container): MiddlewareInterface
    {
        $router = $container->get(RouterInterface::class);
        $config = $container->get('config')['authentication'] ?? [];

        if (isset($config['pdo'], $config['pdo']['dsn'])) {
            $authentication = $container->has(AuthenticationInterface::class) ?
                $container->get(AuthenticationInterface::class) : null;
            if (null === $authentication) {
                throw new InvalidConfigException(
                    'AuthenticationInterface service is missing'
                );
            }
        }

        return $this->middleware($router, $config, $authentication ?? null);
    }
}
