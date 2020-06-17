<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SplFileInfo;

class GeoJSON extends SplFileInfo implements FileInterface
{
    /**
     * {@inheritdoc}
     */
    public function checkType(): bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['json', 'geojson'], true) &&
            in_array($mime, ['text/plain', 'application/json'], true);
    }

    /**
     * {@inheritdoc}
     */
    public function getInfo(): ?ArrayObject
    {
        $content = file_get_contents($this->getPathname());

        if ($content !== false) {
            $json = json_decode($content);

            if ($json !== false) {
                if (isset($json->legend)) {
                    $legend = [
                        'column' => isset($json->legendColumn) ? $json->legendColumn : null,
                        'values' => $json->legend,
                    ];
                }

                return new ArrayObject([
                    'title'       => $json->title ?? null,
                    'description' => $json->description ?? null,
                    'legend'      => $legend ?? null,
                ], ArrayObject::ARRAY_AS_PROPS);
            }
        }

        return null;
    }
}
