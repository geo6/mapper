<?php

declare(strict_types=1);

namespace App\Handler;

use App\File;
use App\Middleware\ConfigMiddleware;
use Blast\BaseUrl\BaseUrlMiddleware;
use FilesystemIterator;
use Laminas\Diactoros\Response\HtmlResponse;
use Mezzio\Router\RouterInterface;
use Mezzio\Template\TemplateRendererInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use RecursiveDirectoryIterator;
use RecursiveIteratorIterator;

class HomeHandler implements RequestHandlerInterface
{
    /** @var string */
    private $containerName;

    /** @var RouterInterface */
    private $router;

    /** @var TemplateRendererInterface */
    private $template;

    public function __construct(
        RouterInterface $router,
        TemplateRendererInterface $template,
        string $containerName
    ) {
        $this->router = $router;
        $this->template = $template;
        $this->containerName = $containerName;
    }

    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);
        $server = $request->getServerParams();

        $query = $request->getQueryParams();

        $baseUrl = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);
        $baseUrl = rtrim($baseUrl, '/').'/';

        $map = [
            'center' => $config['config']['map']['center'] ?? [0, 0],
            'zoom'   => $config['config']['map']['zoom'] ?? 0,
        ];

        $data = [
            'baselayers'        => self::getBaselayers($config['config']['baselayers'] ?? $config['global']['baselayers'] ?? []),
            'baseUrl'           => $baseUrl,
            'geocoderProviders' => self::getProviders($config['global']['geocoder']['providers'] ?? []),
            'services'          => self::getServices($config['config']['services'] ?? []),
            'files'             => self::getFiles($config['config']['files'] ?? [], $query),
            'https'             => isset($server['HTTPS']) && strlen($server['HTTPS']) > 0,
            'map'               => $map,
            'epsg'              => $config['global']['epsg'] ?? [],
        ];

        return new HtmlResponse($this->template->render('app::home', $data));
    }

    private static function getProviders(array $configProviders): array
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

    private static function getBaselayers(array $configBaselayers): array
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

    private static function getServices(array $configServices): array
    {
        $services = [
            'wms'  => [],
            'wmts' => [],
        ];

        foreach ($configServices as $service) {
            $type = $service['type'];

            if (in_array($type, ['wms', 'wmts'], true)) {
                unset($service['auth'], $service['type']);

                $services[$type][] = $service;
            }
        }

        return $services;
    }

    private static function getFiles(array $configFiles, array $query): array
    {
        $files = [
            'csv'     => [],
            'geojson' => [],
            'gpx'     => [],
            'kml'     => [],
        ];

        foreach ($configFiles as $file) {
            if (in_array($file['type'], ['csv', 'geojson', 'gpx', 'kml'], true) && file_exists($file['path']) && is_readable($file['path'])) {
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
                                $f['default'] = isset($file['default']) ? in_array(basename($item->getPathName()), $file['default'], true) : false;
                                $f['label'] = $file['label'] ?? null;
                                $f['queryable'] = !isset($file['queryable']) || $file['queryable'] === true;

                                if (isset($file['filter'])) {
                                    $f['filter'] = self::applyFilter($file['filter'], $query);
                                }

                                $files[$file['type']][] = $f;
                            }
                        }
                    }
                } else {
                    $f = self::getFile($file['type'], $file['path']);

                    if (!is_null($f)) {
                        $f['default'] = $file['default'] ?? false;
                        $f['label'] = $file['label'] ?? null;
                        $f['queryable'] = !isset($file['queryable']) || $file['queryable'] === true;

                        if (isset($file['filter'])) {
                            $f['filter'] = self::applyFilter($file['filter'], $query);
                        }

                        $files[$file['type']][] = $f;
                    }
                }
            }
        }

        $files = array_map(
            function ($_files) {
                $identifiers = array_column($_files, 'identifier');
                $identifiers = array_unique($identifiers);

                return array_filter(
                    $_files,
                    function ($key, $value) use ($identifiers): bool {
                        return in_array($value, array_keys($identifiers), true);
                    },
                    ARRAY_FILTER_USE_BOTH
                );
            },
            $files
        );

        return $files;
    }

    private static function getFile(string $type, string $path): ?array
    {
        switch ($type) {
            case 'csv':
                $file = new File\CSV($path);
                break;

            case 'geojson':
                $file = new File\GeoJSON($path);
                break;

            case 'gpx':
                $file = new File\GPX($path);
                break;

            case 'kml':
                $file = new File\KML($path);
                break;

            default:
                $file = null;
                break;
        }

        if (!is_null($file) && $file->checkType() === true) {
            $info = $file->getInfo();

            $identifier = filesize($path).'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', basename($path));

            return [
                'identifier'   => $identifier,
                'name'         => basename($path),
                'title'        => $info['title'] ?? null,
                'description'  => $info['description'] ?? null,
                'legend'       => $info['legend'] ?? null,
            ];
        }

        return null;
    }

    private static function applyFilter(array &$filters, array $query): array
    {
        foreach ($filters as $key => &$value) {
            if (preg_match('/(%(.+?)%)/', $value, $matches) === 1) {
                if (isset($query[$matches[2]])) {
                    $value = str_replace($matches[1], $query[$matches[2]], $value);
                } else {
                    unset($filters[$key]);
                }
            }
        }

        return $filters;
    }
}
