<?php

declare(strict_types=1);

namespace App\Handler;

use Blast\BaseUrl\BaseUrlMiddleware;
use Laminas\Diactoros\Response\HtmlResponse;
use Laminas\Diactoros\Response\RedirectResponse;
use Mezzio\Authentication\UserInterface;
use Mezzio\Router\RouteResult;
use Mezzio\Router\RouterInterface;
use Mezzio\Session\SessionMiddleware;
use Mezzio\Template\TemplateRendererInterface;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\MiddlewareInterface;
use Psr\Http\Server\RequestHandlerInterface;

class LoginHandler implements MiddlewareInterface
{
    /** @var bool */
    private $authentication;

    /** @var string */
    private $containerName;

    /** @var RouterInterface */
    private $router;

    /** @var TemplateRendererInterface */
    private $template;

    public function __construct(
        RouterInterface $router,
        TemplateRendererInterface $template,
        string $containerName,
        bool $authentication
    ) {
        $this->router = $router;
        $this->template = $template;
        $this->containerName = $containerName;
        $this->authentication = $authentication;
    }

    public function process(ServerRequestInterface $request, RequestHandlerInterface $handler): ResponseInterface
    {
        $route = $request->getAttribute(RouteResult::class);
        $basePath = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);

        $query = $request->getQueryParams();

        if ($this->authentication === false) {
            $redirect = ($basePath !== '/' ? $basePath : '');
            $redirect .= $this->router->generateUri('home');

            return new RedirectResponse($redirect . '?' . http_build_query($query));
        }

        $session = $request->getAttribute(SessionMiddleware::SESSION_ATTRIBUTE);

        if ($session->has(UserInterface::class)) {
            if ($route->getMatchedRouteName() === 'logout') {
                $session->clear();
            }

            $redirect = ($basePath !== '/' ? $basePath : '');
            $redirect .= $this->router->generateUri('home');

            return new RedirectResponse($redirect . '?' . http_build_query($query));
        }

        $error = '';
        if ($request->getMethod() === 'POST') {
            $response = $handler->handle($request);

            if ($response->getStatusCode() !== 302) {
                // $user = $session->get(UserInterface::class);

                $redirect = ($basePath !== '/' ? $basePath : '');
                $redirect .= $this->router->generateUri('home');

                return new RedirectResponse($redirect . '?' . http_build_query($query));
            }

            $error = 'Login failure, please try again.';
        }

        $data = [
            'error' => $error,
        ];

        return new HtmlResponse($this->template->render('app::login', $data));
    }
}
