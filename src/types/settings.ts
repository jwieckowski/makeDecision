export type SettingsSliceState = {
  scale: number;
  gridOn: boolean;
  gridSize: number;
  size: number;
  headSize: number;
  color: string;
  curveness: number;
  path: any;
};

//  FILTER SLICE TYPES --------------------------------------------------------
export type FilteringSliceState = {
  matrixFilter: string;
  methodFilter: string;
  correlationFilter: string;
};

export type FilterItem = {
  value: string;
  label: string;
};
