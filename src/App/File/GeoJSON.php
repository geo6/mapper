<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SplFileInfo;

class GeoJSON extends SplFileInfo implements FileInterface
{
    public function checkType() : bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['json', 'geojson'], true) &&
            in_array($mime, ['text/plain', 'application/json'], true);
    }

    public function getInfo() : ?ArrayObject
    {
        $content = file_get_contents($this->getPathname());

        if ($content !== false) {
            $json = json_decode($content);

            if ($json !== false) {
                return new ArrayObject([
                    'title'       => $json->title ?? null,
                    'description' => $json->description ?? null,
                ], ArrayObject::ARRAY_AS_PROPS);
            }
        }

        return null;
    }
}