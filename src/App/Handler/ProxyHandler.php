<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use Blast\BaseUrl\BaseUrlMiddleware;
use GuzzleHttp\Client;
use GuzzleHttp\Psr7\Response as GuzzleResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use Zend\Diactoros\Response;
use Zend\Diactoros\Response\EmptyResponse;
use Zend\Diactoros\Stream;

class ProxyHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request) : ResponseInterface
    {
        $config = $request->getAttribute(ConfigMiddleware::CONFIG_ATTRIBUTE);

        $baseUrl = $request->getAttribute(BaseUrlMiddleware::BASE_PATH);
        $baseUrl = rtrim($baseUrl, '/').'/';

        $params = $request->getQueryParams();

        $acceptEncoding = $request->hasHeader('Accept-Encoding') ? $request->getHeader('Accept-Encoding')[0] : null;

        if (isset($params['_url'])) {
            $url = $params['_url'];

            $host = parse_url($url, PHP_URL_HOST);
            $path = parse_url($url, PHP_URL_PATH);

            $auth = self::getHostAuthentication($config['layers'], $host, $path);
            $proxied = self::isHostProxied($config['layers'], $host, $path);

            if ($proxied === true) {
                $localHTTPS = isset($_SERVER['HTTPS']) && !empty($_SERVER['HTTPS']);
                $localHost = $_SERVER['HTTP_HOST'];

                $proxy = 'http'.($localHTTPS ? 's' : '').'://'.$localHost.$baseUrl.'proxy';

                $callback = function ($body) use ($host, $path, $proxy) {
                    return preg_replace_callback(
                        '/xlink:href="(https?:\/\/.+?)"/',
                        function ($matches) use ($host, $path, $proxy) {
                            $url = parse_url($matches[1]);

                            if ($url['host'] === $host && $url['path'] === $path) {
                                if (isset($url['query'])) {
                                    $urlQuery = html_entity_decode($url['query']);
                                    $urlQuery = urldecode($urlQuery);
                                    parse_str($urlQuery, $output);

                                    $query = http_build_query($output);
                                }

                                return 'xlink:href='.
                                    '"'
                                    .$proxy
                                    .'?_url='.urlencode($url['scheme'].'://'.$url['host'].$url['path'])
                                    .(isset($query) ? htmlentities('&'.$query) : '')
                                    .'"';
                            }

                            return $matches[0];
                        },
                        $body
                    );
                };
            }

            if (is_null($auth)) {
                return self::forward($url, $params, $acceptEncoding, $callback ?? null);
            } else {
                return self::forwardWithAuthentication($auth, $url, $params, $acceptEncoding, $callback ?? null);
            }
        }

        return new EmptyResponse();
    }

    protected static function isHostProxied(array $layers, string $host, string $path): bool
    {
        foreach ($layers as $layer) {
            $url = parse_url($layer['url']);

            if ($url['host'] === $host && $url['path'] === $path) {
                return isset($layer['auth']) || (isset($layer['proxy']) && $layer['proxy'] === true);
            }
        }

        return false;
    }

    protected static function getHostAuthentication(array $layers, string $host, string $path): ?array
    {
        foreach ($layers as $layer) {
            $url = parse_url($layer['url']);

            if ($url['host'] === $host && $url['path'] === $path && isset($layer['auth'])) {
                return [
                    $layer['auth']['username'],
                    $layer['auth']['password'],
                    $layer['auth']['type'] ?? 'basic',
                ];
            }
        }

        return null;
    }

    private static function buildResponse(
        GuzzleResponse $response,
        ?string $acceptEncoding = null,
        ?callable $callback = null
    ): Response {
        $body = (string) $response->getBody();

        if (!is_null($callback)) {
            $body = $callback($body);
        }

        $encoding = null;
        if (!is_null($acceptEncoding)) {
            if (strpos($acceptEncoding, 'gzip') !== false) {
                $body = gzencode($body);
                $encoding = 'gzip';
            } elseif (strpos($acceptEncoding, 'deflate') !== false) {
                $body = gzdeflate($body);
                $encoding = 'deflate';
            }
        }

        $content = new Stream('php://temp', 'wb+');
        $content->write($body);
        $content->rewind();

        $headers = [
            'Content-Length' => $content->getSize(),
            'Content-Type'   => $response->getHeader('Content-Type'),
        ];
        if (!is_null($encoding)) {
            $headers['Content-Encoding'] = $encoding;
        }

        return new Response(
            $content,
            $response->getStatusCode(),
            $headers
        );
    }

    protected static function forward(
        string $url,
        array $query = [],
        ?string $acceptEncoding = null,
        ?callable $callback = null
    ): Response {
        $client = new Client([
            //'timeout'  => 2.0,
        ]);

        $response = $client->request('GET', $url, [
            'query'   => $query,
            'headers' => [
                'User-Agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'GEO-6 Mapper',
                'Referer'    => 'http'.(!empty($_SERVER['HTTPS']) ? 's' : '').'://'.($_SERVER['SERVER_NAME'] ?? 'localhost').'/',
            ],
        ]);

        return self::buildResponse($response, $acceptEncoding, $callback);
    }

    protected static function forwardWithAuthentication(
        array $authentication,
        string $url,
        array $query = [],
        ?string $acceptEncoding = null,
        ?callable $callback = null
    ): Response {
        $client = new Client([
            //'timeout'  => 2.0,
        ]);

        $response = $client->request('GET', $url, [
            'auth'    => $authentication,
            'query'   => $query,
            'headers' => [
                'User-Agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'GEO-6 Mapper',
                'Referer'    => 'http'.(!empty($_SERVER['HTTPS']) ? 's' : '').'://'.($_SERVER['SERVER_NAME'] ?? 'localhost').'/',
            ],
        ]);

        return self::buildResponse($response, $acceptEncoding, $callback);
    }
}
