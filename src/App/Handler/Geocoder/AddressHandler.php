<?php

declare(strict_types=1);

namespace App\Handler\Geocoder;

use App\Middleware\ConfigMiddleware;
use ErrorException;
use Geocoder\Dumper\GeoJson;
use Geocoder\Formatter\StringFormatter;
use Geocoder\Query\GeocodeQuery;
use Geocoder\Provider\Provider;
use Geocoder\StatefulGeocoder;
use GuzzleHttp\Client as GuzzleClient;
use Http\Adapter\Guzzle6\Client as GuzzleAdapter;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response\JsonResponse;

class AddressHandler implements RequestHandlerInterface
{
    /**
     * Given a Geocoder provider name and an address as parameters,
     * geocode the address and return the matched locations.
     *
     * @param ServerRequestInterface $request
     *
     * @return ResponseInterface
     */
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $address = $request->getAttribute('address');
        $provider = $request->getAttribute('provider');

        $guzzle = new GuzzleClient([
            'timeout' => 5.0,
        ]);
        $adapter = new GuzzleAdapter($guzzle);

        $geocoder = self::getGeocoder(
            $provider,
            $adapter,
            $config['geocoder']['providers'][$provider]['customerId'] ?? null,
            $config['geocoder']['providers'][$provider]['customerId'] ?? null
        );

        $locations = self::geocode($geocoder, $address);

        return new JsonResponse([
            'type'     => 'FeatureCollection',
            'features' => $locations,
        ]);
    }

    /**
     * Instantiate the Geocoder Provider.
     *
     * @param string $name Provider name.
     * @param GuzzleAdapter $adapter
     * @param string|null $customerId
     * @param string|null $privateKey
     *
     * @return Provider
     */
    private static function getGeocoder(
        string $name,
        GuzzleAdapter $adapter,
        ? string $customerId = null,
        ? string $privateKey = null
    ) : Provider {
        switch ($name) {
            case 'bpost':
                return new \Geocoder\Provider\bpost\bpost($adapter);

            case 'geo6':
                return new \Geocoder\Provider\Geo6\Geo6(
                    $adapter,
                    $customerId ?? '',
                    $privateKey ?? ''
                );

            case 'geo6-poi':
                return new \Geocoder\Provider\Geo6\POI\Geo6POI(
                    $adapter,
                    $customerId ?? '',
                    $privateKey ?? ''
                );

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
     * Geocode an address with a given Geocoder provider.
     *
     * @param Provider $geocoder
     * @param string $address
     *
     * @return array
     */
    private static function geocode(Provider $geocoder, string $address) : array
    {
        $query = GeocodeQuery::create($address);

        $result = (new StatefulGeocoder($geocoder))->geocodeQuery($query);

        $locations = [];

        foreach ($result->all() as $location) {
            $json = json_decode((new GeoJson())->dump($location));

            switch ($geocoder->getName()) {
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
                    $json->properties->formattedAddress = (new StringFormatter())->format($location, '%S %n, %z %L');
                    break;
            }

            $locations[] = $json;
        }

        return $locations;
    }
}
