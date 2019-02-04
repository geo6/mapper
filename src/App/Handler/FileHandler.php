<?php

declare(strict_types=1);

namespace App\Handler;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\EmptyResponse;
use Zend\Diactoros\Response\JsonResponse;
use Zend\Diactoros\Response\TextResponse;
use Zend\Diactoros\Response\XmlResponse;

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
                    case 'text/plain':
                    case 'text/csv':
                        return new TextResponse($content);

                    case 'application/json':
                        return new JsonResponse(json_decode($content));

                    case 'application/xml':
                    case 'text/xml':
                        return new XmlResponse($content);
                }
            }
        }

        return new EmptyResponse(404);
    }
}
