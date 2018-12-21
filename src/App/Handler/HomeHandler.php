<?php

declare(strict_types=1);

namespace App\Handler;

use App\File\GeoJSON;
use App\File\GPX;
use App\File\KML;
use App\Middleware\ConfigMiddleware;
use Blast\BaseUrl\BaseUrlMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\HtmlResponse;
use Zend\Expressive\Router;
use Zend\Expressive\Template;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;
use FilesystemIterator;

class HomeHandler implements RequestHandlerInterface
{
    private $containerName;

    private $router;

    private $template;

    public function __construct(
        Router\RouterInterface $router,
        Template\TemplateRendererInterface $template = null,
        string $containerName
    ) {
        $this->router = $router;
        $this->template = $template;
        $this->containerName = $containerName;
    }

    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);
        $server = $request->getServerParams();

        $baseUrl = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);
        $baseUrl = rtrim($baseUrl, '/').'/';

        $data = [
            'baselayers'        => self::getLayers($config['baselayers'] ?? []),
            'baseUrl'           => $baseUrl,
            'geocoderProviders' => self::getProviders($config['geocoder']['providers'] ?? []),
            'layers'            => self::getLayers($config['layers'] ?? []),
            'files'             => self::getFiles($config['files'] ?? []),
            'https'             => isset($server['HTTPS']) && strlen($server['HTTPS']) > 0,
        ];

        return new HtmlResponse($this->template->render('app::home', $data));
    }

    private static function getProviders(array $configProviders) : array
    {
        $providers = [];

        foreach ($configProviders as $key => $provider) {
            $providers[$key] = [
                'attribution' => $provider['attribution'] ?? null,
                'reverse'     => $provider['reverse'] ?? true,
                'title'       => $provider['title'] ?? $key,
            ];
        }

        return $providers;
    }

    private static function getBaselayers(array $configBaselayers) : array
    {
        $baselayers = $configBaselayers;

        if (count($baselayers) === 0) {
            $baselayers = [
                'osm' => [
                    'name'         => 'OpenStreetMap',
                    'url'          => 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                    'attributions' => [
                        '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
                    ],
                    'maxZoom' => 19,
                ],
            ];
        }

        return $baselayers;
    }

    private static function getLayers(array $configLayers) : array
    {
        $layers = array_map(
            function ($layer) {
                unset($layer['auth']);

                return $layer;
            },
            $configLayers
        );

        return $layers;
    }

    private static function getFiles(array $configFiles) : array
    {
        $files = [
            'geojson' => [],
            'gpx'     => [],
            'kml'     => [],
        ];

        foreach ($configFiles as $file) {
            if (in_array($file['type'], ['geojson', 'gpx', 'kml']) && file_exists($file['path']) && is_readable($file['path'])) {
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
                            $f = self::getFile($file['type'], $item->getPathName());

                            if (!is_null($f)) {
                                $files[$file['type']][] = $f;
                            }
                        }
                    }
                } else {
                    $f = self::getFile($file['type'], $file['path']);

                    if (!is_null($f)) {
                        $files[$file['type']][] = $f;
                    }
                }
            }
        }

        return $files;
    }

    private static function getFile(string $type, string $path) : ?array
    {
        switch ($type) {
            case 'geojson':
                $file = new GeoJSON($path);
                break;

            case 'gpx':
                $file = new GPX($path);
                break;

            case 'kml':
                $file = new KML($path);
                break;

            default:
                $file = null;
                break;
        }

        if (!is_null($file) && $file->checkType() === true) {
            $info = $file->getInfo();

            return [
                'identifier'  => uniqid(),
                'name'        => basename($path),
                'title'       => $info->title,
                'description' => $info->description,
            ];
        }

        return null;
    }
}
