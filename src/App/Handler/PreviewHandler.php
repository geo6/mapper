<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use Exception;
use Intervention\Image\ImageManagerStatic;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Response\JsonResponse;
use Laminas\Diactoros\Stream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class PreviewHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $action = $request->getAttribute('action');

        $params = $request->getQueryParams();

        try {
            if (!isset($params['path'])) {
                throw new Exception('Parameter "path" missing.', 404);
            }

            if (!isset($config['config']['preview'])) {
                throw new Exception('Parameter "preview" missing in your configuration.', 403);
            }

            $path = preg_replace('/^file:\/\//', '', $params['path']);
            $path = realpath($path);

            $allow = is_array($config['config']['preview']) ?
                $config['config']['preview'] : [$config['config']['preview']];

            if ($path === false || self::checkAccess($path, $allow) !== true) {
                throw new Exception('Access denied.', 403);
            }

            if (!file_exists($path) || !is_readable($path)) {
                throw new Exception('File does not exists or is not readable.', 404);
            }
        } catch (Exception $e) {
            $code = $e->getCode();
            if ($e->getCode() === 0) {
                $code = 500;
            }

            if (!isset($path) || $path == false) {
                $path = $params['path'];
            }

            switch ($action) {
                case 'info':
                    return self::responseInfo($path, $code, $e->getMessage());
                case 'file':
                default:
                    return self::responseFile($path, $code, $e->getMessage());
            }
        }

        switch ($action) {
            case 'info':
                return self::responseInfo($path);
            case 'file':
            default:
                return self::responseFile($path);
        }
    }

    private static function responseInfo(string $path, int $code = null, string $message = null): ResponseInterface
    {
        setlocale(LC_ALL, 'C.UTF-8'); // Required for path containing special characters

        $data = [
            'path'     => $path,
            'filename' => basename($path),
        ];

        if (is_null($code) && is_null($message)) {
            if (file_exists($path)) {
                $mime = mime_content_type($path);

                $data['mime'] = $mime;

                if ($mime !== false && preg_match('/^image\/.+$/', $mime) === 1) {
                    $exif = @exif_read_data($path, 'ANY_TAG', true);

                    $data['exif'] = $exif ?: null;

                    if (!is_null($data['exif'])) {
                        foreach ($data['exif'] as &$section) {
                            $section = array_filter($section, function ($key): bool {
                                $keep =
                                    preg_match('/^UndefinedTag:/', $key) !== 1 &&
                                    !in_array($key, ['UserComment'], true);

                                return $keep;
                            }, ARRAY_FILTER_USE_KEY);
                        }
                    }
                }
            } else {
                $data['mime'] = null;
            }

            return new JsonResponse($data, 200);
        }

        $data['error'] = $message;

        return new JsonResponse($data, $code ?? 500);
    }

    private static function responseFile(string $path, int $code = null, string $message = null): ResponseInterface
    {
        if (is_null($code) && is_null($message)) {
            $mime = mime_content_type($path);

            if ($mime !== false && preg_match('/^image\/.+$/', $mime) === 1) {
                $stream = new Stream(self::thumbnail($path));
            } else {
                $stream = new Stream($path);
            }

            return (new Response())
                ->withBody($stream)
                ->withStatus(200)
                ->withHeader('Content-Length', (string) $stream->getSize())
                ->withHeader('Content-Type', $mime ?: 'application/octet-stream');
        }

        return new EmptyResponse($code ?? 500);
    }

    private static function checkAccess(string $path, array $allow): bool
    {
        $directories = array_filter(
            array_map(
                function (string $path): ?string {
                    $path = realpath($path);

                    if ($path !== false) {
                        $path = rtrim($path, '/');

                        return $path;
                    }

                    return null;
                },
                $allow
            ),
            function ($path): bool {
                return !is_null($path);
            }
        );

        $access = false;
        while ($access === false && $path !== '/') {
            $path = dirname($path);

            $access = in_array($path, $directories, true);
        }

        return $access;
    }

    private static function thumbnail(string $file): string
    {
        setlocale(LC_ALL, 'C.UTF-8'); // Required for path containing special characters

        $directory = dirname($file);
        $fname = basename($file);
        $filename = pathinfo($file, PATHINFO_FILENAME);
        $thumbnail = sprintf('%s/.thumbnails/%s', $directory, $fname);

        if (file_exists($thumbnail) && self::checkMD5($file) === true) {
            $image = ImageManagerStatic::make($thumbnail);
        } else {
            $image = ImageManagerStatic::make($file);
            $image->orientate();

            if ($image->height() > $image->width()) {
                $image->heighten(640, function ($constraint): void {
                    $constraint->upsize();
                });
            } else {
                $image->widen(640, function ($constraint): void {
                    $constraint->upsize();
                });
            }

            if (!file_exists(dirname($thumbnail)) || !is_dir(dirname($thumbnail))) {
                mkdir(dirname($thumbnail), 0777, true);
            }

            $image->save($thumbnail);

            $md5 = sprintf('%s/.thumbnails/%s.md5', $directory, $filename);
            file_put_contents($md5, md5_file($file));
        }

        return $thumbnail;
    }

    private static function checkMD5(string $path): bool
    {
        $directory = dirname($path);
        $fname = pathinfo($path, PATHINFO_FILENAME);

        $md5 = sprintf('%s/.thumbnails/%s.md5', $directory, $fname);

        if (!file_exists($md5)) {
            return false;
        }

        return md5_file($path) === file_get_contents($md5);
    }
}
