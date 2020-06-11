"use strict";

export interface LegendOptions {
  column: string;
  values: Array<{
    color: string;
    size?: number;
    symbol?: string;
    text: string;
    type?: string;
    value: string | number | null;
  }>;
}

export { LegendOptions as default };
