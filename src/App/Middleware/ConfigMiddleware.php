<?php

declare(strict_types=1);

namespace App\Middleware;

use App\ConfigProvider;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\ConfigAggregator\ConfigAggregator;
use Zend\ConfigAggregator\ZendConfigProvider;

class ConfigMiddleware implements MiddlewareInterface
{
    public const CONFIG_ATTRIBUTE = 'config';

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        $config = new ConfigAggregator([
            ConfigProvider::class,
            new ZendConfigProvider('./composer.json'),
            new ZendConfigProvider('./config/application/*.{php,ini,xml,json,yaml}'),
        ]);

        return $handler->handle($request->withAttribute(self::CONFIG_ATTRIBUTE, $config->getMergedConfig()));
    }
}
