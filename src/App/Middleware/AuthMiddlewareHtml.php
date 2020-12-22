<?php

declare(strict_types=1);

namespace App\Middleware;

use Blast\BaseUrl\BaseUrlMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AuthMiddlewareHtml extends AbstractAuthMiddleware
{
    public function response(ServerRequestInterface $request): ResponseInterface
    {
        $basePath = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);

        $redirect = ($basePath !== '/' ? $basePath : '');
        $redirect .= $this->router->generateUri($this->config['redirect']);

        return $this->auth
            ->unauthorizedResponse($request)
            ->withHeader('Location', $redirect);
    }
}
