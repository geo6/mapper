<?php

declare(strict_types=1);

namespace App\Middleware;

use Blast\BaseUrl\BaseUrlMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddlewareHtml extends AbstractAuthMiddleware
{
    public function unauthorizedResponse(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (is_null($this->auth)) {
            return $handler->handle($request);
        }

        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $basePath = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);

        $redirect = ($basePath !== '/' ? $basePath : '');
        $redirect .= $this->router->generateUri($this->config['redirect']);
        $redirect .= '?'.http_build_query(['c' => $config['custom'] ?? null]);

        return $this->auth
            ->unauthorizedResponse($request)
            ->withHeader('Location', $redirect);
    }
}
