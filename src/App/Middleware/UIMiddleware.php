<?php

declare(strict_types=1);

namespace App\Middleware;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Expressive\Authentication\UserInterface;
use Zend\Expressive\Session\SessionMiddleware;
use Zend\Expressive\Template\TemplateRendererInterface;

class UIMiddleware implements MiddlewareInterface
{
    private $template;

    public function __construct(TemplateRendererInterface $template)
    {
        $this->template = $template;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        if ($session->has(UserInterface::class)) {
            $user = $session->get(UserInterface::class);

            $this->template->addDefaultParam(
                $this->template::TEMPLATE_ALL,
                'user',
                $user
            );
        }

        $this->template->addDefaultParam(
            $this->template::TEMPLATE_ALL,
            'config',
            [
                'available'   => $config['available'] ?? [],
                'custom'      => $config['custom'] ?? null,
                'title'       => $config['title'] ?? null,
                'description' => $config['description'] ?? null,
            ]
        );

        return $handler->handle($request);
    }
}
