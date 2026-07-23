export const EDGE_CLASSIFICATION = {
  INPUT: "input-node-handle",
  FILTER: "filter-node-handle",
} as const;

export const EDGE_COLOR_MAP: Record<string, string> = {
  [EDGE_CLASSIFICATION.INPUT]: "stroke-emerald-500!",
  [EDGE_CLASSIFICATION.FILTER]: "stroke-purple-500!",
};
