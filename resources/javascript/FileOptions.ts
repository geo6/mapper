"use strict";

import LegendOptions from "./LegendOptions";

export interface FileOptions {
  default: boolean;
  description?: string | null;
  filter?: Record<string, string> | null;
  identifier: string;
  label?: string | null;
  legend?: LegendOptions | null;
  name: string;
  queryable: boolean;
  title?: string | null;
}

export { FileOptions as default };
