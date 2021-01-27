import LegendOptions from "./LegendOptions";

export interface FileOptions {
  collection?: string[] | string | null;
  default: boolean;
  description?: string | null;
  filter?: Record<string, string> | null;
  identifier: string;
  label?: string | null;
  legend?: LegendOptions | null;
  name: string;
  order?: number | null;
  queryable: boolean;
  title?: string | null;
}

export { FileOptions as default };
