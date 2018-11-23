<?php

declare(strict_types=1);

return [
    'geocoder' => [
        'providers' => [
            'bpost' => [
                'reverse' => false,
            ],
            'geopunt' => [
                'title' => 'Informatie Vlaanderen Geopunt'
            ],
            'urbis' => [
                'title' => 'CIRB/CIBG UrbIS'
            ],
            'nominatim' => [
                'title' => 'OpenStreetMap Nominatim',
                'attribution' => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
            ],
        ],
    ],
];
