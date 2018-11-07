<?php

declare(strict_types=1);

namespace App\Handler;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\EmptyResponse;
use Zend\Diactoros\Response\JsonResponse;

class FileHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $identifier = $request->getAttribute('identifier');

        $directory = sys_get_temp_dir().'/mapper/'.$identifier;

        if (file_exists($directory) && is_dir($directory)) {
            $glob = glob($directory.'/*.*');

            if (count($glob) === 1 && is_readable($glob[0])) {
                $mime = mime_content_type($glob[0]);
                $content = file_get_contents($glob[0]);

                switch ($mime) {
                    case 'application/json':
                    case 'text/plain':
                        $json = json_decode($content);

                        return new JsonResponse($json);
                }
            }
        }

        return new EmptyResponse(404);
    }
}
