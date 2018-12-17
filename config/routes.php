<?php

declare(strict_types=1);

use Psr\Container\ContainerInterface;
use Zend\Expressive\Application;
use Zend\Expressive\Authentication\AuthenticationMiddleware;
use Zend\Expressive\MiddlewareFactory;

/*
 * Setup routes with a single request method:
 *
 * $app->get('/', App\Handler\HomePageHandler::class, 'home');
 * $app->post('/album', App\Handler\AlbumCreateHandler::class, 'album.create');
 * $app->put('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.put');
 * $app->patch('/album/:id', App\Handler\AlbumUpdateHandler::class, 'album.patch');
 * $app->delete('/album/:id', App\Handler\AlbumDeleteHandler::class, 'album.delete');
 *
 * Or with multiple request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class, ['GET', 'POST', ...], 'contact');
 *
 * Or handling all request methods:
 *
 * $app->route('/contact', App\Handler\ContactHandler::class)->setName('contact');
 *
 * or:
 *
 * $app->route(
 *     '/contact',
 *     App\Handler\ContactHandler::class,
 *     Zend\Expressive\Router\Route::HTTP_METHOD_ANY,
 *     'contact'
 * );
 */
return function (Application $app, MiddlewareFactory $factory, ContainerInterface $container) : void {
    $loadAuthenticationMiddleware = function ($middleware) use ($container) {
        if (isset($container->get('config')['authentication']['pdo'])) {
            return [
                AuthenticationMiddleware::class,
                $middleware,
            ];
        }

        return $middleware;
    };

    $app->get('/', $loadAuthenticationMiddleware(App\Handler\HomeHandler::class), 'home');

    $app->get('/file/{identifier}', $loadAuthenticationMiddleware(App\Handler\FileHandler::class), 'file');
    $app->get('/geocoder/{provider}/address/{address}', $loadAuthenticationMiddleware(App\Handler\Geocoder\AddressHandler::class), 'geocoder.address');
    $app->get('/geocoder/{provider}/reverse/{longitude}/{latitude}', $loadAuthenticationMiddleware(App\Handler\Geocoder\ReverseHandler::class), 'geocoder.reverse');
    $app->get('/proxy', $loadAuthenticationMiddleware(App\Handler\ProxyHandler::class), 'proxy');

    $app->post('/upload', $loadAuthenticationMiddleware(App\Handler\UploadHandler::class), 'upload');

    $app->route('/login', [
        App\Handler\LoginHandler::class,
        AuthenticationMiddleware::class,
    ], ['GET', 'POST'], 'login');
    $app->get('/logout', $loadAuthenticationMiddleware(App\Handler\LoginHandler::class), 'logout');
};
