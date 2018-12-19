<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use Blast\BaseUrl\BaseUrlMiddleware;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\HtmlResponse;
use Zend\Expressive\Router;
use Zend\Expressive\Template;

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

        $defaultBaselayer = [
            'osm' => [
                'name'         => 'OpenStreetMap',
                'url'          => 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'attributions' => [
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
                ],
                'maxZoom' => 19,
            ],
        ];

        $providers = [];
        foreach ($config['geocoder']['providers'] as $key => $provider) {
            $providers[$key] = [
                'attribution' => $provider['attribution'] ?? null,
                'reverse'     => $provider['reverse'] ?? true,
                'title'       => $provider['title'] ?? $key,
            ];
        }

        $layers = array_map(
            function ($layer) {
                unset($layer['auth']);

                return $layer;
            },
            $config['layers'] ?? []
        );

        $data = [
            'baselayers'        => $config['baselayers'] ?? $defaultBaselayer,
            'baseUrl'           => $baseUrl,
            'geocoderProviders' => $providers,
            'layers'            => $layers,
            'https'             => isset($server['HTTPS']) && strlen($server['HTTPS']) > 0,
        ];

        return new HtmlResponse($this->template->render('app::home', $data));
    }
}
