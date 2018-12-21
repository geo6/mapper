<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SplFileInfo;

interface FileInterface
{
    public function checkType() : bool;

    public function getInfo() : ?ArrayObject;
}
