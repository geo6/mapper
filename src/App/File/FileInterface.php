<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;

interface FileInterface
{
    /**
     * Check mime-type and extension.
     *
     * @return bool
     */
    public function checkType(): bool;

    /**
     * Return title and description from file content (if possible).
     *
     * @return ArrayObject|null
     */
    public function getInfo(): ?ArrayObject;
}
