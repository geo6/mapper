"use strict";

import LegendOptions from "./LegendOptions";

export interface FileOptions {
  default: boolean;
  description?: string | null;
  filter?: Record<string, string> | null;
  identifier: string;
  legend?: LegendOptions | null;
  name: string;
  title?: string | null;
}

export { FileOptions as default };
