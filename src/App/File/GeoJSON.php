<?php

declare(strict_types=1);

namespace App\File;

class GeoJSON extends AbstractFile
{
    /** {@inheritdoc} */
    public function checkType(): bool
    {
        $mime = mime_content_type($this->getPathname());
        $extension = strtolower(pathinfo($this->getPathname(), PATHINFO_EXTENSION));

        return
            in_array($extension, ['json', 'geojson'], true) &&
            in_array($mime, ['text/plain', 'application/json'], true);
    }

    /** {@inheritdoc} */
    protected function getInfo(): ?FileContentInfo
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

                $info = new FileContentInfo();
                $info->title = $json->title ?? null;
                $info->description = $json->description ?? null;
                $info->legend = $legend ?? null;

                return $info;
            }
        }

        return null;
    }
}
