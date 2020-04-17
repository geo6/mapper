<?php

declare(strict_types=1);

namespace App\File;

class KML extends XML implements FileInterface
{
    /**
     * {@inheritdoc}
     */
    public function checkType(): bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, [
                'kml',
                // 'kmz',
            ], true) &&
            in_array($mime, [
                'text/xml',
                'application/xml',
                'application/vnd.google-earth.kml+xml',
                // 'application/vnd.google-earth.kmz',
            ], true);
    }
}
