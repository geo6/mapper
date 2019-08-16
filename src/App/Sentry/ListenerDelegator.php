<?php

namespace App\Sentry;

use App\Sentry\Listener\Listener;
use Interop\Container\ContainerInterface;
use Zend\ServiceManager\Factory\DelegatorFactoryInterface;

class ListenerDelegator implements DelegatorFactoryInterface
{
    /**
     * A factory that creates delegates of a given service.
     *
     * @param ContainerInterface $container
     * @param string             $name
     * @param callable           $callback
     * @param null|array         $options
     *
     * @throws \Psr\Container\ContainerExceptionInterface
     * @throws \Psr\Container\NotFoundExceptionInterface
     *
     * @return \Zend\Stratigility\Middleware\ErrorHandler
     */
    public function __invoke(ContainerInterface $container, $name, callable $callback, array $options = null)
    {
        $listener = $container->get(Listener::class);

        /** @var \Zend\Stratigility\Middleware\ErrorHandler $errorHandler */
        $errorHandler = $callback();

        if ($listener->isEnabled() === true) {
            $errorHandler->attachListener($listener);
        }

        return $errorHandler;
    }
}
