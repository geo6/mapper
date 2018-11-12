<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use Geocoder\Dumper\GeoJSON;
use Geocoder\Formatter\StringFormatter;
use Geocoder\ProviderAggregator;
use Geocoder\Query\ReverseQuery;
use Geocoder\StatefulGeocoder;
use Http\Adapter\Guzzle6\Client;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\JsonResponse;

class ReverseHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $longitude = $request->getAttribute('longitude');
        $latitude = $request->getAttribute('latitude');
        $provider = $request->getAttribute('provider');

        $adapter = new Client();

        $geocoder = new ProviderAggregator();
        $geocoder->registerProviders([
            // new \Geocoder\Provider\bpost\bpost($adapter),
            new \Geocoder\Provider\Geopunt\Geopunt($adapter),
            new \Geocoder\Provider\UrbIS\UrbIS($adapter),
            \Geocoder\Provider\Nominatim\Nominatim::withOpenStreetMapServer($adapter, $_SERVER['HTTP_USER_AGENT']),
        ]);

        $query = ReverseQuery::fromCoordinates($latitude, $longitude);

        $result = $geocoder
            ->using($provider)
            ->reverseQuery($query);

        $dumper = new GeoJSON();
        $formatter = new StringFormatter();

        $locations = [
            'type' => 'FeatureCollection',
            'features' => [],
        ];
        foreach ($result->all() as $location) {
            $json = json_decode($dumper->dump($location));

            switch ($provider) {
                case 'nominatim':
                    $json->properties->type = $location->getType();
                    $json->properties->formattedAddress = $location->getDisplayName();
                    break;

                default:
                    $json->properties->formattedAddress = $formatter->format($location, '%S %n, %z %L');
                    break;
            }


            $locations['features'][] = $json;
        }

        return new JsonResponse($locations);
    }
}
