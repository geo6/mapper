<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use App\Middleware\ConfigMiddleware;
use Geocoder\Dumper\GeoJson;
use Geocoder\Formatter\StringFormatter;
use Geocoder\StatefulGeocoder;
use Geocoder\Query\GeocodeQuery;
use Http\Adapter\Guzzle6\Client;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\JsonResponse;

class AddressHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $address = $request->getAttribute('address');
        $provider = $request->getAttribute('provider');

        $adapter = new Client();

        switch ($provider) {
            case 'bpost':
                $geocoder = new \Geocoder\Provider\bpost\bpost($adapter);
                break;

            case 'geo6-poi':
                $geocoder = new \Geocoder\Provider\Geo6\POI\Geo6POI(
                    $adapter,
                    $config['geocoder']['providers']['geo6-poi']['customerId'],
                    $config['geocoder']['providers']['geo6-poi']['privateKey']
                );
                break;

            case 'geopunt':
                $geocoder = new \Geocoder\Provider\Geopunt\Geopunt($adapter);
                break;

            case 'urbis':
                $geocoder = new \Geocoder\Provider\UrbIS\UrbIS($adapter);
                break;

            case 'nominatim':
                $geocoder = \Geocoder\Provider\Nominatim\Nominatim::withOpenStreetMapServer(
                    $adapter,
                    $_SERVER['HTTP_USER_AGENT']
                );
                break;
        }

        $query = GeocodeQuery::create($address);

        $result = (new StatefulGeocoder($geocoder))
            ->geocodeQuery($query);

        $dumper = new GeoJson();
        $formatter = new StringFormatter();

        $locations = [
            'type'     => 'FeatureCollection',
            'features' => [],
        ];
        foreach ($result->all() as $location) {
            $json = json_decode($dumper->dump($location));

            switch ($provider) {
                case 'geo6-poi':
                    $json->properties->type = $location->getType();
                    $json->properties->formattedAddress = sprintf(
                        '%s: %s',
                        $location->getType(),
                        $location->getName()
                    );
                    break;

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
