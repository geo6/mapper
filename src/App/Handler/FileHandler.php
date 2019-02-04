<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use FilesystemIterator;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\EmptyResponse;
use Zend\Diactoros\Response\JsonResponse;
use Zend\Diactoros\Response\TextResponse;
use Zend\Diactoros\Response\XmlResponse;
use Zend\Expressive\Router\RouteResult;

class FileHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);
        $route = $request->getAttribute(RouteResult::class);

        $identifier = $request->getAttribute('identifier');

        $local = $route->getMatchedRouteName() === 'file.local';

        if ($local === true && isset($config['files'])) {
            foreach ($config['files'] as $file) {
                if (in_array($file['type'], ['csv', 'geojson', 'gpx', 'kml']) && file_exists($file['path']) && is_readable($file['path'])) {
                    if (is_dir($file['path'])) {
                        $directory = new RecursiveDirectoryIterator(
                            $file['path'],
                            FilesystemIterator::KEY_AS_PATHNAME |
                                FilesystemIterator::CURRENT_AS_FILEINFO |
                                FilesystemIterator::SKIP_DOTS |
                                FilesystemIterator::FOLLOW_SYMLINKS
                        );
                        $iterator = new RecursiveIteratorIterator(
                            $directory
                        );

                        foreach ($iterator as $item) {
                            if ($item->isFile()) {
                                $id = filesize($item->getPathName()).'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', basename($item->getPathName()));

                                if ($identifier === $id) {
                                    return self::serve($item->getPathName());
                                }
                            }
                        }
                    } else {
                        $id = filesize($file['path']).'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', basename($file['path']));

                        if ($identifier === $id) {
                            return self::serve($file['path']);
                        }
                    }
                }
            }
        } else {
            $directory = sys_get_temp_dir().'/mapper/'.$identifier;

            if (file_exists($directory) && is_dir($directory)) {
                $glob = glob($directory.'/*.*');

                if (count($glob) === 1 && is_readable($glob[0])) {
                    return self::serve($glob[0]);
                }
            }
        }

        return new EmptyResponse(404);
    }

    private static function serve(string $path) : Response
    {
        $mime = mime_content_type($path);
        $content = file_get_contents($path);

        switch ($mime) {
            case 'text/plain':
            case 'text/csv':
                return new TextResponse($content);

            case 'application/json':
                return new JsonResponse(json_decode($content));

            case 'application/xml':
            case 'text/xml':
                return new XmlResponse($content);
            default:
                return new EmptyResponse(404);
        }
    }
}
