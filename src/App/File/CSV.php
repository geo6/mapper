<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SplFileInfo;

class CSV extends SplFileInfo implements FileInterface
{
    /**
     * {@inheritdoc}
     */
    public function checkType() : bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['csv'], true) &&
            in_array($mime, ['text/plain', 'text/csv'], true);
    }

    /**
     * {@inheritdoc}
     */
    public function getInfo() : ?ArrayObject
    {
        return null;
    }
}
