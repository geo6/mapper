<?php

namespace App\Sentry\Listener;

use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\FactoryInterface;

class ListenerFactory implements FactoryInterface
{
    public function __invoke(ContainerInterface $container, $requestedName, array $options = null)
    {
        $config = $container->get('config');

        $sentry = $config['sentry'] ?? [];
        $debug = $config['debug'] ?? false;

        $enabled = ($debug !== true && isset($sentry['dsn']));

        return new Listener($sentry, $enabled);
    }
}
