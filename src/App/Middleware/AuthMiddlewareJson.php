<?php

declare(strict_types=1);

namespace App\Middleware;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class AuthMiddlewareJson extends AbstractAuthMiddleware
{
    public function unauthorizedResponse(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        if (is_null($this->auth)) {
            return $handler->handle($request);
        }

        $error = [
            'code'    => 403,
            'message' => 'Access denied.',
        ];

        return new JsonResponse(['error' => $error], $error['code']);
    }
}
