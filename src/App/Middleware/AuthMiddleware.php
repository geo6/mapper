<?php

declare (strict_types = 1);

namespace App\Middleware;

use Blast\BaseUrl\BaseUrlMiddleware;
use Exception;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Expressive\Authentication\AuthenticationInterface;
use Zend\Expressive\Authentication\AuthenticationMiddleware;
use Zend\Expressive\Authentication\DefaultUser;
use Zend\Expressive\Router\RouterInterface;

/**
 * @see https://github.com/zendframework/zend-expressive-authentication/blob/master/src/Authentication.php
 */
class AuthMiddleware implements MiddlewareInterface
{
    /** @var AuthenticationInterface */
    protected $auth;

    /** @var array */
    protected $config;

    public function __construct(array $config, AuthenticationInterface $auth, RouterInterface $router)
    {
        $this->auth = $auth;
        $this->config = $config;
        $this->router = $router;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        $basePath = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);

        $query = $request->getQueryParams();

        // No authentication configured
        if (!isset($this->config['pdo'], $this->config['pdo']['dsn']) &&
            strlen($this->config['pdo']['dsn'])) {
            return $handler->handle($request);
        }

        // Public configuration NOT protected
        if (isset($query['c']) && strlen($query['c']) > 0) {
            $public = array_map(function (string $path) {
                return basename($path);
            }, glob('config/application/public/*'));
        }
        if ((!isset($query['c']) || in_array($query['c'], $public)) && $this->config['protect_public'] === false) {
            return $handler->handle($request);
        }

        // Protected configuration
        $user = $this->auth->authenticate($request);
        if (null !== $user) {
            $projects = self::getProjects($user->getIdentity(), $user->getRoles());

            if (!isset($query['c']) || in_array($query['c'], $projects)) {
                return $handler->handle($request->withAttribute(UserInterface::class, $user));
            } else {
                throw new Exception(sprintf('Access denied for "%s".', $query['c']));
            }
        }

        $redirect = ($basePath !== '/' ? $basePath : '');
        $redirect .= $this->router->generateUri($this->config['redirect']);

        return $this->auth->unauthorizedResponse($request)->withHeader('Location', $redirect.'?'.http_build_query($query));
    }

    public static function getProjects(string $username, array $roles = []) : array
    {
        $projects = array_map(function (string $path) {
            return basename($path);
        }, glob('config/application/public/*'));

        foreach ($roles as $role) {
            $projects = array_merge(
                $projects,
                array_map(function (string $path) {
                    return basename($path);
                }, glob("config/application/roles/$role/*"))
            );
        }

        $projects = array_merge(
            $projects,
            array_map(function (string $path) {
                return basename($path);
            }, glob("config/application/users/$username/*"))
        );

        sort($projects);

        return $projects;
    }
}
