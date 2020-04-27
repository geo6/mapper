<?php

declare(strict_types=1);

namespace App\Handler;

use App\Middleware\ConfigMiddleware;
use Blast\BaseUrl\BaseUrlMiddleware;
use GuzzleHttp\Client as GuzzleClient;
use Laminas\Diactoros\Response;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Stream;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;

class ProxyHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
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
            $query = parse_url($url, PHP_URL_QUERY);

            if (!is_null($query) && $query !== false) {
                parse_str($query, $queryArray);
                $params = array_merge($queryArray, $params);
            }

            if ($host === null || $path === null || !isset($config['config']['layers'])) {
                $auth = null;
                $proxied = false;
            } else {
                $auth = self::getHostAuthentication($config['config']['layers'], $host ?: '', $path ?: '');
                $proxied = self::isHostProxied($config['config']['layers'], $host ?: '', $path ?: '');
            }

            if ($proxied === true) {
                $localHTTPS = isset($_SERVER['HTTPS']) && strlen($_SERVER['HTTPS']) > 0;
                $localHost = $_SERVER['HTTP_HOST'];

                $proxy = 'http'.($localHTTPS ? 's' : '').'://'.$localHost.$baseUrl.'proxy';

                $callback = function ($body) use ($config, $host, $path, $query, $proxy) {
                    return preg_replace_callback(
                        '/xlink:href="(https?:\/\/.+?)"/',
                        function ($matches) use ($config, $host, $path, $query, $proxy) {
                            $url = parse_url($matches[1]);

                            if ($url !== false && isset($url['host'], $url['path']) && !is_null($host) && strcasecmp($url['host'], $host ?: '') === 0 && !is_null($path) && strcasecmp($url['path'], $path ?: '') === 0) {
                                if (isset($url['query']) && strlen($url['query']) > 0) {
                                    $urlQuery = html_entity_decode($url['query']);
                                    $urlQuery = urldecode($urlQuery);
                                    parse_str($urlQuery, $output);

                                    $params = http_build_query($output);
                                }

                                return 'xlink:href='.
                                    '"'
                                    .$proxy.'?'
                                    .($config['custom'] !== null ? 'c='.$config['custom'].'&amp;' : '')
                                    .'_url='.urlencode(
                                        $url['scheme'].'://'
                                            .$url['host']
                                            .$url['path']
                                            .(!is_null($query) ? '?'.$query : '')
                                    )
                                    .(isset($params) ? htmlentities('&'.$params) : '')
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

            if ($url !== false && isset($url['host'], $url['path']) && $url['host'] === $host && $url['path'] === $path) {
                return isset($layer['auth']) || (isset($layer['proxy']) && $layer['proxy'] === true);
            }
        }

        return false;
    }

    protected static function getHostAuthentication(array $layers, string $host, string $path): ?array
    {
        foreach ($layers as $layer) {
            $url = parse_url($layer['url']);

            if ($url !== false && isset($url['host'], $url['path']) && $url['host'] === $host && $url['path'] === $path && isset($layer['auth'])) {
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
        ResponseInterface $response,
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
        $client = new GuzzleClient([
            'timeout' => 5.0,
        ]);

        unset($query['_url'], $query['c']);

        $response = $client->request('GET', $url, [
            'query'   => $query,
            'headers' => [
                'User-Agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'GEO-6 Mapper',
                'Referer'    => 'http'.(isset($_SERVER['HTTPS']) && strlen($_SERVER['HTTPS']) > 0 ? 's' : '').'://'
                    .($_SERVER['SERVER_NAME'] ?? 'localhost').'/',
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
        $client = new GuzzleClient([
            'timeout' => 5.0,
        ]);

        unset($query['_url'], $query['c']);

        $response = $client->request('GET', $url, [
            'auth'    => $authentication,
            'query'   => $query,
            'headers' => [
                'User-Agent' => $_SERVER['HTTP_USER_AGENT'] ?? 'GEO-6 Mapper',
                'Referer'    => 'http'.(isset($_SERVER['HTTPS']) && strlen($_SERVER['HTTPS']) > 0 ? 's' : '').'://'
                    .($_SERVER['SERVER_NAME'] ?? 'localhost').'/',
            ],
        ]);

        return self::buildResponse($response, $acceptEncoding, $callback);
    }
}
