<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Container\ContainerInterface;
use Psr\Http\Server\MiddlewareInterface;
use Zend\Expressive\Template\TemplateRendererInterface;

class UIMiddlewareFactory
{
    public function __invoke(ContainerInterface $container): MiddlewareInterface
    {
        $template = $container->get(TemplateRendererInterface::class);

        return new UIMiddleware($template);
    }
}
