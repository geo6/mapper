<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SimpleXMLElement;
use SplFileInfo;

class XML extends SplFileInfo implements FileInterface
{
    /**
     * {@inheritdoc}
     */
    public function checkType() : bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['xml'], true) &&
            in_array($mime, ['text/xml', 'application/xml'], true);
    }

    /**
     * {@inheritdoc}
     */
    public function getInfo() : ?ArrayObject
    {
        $content = file_get_contents($this->getPathname());

        if ($content !== false) {
            $xml = new SimpleXMLElement($content);

            return new ArrayObject([
                'title'       => isset($xml->Document->name) ? (string) $xml->Document->name : null,
                'description' => isset($xml->Document->description) ? (string) $xml->Document->description : null,
            ], ArrayObject::ARRAY_AS_PROPS);
        }

        return null;
    }
}
