<?php

namespace App\Sentry\Listener;

use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Sentry;
use Throwable;

class Listener
{
    /** @var array */
    private $config;

    /** @var bool */
    private $enabled;

    public function __construct(array $config, bool $enabled = true)
    {
        $this->config = $config;
        $this->enabled = $enabled;
    }

    public function __invoke(Throwable $error, ServerRequestInterface $request, ResponseInterface $response): void
    {
        Sentry\init($this->config);
        Sentry\captureException($error);
    }

    public function isEnabled(): bool
    {
        return $this->enabled;
    }
}
