<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use App\Middleware\ConfigMiddleware;
use ErrorException;
use Geocoder\Dumper\GeoJson;
use Geocoder\Formatter\StringFormatter;
use Geocoder\Provider\Provider;
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
    /**
     * Given a Geocoder provider name, a Longitude, and a Latitude as parameters,
     * reverse geocode the location and return the matched addresses.
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $longitude = $request->getAttribute('longitude');
        $latitude = $request->getAttribute('latitude');
        $provider = $request->getAttribute('provider');

        $guzzle = new GuzzleClient([
            'timeout' => 5.0,
        ]);
        $adapter = new GuzzleAdapter($guzzle);

        $geocoder = self::getGeocoder(
            $provider,
            $adapter,
            $config['global']['geocoder']['providers'][$provider]['customerId'] ?? null,
            $config['global']['geocoder']['providers'][$provider]['privateKey'] ?? null
        );

        $locations = self::geocode($geocoder, floatval($longitude), floatval($latitude));

        return new JsonResponse([
            'type'     => 'FeatureCollection',
            'features' => $locations,
        ]);
    }

    /**
     * Instantiate the Geocoder Provider.
     *
     * @param string        $name       Provider name.
     * @param GuzzleAdapter $adapter
     * @param string|null   $customerId
     * @param string|null   $privateKey
     *
     * @return Provider
     */
    private static function getGeocoder(
        string $name,
        GuzzleAdapter $adapter,
        ?string $customerId = null,
        ?string $privateKey = null
    ): Provider {
        switch ($name) {
            case 'geopunt':
                return new \Geocoder\Provider\Geopunt\Geopunt($adapter);

            case 'nominatim':
                return \Geocoder\Provider\Nominatim\Nominatim::withOpenStreetMapServer(
                    $adapter,
                    $_SERVER['HTTP_USER_AGENT']
                );

            case 'spw':
                return new \Geocoder\Provider\SPW\SPW($adapter);

            case 'urbis':
                return new \Geocoder\Provider\UrbIS\UrbIS($adapter);

            default:
                throw new ErrorException(sprintf('The "%s" provider is not installed or configured.', $name));
        }
    }

    /**
     * Geocode a location with a given Geocoder provider.
     *
     * @param Provider $geocoder
     * @param float    $longitude
     * @param float    $latitude
     *
     * @return array
     */
    private static function geocode(Provider $geocoder, float $longitude, float $latitude): array
    {
        $query = ReverseQuery::fromCoordinates($latitude, $longitude);

        $result = (new StatefulGeocoder($geocoder))->reverseQuery($query);

        $locations = [];

        foreach ($result->all() as $location) {
            $json = json_decode((new GeoJson())->dump($location));

            switch ($geocoder->getName()) {
                case 'nominatim':
                    $json->properties->type = $location->getType();
                    $json->properties->formattedAddress = $location->getDisplayName();
                    break;

                default:
                    $json->properties->formattedAddress = (new StringFormatter())->format($location, '%S %n, %z %L');
                    break;
            }

            $locations[] = $json;
        }

        return $locations;
    }
}
