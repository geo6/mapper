<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use Geocoder\Dumper\GeoJson;
use Geocoder\Formatter\StringFormatter;
use Geocoder\Query\ReverseQuery;
use Geocoder\StatefulGeocoder;
use GuzzleHttp\Client as GuzzleClient;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;
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

        $guzzle = new GuzzleClient([
            'timeout' => 5.0,
        ]);
        $adapter = new GuzzleAdapter($guzzle);

        switch ($provider) {
            case 'geopunt':
                $geocoder = new \Geocoder\Provider\Geopunt\Geopunt($adapter);
                break;

            case 'nominatim':
                $geocoder = \Geocoder\Provider\Nominatim\Nominatim::withOpenStreetMapServer(
                    $adapter,
                    $_SERVER['HTTP_USER_AGENT']
                );
                break;

            case 'spw':
                $geocoder = new \Geocoder\Provider\SPW\SPW($adapter);
                break;

            case 'urbis':
                $geocoder = new \Geocoder\Provider\UrbIS\UrbIS($adapter);
                break;
        }

        $locations = [
            'type'     => 'FeatureCollection',
            'features' => [],
        ];

        if (isset($geocoder)) {
            $query = ReverseQuery::fromCoordinates($latitude, $longitude);

            $result = (new StatefulGeocoder($geocoder))
                ->reverseQuery($query);

            $dumper = new GeoJson();
            $formatter = new StringFormatter();

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
        }

        return new JsonResponse($locations);
    }
}
