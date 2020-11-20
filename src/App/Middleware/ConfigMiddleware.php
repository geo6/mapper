<?php

declare(strict_types=1);

namespace App\Middleware;

use Exception;
use Laminas\ConfigAggregator\ConfigAggregator;
use Laminas\ConfigAggregator\LaminasConfigProvider;
use Laminas\ConfigAggregator\PhpFileProvider;
use Laminas\Diactoros\Response\HtmlResponse;
use Mezzio\Session\SessionMiddleware;
use Mezzio\Template\TemplateRendererInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ConfigMiddleware implements MiddlewareInterface
{
    public const CONFIG_ATTRIBUTE = 'config';

    /** @var TemplateRendererInterface */
    private $template;

    public function __construct(TemplateRendererInterface $template)
    {
        $this->template = $template;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        $query = $request->getQueryParams();

        $projects = [
            'public' => array_map(function (string $path): string {
                return basename($path);
            }, glob('config/application/public/*') ?: []),
            'roles' => array_map(function (string $path): string {
                return basename($path);
            }, glob('config/application/roles/*/*') ?: []),
            'users' => array_map(function (string $path): string {
                return basename($path);
            }, glob('config/application/users/*/*') ?: []),
        ];

        $data = [
            'global'   => self::getGlobalConfig(),
            'custom'   => null,
            'config'   => null,
        ];

        if (isset($query['c']) && strlen($query['c']) > 0) {
            $public = in_array($query['c'], $projects['public'], true);
            $roles = in_array($query['c'], $projects['roles'], true);
            $users = in_array($query['c'], $projects['users'], true);

            if (!$public && !$roles && !$users) {
                return new HtmlResponse($this->template->render('error::404', ['message' => sprintf('Unable to find configuration file for "%s".', $query['c'])]), 404);
            }

            if (!($public xor $roles xor $users)) {
                throw new Exception(sprintf('Multiple configuration files found for "%s".', $query['c']));
            }

            $data['custom'] = $query['c'];
            $data['config'] = self::getCustomConfig($query['c']);
        }

        return $handler->handle($request->withAttribute(self::CONFIG_ATTRIBUTE, $data));
    }

    private static function getGlobalConfig(): array
    {
        return (new ConfigAggregator([
            new PhpFileProvider('config/config.php'),
            new LaminasConfigProvider('config/application/*.{php,ini,xml,json,yaml,yml}'),
        ]))->getMergedConfig();
    }

    private static function getCustomConfig(string $custom): array
    {
        $glob = array_merge(
            glob('config/application/public/*') ?: [],
            glob('config/application/{roles,users}/*/*', GLOB_BRACE) ?: []
        );

        $directory = array_values(array_filter($glob, function ($directory) use ($custom): bool {
            return basename($directory) === $custom;
        }));

        if (count($directory) === 0) {
            throw new Exception(sprintf('Unable to find configuration file for "%s".', $custom));
        }

        return (new ConfigAggregator([
            new LaminasConfigProvider($directory[0] . '/*.{php,ini,xml,json,yaml,yml}'),
        ]))->getMergedConfig();
    }
}
