<?php

declare(strict_types=1);

namespace App\File;

class GPX extends XML implements FileInterface
{
    /**
     * {@inheritdoc}
     */
    public function checkType() : bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['gpx'], true) &&
            in_array($mime, ['text/xml', 'application/xml', 'application/gpx+xml'], true);
    }
}
