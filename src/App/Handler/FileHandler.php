<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use FilesystemIterator;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Response\JsonResponse;
use Laminas\Diactoros\Response\TextResponse;
use Laminas\Diactoros\Response\XmlResponse;
use Mezzio\Router\RouteResult;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class FileHandler implements RequestHandlerInterface
{
    /**
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);
        $route = $request->getAttribute(RouteResult::class);

        $identifier = $request->getAttribute('identifier');

        $local = $route->getMatchedRouteName() === 'file.local';

        if ($local === true && isset($config['config']['files'])) {
            $path = self::getLocalFile($config['config']['files'], $identifier);
        } else {
            $path = self::getUploadedFile($identifier);
        }

        if (isset($path) && !is_null($path)) {
            return self::serve($path);
        }

        return new EmptyResponse(404);
    }

    /**
     * Given the path (file or directory) defined in the configuration file(s) parse the
     * directories and files and returns the path matching the given identifier.
     *
     * @param array  $files
     * @param string $identifier
     *
     * @return string|null Path of the file.
     */
    private static function getLocalFile(array $files, string $identifier): ?string
    {
        foreach ($files as $file) {
            if (in_array($file['type'], ['csv', 'geojson', 'gpx', 'kml'], true) && file_exists($file['path'])) {
                if (!is_dir($file['path'])) {
                    $id = filesize($file['path'])
                        .'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', basename($file['path']));

                    if ($identifier === $id) {
                        return $file['path'];
                    }
                } else {
                    $directory = new RecursiveDirectoryIterator(
                        $file['path'],
                        FilesystemIterator::KEY_AS_PATHNAME |
                            FilesystemIterator::CURRENT_AS_FILEINFO |
                            FilesystemIterator::SKIP_DOTS |
                            FilesystemIterator::FOLLOW_SYMLINKS
                    );
                    $iterator = new RecursiveIteratorIterator($directory);

                    foreach ($iterator as $item) {
                        if ($item->isFile()) {
                            $id = filesize($item->getPathName())
                                .'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', basename($item->getPathName()));

                            if ($identifier === $id) {
                                return $item->getPathName();
                            }
                        }
                    }
                }
            }
        }

        return null;
    }

    /**
     * Given the identifier return the path of the uploaded file matching the identifier.
     *
     * @param string $identifier
     *
     * @return string|null Path of the file.
     */
    private static function getUploadedFile(string $identifier): ?string
    {
        $directory = sys_get_temp_dir().'/mapper/'.$identifier;

        if (file_exists($directory) && is_dir($directory)) {
            $glob = glob($directory.'/*.*');

            if ($glob !== false && count($glob) === 1) {
                return $glob[0];
            }
        }

        return null;
    }

    /**
     * Given the path of a file, return a `Response` according to the file MIME type.
     * Only supports text, CSV, (Geo)JSON, and XML files.
     *
     * @param string $path
     *
     * @return Response
     */
    private static function serve(string $path): Response
    {
        $mime = mime_content_type($path);
        $content = file_get_contents($path);

        if ($content === false) {
            return new EmptyResponse(500);
        }

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
