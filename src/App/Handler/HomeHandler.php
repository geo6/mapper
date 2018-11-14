<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
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

        $defaultBaselayer = [
            'osm' => [
                'name' => 'OpenStreetMap',
                'url' => 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png',
                'attributions' => [
                    '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
                ],
                'maxZoom' => 19,
            ],
        ];

        $data = [
            'baselayers' => $config['baselayers'] ?? $defaultBaselayer,
            'layers'     => $config['layers'] ?? [],
            'version'    => $config['version'],
        ];

        return new HtmlResponse($this->template->render('app::home', $data));
    }
}
