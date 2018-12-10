<?php

declare(strict_types=1);

return [
    'geocoder' => [
        'providers' => [
            'geo6' => [
                'reverse' => false,
                'title'   => 'GEO-6',
            ],
            'geo6-poi' => [
                'reverse' => false,
                'title'   => 'GEO-6 (POI)',
            ],
            'bpost' => [
                'reverse' => false,
            ],
            'geopunt' => [
                'title' => 'Informatie Vlaanderen Geopunt',
            ],
            'urbis' => [
                'title' => 'CIRB/CIBG UrbIS',
            ],
            'spw' => [
                'title' => 'Service Public de Wallonie',
            ],
            'nominatim' => [
                'title'       => 'OpenStreetMap Nominatim',
                'attribution' => '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors.',
            ],
        ],
    ],
];
