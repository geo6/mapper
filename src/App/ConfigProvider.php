<?php

declare(strict_types=1);

namespace App;

/**
 * The configuration provider for the App module.
 *
 * @see https://docs.zendframework.com/zend-component-installer/
 */
class ConfigProvider
{
    /**
     * Returns the configuration array.
     *
     * To add a bit of a structure, each section is defined in a separate
     * method which returns an array with its configuration.
     */
    public function __invoke() : array
    {
        return [
            'dependencies' => $this->getDependencies(),
            'templates'    => $this->getTemplates(),
        ];
    }

    /**
     * Returns the container dependencies.
     */
    public function getDependencies() : array
    {
        return [
            'invokables' => [
                Handler\FileHandler::class             => Handler\FileHandler::class,
                Handler\Geocoder\AddressHandler::class => Handler\Geocoder\AddressHandler::class,
                Handler\Geocoder\ReverseHandler::class => Handler\Geocoder\ReverseHandler::class,
                Handler\ProxyHandler::class            => Handler\ProxyHandler::class,
                Handler\UploadHandler::class           => Handler\UploadHandler::class,
            ],
            'factories'  => [
                Middleware\AuthMiddleware::class => Middleware\AuthMiddlewareFactory::class,
                Middleware\UIMiddleware::class   => Middleware\UIMiddlewareFactory::class,

                Handler\HomeHandler::class  => Handler\HomeHandlerFactory::class,
                Handler\LoginHandler::class => Handler\LoginHandlerFactory::class,
            ],
        ];
    }

    /**
     * Returns the templates configuration.
     */
    public function getTemplates() : array
    {
        return [
            'paths' => [
                'app'     => ['templates/app'],
                'error'   => ['templates/error'],
                'layout'  => ['templates/layout'],
            ],
        ];
    }
}
