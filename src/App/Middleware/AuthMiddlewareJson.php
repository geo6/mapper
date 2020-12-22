<?php

declare(strict_types=1);

namespace App\Middleware;

use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;

class AuthMiddlewareJson extends AbstractAuthMiddleware
{
    public function response(ServerRequestInterface $request): ResponseInterface
    {
        $error = [
            'code'    => 403,
            'message' => 'Access denied.',
        ];

        return new JsonResponse(['error' => $error], $error['code']);
    }
}
