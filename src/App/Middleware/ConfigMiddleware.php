<?php

declare(strict_types=1);

namespace App\Middleware;

use Exception;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\ConfigAggregator\ConfigAggregator;
use Zend\ConfigAggregator\PhpFileProvider;
use Zend\ConfigAggregator\ZendConfigProvider;
use Zend\Expressive\Authentication\UserInterface;
use Zend\Expressive\Session\SessionMiddleware;

class ConfigMiddleware implements MiddlewareInterface
{
    public const CONFIG_ATTRIBUTE = 'config';

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler) : ResponseInterface
    {
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        $available = glob('config/application/public/*', GLOB_ONLYDIR);

        if ($session->has(UserInterface::class)) {
            $user = $session->get(UserInterface::class);

            foreach ($user['roles'] as $role) {
                $directory = 'config/application/roles/'.$role;
                if (file_exists($directory) && is_dir($directory)) {
                    $available = array_merge($available, glob($directory.'/*', GLOB_ONLYDIR));
                }
            }

            $directory = 'config/application/users/'.$user['username'];
            if (file_exists($directory) && is_dir($directory)) {
                $available = array_merge($available, glob($directory.'/*', GLOB_ONLYDIR));
            }
        }

        $query = $request->getQueryParams();

        if (isset($query['c']) && strlen($query['c']) > 0) {
            $enabled = array_values(array_filter($available, function ($directory) use ($query) {
                return basename($directory) === $query['c'];
            }));

            if (count($enabled) > 0) {
                $configProviders = [
                    new PhpFileProvider('config/config.php'),
                    new ZendConfigProvider('config/application/*.{php,ini,xml,json,yaml}'),
                ];

                foreach ($enabled as $directory) {
                    $configProviders[] = new ZendConfigProvider($directory.'/*.{php,ini,xml,json,yaml}');
                }
            } else {
                throw new Exception(sprintf('Unable to find settings for "%s".', $query['c']));
            }
        } else {
            $configProviders = [
                new PhpFileProvider('config/config.php'),
                new ZendConfigProvider('config/application/*.{php,ini,xml,json,yaml}'),
            ];
        }

        $config = (new ConfigAggregator($configProviders))->getMergedConfig();
        $config['custom'] = $query['c'] ?? null;
        $config['available'] = [];

        foreach ($available as $a) {
            $k = basename($a);
            $c = (new ConfigAggregator([new ZendConfigProvider($a.'/*.{php,ini,xml,json,yaml}')]))->getMergedConfig();

            if (isset($c['title']) && strlen($c['title']) > 0) {
                $config['available'][$k] = $c['title'];
            } else {
                $config['available'][$k] = strtoupper($k);
            }
        }
        asort($config['available']);

        return $handler->handle($request->withAttribute(self::CONFIG_ATTRIBUTE, $config));
    }
}
