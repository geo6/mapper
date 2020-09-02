<?php

declare(strict_types=1);

use App\Middleware\AuthMiddleware;
use Mezzio\Application;
use Mezzio\MiddlewareFactory;
use Psr\Container\ContainerInterface;

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
 *     Mezzio\Router\Route::HTTP_METHOD_ANY,
 *     'contact'
 * );
 */

return function (Application $app, MiddlewareFactory $factory, ContainerInterface $container): void {
    $app->get('/', [AuthMiddleware::class, App\Handler\HomeHandler::class], 'home');

    $app->get('/file/{identifier}[/{action:download}]', [AuthMiddleware::class, App\Handler\FileHandler::class], 'file');
    $app->get('/file/local/{identifier}[/{action:download}]', [AuthMiddleware::class, App\Handler\FileHandler::class], 'file.local');
    $app->get('/geocoder/{provider}/address/{address}', [AuthMiddleware::class, App\Handler\Geocoder\AddressHandler::class], 'geocoder.address');
    $app->get('/geocoder/{provider}/reverse/{longitude}/{latitude}', [AuthMiddleware::class, App\Handler\Geocoder\ReverseHandler::class], 'geocoder.reverse');
    $app->get('/preview/{action:info|file}', [AuthMiddleware::class, App\Handler\PreviewHandler::class], 'preview');
    $app->get('/proxy', [AuthMiddleware::class, App\Handler\ProxyHandler::class], 'proxy');

    $app->post('/upload', [AuthMiddleware::class, App\Handler\UploadHandler::class], 'upload');

    $app->route('/login', [
        App\Handler\LoginHandler::class,
        AuthMiddleware::class,
    ], ['GET', 'POST'], 'login');
    $app->get('/logout', App\Handler\LoginHandler::class, 'logout');
};
