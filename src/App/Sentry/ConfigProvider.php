<?php

namespace App\Sentry;

use Zend\Stratigility\Middleware\ErrorHandler;

class ConfigProvider
{
    /**
     * Returns the configuration array.
     *
     * To add a bit of a structure, each section is defined in a separate
     * method which returns an array with its configuration.
     */
    public function __invoke(): array
    {
        return [
            'dependencies' => $this->getDependencies(),
        ];
    }

    /**
     * Returns the container dependencies.
     */
    private function getDependencies(): array
    {
        return [
            'invokables' => [],
            'factories' => [
                Listener\Listener::class => Listener\ListenerFactory::class,
            ],
            'delegators' => [
                ErrorHandler::class => [
                    ListenerDelegator::class,
                ],
            ],
        ];
    }
}
