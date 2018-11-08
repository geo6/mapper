<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use Geocoder\Dumper\GeoJSON;
use Geocoder\Formatter\StringFormatter;
use Geocoder\ProviderAggregator;
use Geocoder\Query\GeocodeQuery;
use Geocoder\StatefulGeocoder;
use Http\Adapter\Guzzle6\Client;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\JsonResponse;

class AddressHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $address = $request->getAttribute('address');
        $provider = $request->getAttribute('provider');

        $adapter = new Client();

        $geocoder = new ProviderAggregator();
        $geocoder->registerProviders([
            new \Geocoder\Provider\bpost\bpost($adapter),
            new \Geocoder\Provider\Geopunt\Geopunt($adapter),
            new \Geocoder\Provider\UrbIS\UrbIS($adapter),
            \Geocoder\Provider\Nominatim\Nominatim::withOpenStreetMapServer($adapter, $_SERVER['HTTP_USER_AGENT']),
        ]);

        $result = $geocoder
            ->using($provider)
            ->geocodeQuery(GeocodeQuery::create($address));

        $dumper = new GeoJSON();
        $formatter = new StringFormatter();

        $locations = [
            'type' => 'FeatureCollection',
            'features' => [],
        ];
        foreach ($result->all() as $location) {
            $json = json_decode($dumper->dump($location));

            $json->properties->formattedAddress = $formatter->format($location, '%S %n, %z %L');

            $locations['features'][] = $json;
        }

        return new JsonResponse($locations);
    }
}
