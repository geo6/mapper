"use strict";

export interface FileOptions {
  default: boolean;
  description?: string | null;
  filter?: Record<string, string> | null;
  identifier: string;
  name: string;
  title?: string | null;
}

export { FileOptions as default };
