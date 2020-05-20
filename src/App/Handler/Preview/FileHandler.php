<?php

declare(strict_types=1);

namespace App\Handler\Preview;

use App\Middleware\ConfigMiddleware;
use Intervention\Image\ImageManagerStatic;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Stream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class FileHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $params = $request->getQueryParams();

        if (!isset($params['path'])) {
            return new EmptyResponse(404);
        }

        if (!isset($config['config']['preview'])) {
            return new EmptyResponse(403);
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
            return new EmptyResponse(403);
        }

        $mime = mime_content_type($path);

        if (preg_match('/^image\/.+$/', $mime) !== 1) {
            return new EmptyResponse(403);
        }

        $stream = new Stream(self::thumbnail($path));

        return (new Response())
            ->withBody($stream)
            ->withStatus(200)
            ->withHeader('Content-Length', (string) $stream->getSize())
            ->withHeader('Content-Type', $mime);
    }

    private static function thumbnail(string $file): string
    {
        $directory = dirname($file);
        $fname = basename($file);
        $thumbnail = sprintf('%s/.thumbnails/%s', $directory, $fname);

        if (file_exists($thumbnail)) {
            $image = ImageManagerStatic::make($thumbnail);
        } else {
            $image = ImageManagerStatic::make($file);
            $image->orientate();

            if ($image->height() > $image->width()) {
                $image->heighten(640, function ($constraint) {
                    $constraint->upsize();
                });
            } else {
                $image->widen(640, function ($constraint) {
                    $constraint->upsize();
                });
            }

            if (!file_exists(dirname($thumbnail)) || !is_dir(dirname($thumbnail))) {
                mkdir(dirname($thumbnail), 0777, true);
            }

            $image->save($thumbnail);
        }

        return $thumbnail;
    }
}
