<?php

declare(strict_types=1);

namespace App\Handler\Preview;

use App\Middleware\ConfigMiddleware;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use stdClass;

class InfoHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $params = $request->getQueryParams();

        if (!isset($params['path'])) {
            return new JsonResponse(new stdClass(), 404);
        }

        if (!isset($config['config']['preview'])) {
            return new JsonResponse(new stdClass(), 403);
        }

        $path = preg_replace('/^file:\/\//', '', $params['path']);
        $path = realpath($path);

        $allow = is_array($config['config']['preview']) ? $config['config']['preview'] : [$config['config']['preview']];
        $allow = array_filter(
            array_map(
                function (string $path) {
                    $path = realpath($path);

                    if ($path !== false) {
                        $path = rtrim($path, '/');

                        return $path;
                    }

                    return null;
                },
                $allow
            ),
            function (string $path): bool {
                return !is_null($path);
            }
        );

        if ($path === false || !in_array(dirname($path), $allow, true)) {
            return new JsonResponse([
                'path'    => $path,
                'dirname' => dirname($path),
                'allow'   => $allow,
            ], 403);
        }

        if (!file_exists($path) || !is_readable($path)) {
            return new JsonResponse(new stdClass(), 404);
        }

        $mime = mime_content_type($path);

        setlocale(LC_ALL, 'C.UTF-8'); // Required for path containing special characters

        if (preg_match('/^image\/.+$/', $mime) === 1) {
            $exif = exif_read_data($path, 'ANY_TAG', true);

            return new JsonResponse([
                'path'     => $path,
                'filename' => basename($path),
                'mime'     => $mime,
                'exif'     => $exif ?: null,
            ]);
        }

        return new JsonResponse([
            'path'     => $path,
            'filename' => basename($path),
            'mime'     => $mime,
        ]);
    }
}
