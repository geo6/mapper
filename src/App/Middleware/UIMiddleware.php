<?php

declare(strict_types=1);

namespace App\Middleware;

use Mezzio\Authentication\UserInterface;
use Mezzio\Session\SessionMiddleware;
use Mezzio\Template\TemplateRendererInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class UIMiddleware implements MiddlewareInterface
{
    /** @var TemplateRendererInterface */
    private $template;

    public function __construct(TemplateRendererInterface $template)
    {
        $this->template = $template;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $projects = array_map(function (string $path): string {
            return basename($path);
        }, glob('config/application/public/*') ?: []);

        if ($session->has(UserInterface::class)) {
            $user = $session->get(UserInterface::class);

            $this->template->addDefaultParam(
                $this->template::TEMPLATE_ALL,
                'user',
                $user
            );

            $projects = AbstractAuthMiddleware::getProjects($user['username'], $user['roles']);
        }

        $this->template->addDefaultParam(
            $this->template::TEMPLATE_ALL,
            'ui',
            [
                'projects'    => $projects,
                'custom'      => $config['custom'],
                'title'       => $config['config']['title'] ?? null,
                'description' => $config['config']['description'] ?? null,
            ]
        );

        return $handler->handle($request);
    }
}
