<?php

declare(strict_types=1);

namespace App\File;

use Exception;
use SplFileInfo;

abstract class AbstractFile extends SplFileInfo
{
    /** @var string */
    public $identifier;
    /** @var string */
    public $name;
    /** @var bool */
    public $default;
    /** @var bool */
    public $queryable;
    /** @var string|null */
    public $title;
    /** @var string|null */
    public $description;
    /** @var array|null */
    public $legend;
    /** @var string|null */
    public $label;
    /** @var array|null */
    public $filter;
    /** @var string[]|string|null */
    public $collection;
    /** @var int|null */
    public $order;

    public function __construct(string $path)
    {
        parent::__construct($path);

        $this->identifier = $this->getSize().'-'.preg_replace('/[^0-9a-zA-Z_-]/im', '', $this->getFilename());
        $this->name = $this->getFilename();

        if ($this->isFile() && $this->isReadable() === true && $this->checkType() === true) {
            $info = $this->getInfo();
            if (!is_null($info)) {
                $this->title = $info->title ?? null;
                $this->description = $info->description ?? null;
                $this->legend = $info->legend ?? null;
            }
        }
    }

    public function setCollectionFromPath(string $path): ?array
    {
        if (is_dir($path) !== true) {
            return null;
        }

        $path = rtrim($path, '/');
        $directory = $this->getPath();

        if ($path === $directory) {
            return null;
        }

        if (substr($directory, 0, strlen($path)) !== $path) {
            throw new Exception(
                sprintf('File path "%s" do not match path from configuration "%s".', $directory, $path)
            );
        }

        $folders = explode('/', substr($directory, strlen($path) + 1));

        $this->collection = $folders;

        return $folders;
    }

    /**
     * Check mime-type and extension.
     */
    abstract public function checkType(): bool;

    /**
     * Return title and description from file content (if possible).
     */
    abstract protected function getInfo(): ?FileContentInfo;
}
