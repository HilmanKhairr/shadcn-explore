export const EDGE_TYPES = {
  INPUT: "input-node-handle",
  MODIF: "filter-node-handle",
} as const;

export const EDGE_COLOR_MAP: Record<string, string> = {
  [EDGE_TYPES.INPUT]: "stroke-emerald-500!",
  [EDGE_TYPES.MODIF]: "stroke-purple-500!",
};
