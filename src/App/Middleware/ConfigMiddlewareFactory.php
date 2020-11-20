<?php

declare(strict_types=1);

namespace App\Middleware;

use Mezzio\Template\TemplateRendererInterface;
use Psr\Container\ContainerInterface;
use Psr\Http\Server\MiddlewareInterface;

class ConfigMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): MiddlewareInterface
    {
        $template = $container->get(TemplateRendererInterface::class);

        return new ConfigMiddleware($template);
    }
}
