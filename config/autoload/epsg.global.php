<?php

declare(strict_types=1);

return [
    // See https://epsg.io/
    'epsg' => [
        'EPSG:31370' => [
            'name'  => 'Belgian Lambert 1972',
            'proj4' => '+proj=lcc +lat_1=51.16666723333333 +lat_2=49.8333339 +lat_0=90 +lon_0=4.367486666666666 +x_0=150000.013 +y_0=5400088.438 +ellps=intl +towgs84=-106.869,52.2978,-103.724,0.3366,-0.457,1.8422,-1.2747 +units=m +no_defs',
        ],
        'EPSG:3812' => [
            'name'  => 'Belgian Lambert 2008',
            'proj4' => '+proj=lcc +lat_1=49.83333333333334 +lat_2=51.16666666666666 +lat_0=50.797815 +lon_0=4.359215833333333 +x_0=649328 +y_0=665262 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        ],
        'EPSG:25831' => [
            'name'  => 'UTM Zone 31N',
            'proj4' => '+proj=utm +zone=31 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        ],
        'EPSG:25832' => [
            'name'  => 'UTM Zone 32N',
            'proj4' => '+proj=utm +zone=32 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
        ],
    ],
];
