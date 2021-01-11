<?php

declare(strict_types=1);

namespace App\File;

use ArrayObject;
use SplFileInfo;

abstract class AbstractFile extends SplFileInfo
{
  public string $identifier;
  public string $name;
  public bool $default;
  public bool $queryable;
  public ?string $title;
  public ?string $description;
  public ?array $legend;
  public ?string $label;
  public ?array $filter;

  public function __construct(string $path)
  {
    parent::__construct($path);

    $this->identifier = $this->getSize() . '-' . preg_replace('/[^0-9a-zA-Z_-]/im', '', $this->getFilename());
    $this->name = $this->getFilename();

    if ($this->isFile() && $this->isReadable() === true) {
      $info = $this->getInfo();
      if (!is_null($info)) {
        $this->title = $info->title;
        $this->description = $info->description;
        $this->legend = $info->legend;
      }
    }
  }

  /**
   * Check mime-type and extension.
   */
  public abstract function checkType(): bool;

  /**
   * Return title and description from file content (if possible).
   */
  protected abstract function getInfo(): ?ArrayObject;
}
