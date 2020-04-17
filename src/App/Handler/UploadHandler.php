<?php

declare(strict_types=1);

namespace App\Handler;

use Exception;
use Laminas\Diactoros\Response\EmptyResponse;
use Laminas\Diactoros\Response\JsonResponse;
use Psr\Http\Message\ResponseInterface;
use Psr\Http\Message\ServerRequestInterface;
use Psr\Http\Server\RequestHandlerInterface;
use SimpleXMLElement;

/**
 * @see https://github.com/23/resumable.js/blob/master/samples/Backend%20on%20PHP.md
 */
class UploadHandler implements RequestHandlerInterface
{
    public function handle(ServerRequestInterface $request): ResponseInterface
    {
        $params = $request->getQueryParams();

        $method = $request->getMethod();

        $resumableIdentifier = $params['resumableIdentifier'] ?? '';
        $resumableFilename = $params['resumableFilename'] ?? '';
        $resumableChunkNumber = $params['resumableChunkNumber'] ?? 0;

        $tempDirectory = sys_get_temp_dir() . '/mapper/' . $resumableIdentifier;
        if (!file_exists($tempDirectory) || !is_dir($tempDirectory)) {
            $mkdir = mkdir($tempDirectory, 0777, true);
        }

        $chunk = $tempDirectory . '/' . $resumableFilename . '.part.' . $resumableChunkNumber;

        switch ($method) {
            case 'GET':
                if (file_exists($chunk)) {
                    return new EmptyResponse(200);
                } else {
                    return new EmptyResponse(404);
                }
                break;

            case 'POST':
                $files = $request->getUploadedFiles();

                $data = [
                    'filename' => $resumableFilename,
                    'chunk'    => $resumableChunkNumber,
                ];

                try {
                    foreach ($files as $file) {
                        $file->moveTo($chunk);

                        $resumableTotalSize = $params['resumableTotalSize'] ?? 0;
                        $resumableTotalChunks = $params['resumableTotalChunks'] ?? 0;

                        $uploadedSize = 0;
                        $listChunks = glob($tempDirectory . '/*.part.*');
                        if ($listChunks !== false) {
                            foreach ($listChunks as $uploadedChunk) {
                                $uploadedSize += filesize($uploadedChunk);
                            }
                        }

                        if ($uploadedSize >= $resumableTotalSize) {
                            $handle = fopen($tempDirectory . '/' . $resumableFilename, 'w');

                            if ($handle !== false) {
                                for ($c = 1; $c <= $resumableTotalChunks; $c++) {
                                    $uploadedChunk = $tempDirectory . '/' . $resumableFilename . '.part.' . $c;

                                    if (file_exists($uploadedChunk) && is_readable($uploadedChunk)) {
                                        $content = file_get_contents($uploadedChunk);

                                        if ($content !== false) {
                                            fwrite($handle, $content);
                                        }

                                        @unlink($uploadedChunk);
                                    } else {
                                        throw new Exception(
                                            sprintf('Unable to open chunk #%d of file "%s".', $c, $resumableFilename)
                                        );
                                    }
                                }

                                fclose($handle);

                                $data['success'] = true;

                                $data['mime'] = mime_content_type($tempDirectory . '/' . $resumableFilename);

                                if (is_readable($tempDirectory . '/' . $resumableFilename)) {
                                    $content = file_get_contents($tempDirectory . '/' . $resumableFilename);

                                    if ($content !== false) {
                                        switch ($data['mime']) {
                                            case 'application/json':
                                            case 'text/plain':
                                                $json = json_decode($content);

                                                $data['title'] = $json->title ?? null;
                                                $data['description'] = $json->description ?? null;
                                                break;

                                            case 'application/gpx+xml':
                                            case 'application/vnd.google-earth.kml+xml':
                                                // case 'application/vnd.google-earth.kmz':
                                            case 'application/xml':
                                            case 'text/xml':
                                                $xml = new SimpleXMLElement($content);

                                                $data['title'] = isset($xml->Document->name) ?
                                                    (string) $xml->Document->name : null;
                                                $data['description'] = isset($xml->Document->description) ?
                                                    (string) $xml->Document->description : null;
                                                break;

                                            default:
                                                $data['title'] = null;
                                                $data['description'] = null;
                                                break;
                                        }
                                    }
                                }
                            } else {
                                throw new Exception(
                                    sprintf('Unable to write file "%s" in temporary folder.', $resumableFilename)
                                );
                            }
                        }
                    }

                    return new JsonResponse($data);
                } catch (Exception $e) {
                    $data['error'] = $e->getMessage();

                    return new JsonResponse($data, 500);
                }
                break;
        }

        return new EmptyResponse(400);
    }
}
