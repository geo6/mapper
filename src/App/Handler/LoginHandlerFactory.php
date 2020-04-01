<?php

declare(strict_types=1);

namespace App\Handler;

use Psr\Container\ContainerInterface;
use Psr\Http\Server\MiddlewareInterface;
use Mezzio\Router\RouterInterface;
use Mezzio\Template\TemplateRendererInterface;

class LoginHandlerFactory
{
    public function __invoke(ContainerInterface $container): MiddlewareInterface
    {
        $router = $container->get(RouterInterface::class);
        $template = $container->get(TemplateRendererInterface::class);

        $authentication = isset($container->get('config')['authentication']['pdo']);

        return new LoginHandler($router, $template, get_class($container), $authentication);
    }
}
