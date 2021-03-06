<?php

declare(strict_types=1);

namespace App\Middleware;

use Exception;
use Mezzio\Authentication\AuthenticationInterface;
use Mezzio\Authentication\UserInterface;
use Mezzio\Router\RouterInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

/**
 * @see https://github.com/mezzio/mezzio-authentication/blob/master/src/Authentication.php
 */
abstract class AbstractAuthMiddleware implements MiddlewareInterface
{
    /** @var AuthenticationInterface|null */
    protected $auth;

    /** @var array */
    protected $config;

    /** @var RouterInterface */
    protected $router;

    public function __construct(RouterInterface $router, array $config, ?AuthenticationInterface $auth = null)
    {
        $this->auth = $auth;
        $this->config = $config;
        $this->router = $router;
    }

    abstract public function unauthorizedResponse(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface;

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $query = $request->getQueryParams();

        if (isset($query['c']) && strlen($query['c']) === 0) {
            unset($query['c']);
        }

        $public = array_map(function (string $path): string {
            return basename($path);
        }, glob('config/application/public/*') ?: []);

        // No authentication configured
        if (is_null($this->auth)) {
            if (isset($query['c']) && !in_array($query['c'], $public, true)) {
                throw new Exception(
                    sprintf(
                        'Access denied for "%s". '
                            .'You need to configure authentication to use roles/users configuration.',
                        $query['c']
                    )
                );
            }

            return $handler->handle($request);
        }

        // Default configuration and public not protected
        if (!isset($query['c']) && $this->config['protect_public'] === false) {
            return $handler->handle($request);
        }

        // Custom public configuration and public not protected
        if (isset($query['c']) && in_array($query['c'], $public, true) && $this->config['protect_public'] === false) {
            return $handler->handle($request);
        }

        // Protected configuration
        $user = $this->auth->authenticate($request);
        if (null !== $user) {
            $projects = self::getProjects($user->getIdentity(), $user->getRoles());

            if (!isset($query['c']) || in_array($query['c'], $projects, true)) {
                return $handler->handle($request->withAttribute(UserInterface::class, $user));
            }
        }

        return $this->unauthorizedResponse($request, $handler);
    }

    public static function getProjects(string $username, iterable $roles = []): array
    {
        $projects = array_map(function (string $path): string {
            return basename($path);
        }, glob('config/application/public/*') ?: []);

        foreach ($roles as $role) {
            $projects = array_merge(
                $projects,
                array_map(function (string $path): string {
                    return basename($path);
                }, glob("config/application/roles/$role/*") ?: [])
            );
        }

        $projects = array_merge(
            $projects,
            array_map(function (string $path): string {
                return basename($path);
            }, glob("config/application/users/$username/*") ?: [])
        );

        sort($projects);

        return $projects;
    }
}
