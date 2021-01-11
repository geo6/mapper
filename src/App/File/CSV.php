<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;

class CSV extends AbstractFile
{
    /** {@inheritdoc} */
    public function checkType(): bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['csv'], true) &&
            in_array($mime, ['text/plain', 'text/csv'], true);
    }

    /** {@inheritdoc} */
    protected function getInfo(): ?ArrayObject
    {
        return null;
    }
}
