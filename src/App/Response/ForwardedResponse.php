<?php

declare(strict_types=1);

namespace App\Response;

use InvalidArgumentException;
use Psr\Http\Message\StreamInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\InjectContentTypeTrait;
use Zend\Diactoros\Stream;

class ForwardedResponse extends Response
{
    use InjectContentTypeTrait;

    public function __construct(
        StreamInterface $stream,
        int $status = 200,
        array $headers = []
    ) {
        parent::__construct($stream, $status, $headers);
    }
}
