<?php

declare(strict_types=1);

namespace App\File;

use SimpleXMLElement;

class XML extends AbstractFile
{
    /** {@inheritdoc} */
    public function checkType(): bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['xml'], true) &&
            in_array($mime, ['text/xml', 'application/xml'], true);
    }

    /** {@inheritdoc} */
    protected function getInfo(): ?FileContentInfo
    {
        $content = file_get_contents($this->getPathname());

        if ($content !== false) {
            $xml = new SimpleXMLElement($content);

            $info = new FileContentInfo();
            $info->title = isset($xml->Document->name) ? (string) $xml->Document->name : null;
            $info->description = isset($xml->Document->description) ? (string) $xml->Document->description : null;

            return $info;
        }

        return null;
    }
}
