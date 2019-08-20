<?php

declare(strict_types=1);

return [
    'monolog' => [
        'stream' => [
            'path' => 'data/log/error.log',
        ],
        'sentry' => [
            'dsn' => 'https://0fd462c09bcb47449b4f47e01440a9d5@sentry.io/1532400',
        ],
    ],
];
