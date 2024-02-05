import { ResultsNode } from './results';

export type CalculationNodeKwargItem = {
  [key: string]: string | number | string[];
};

export type CalculationNode = {
  id: number;
  node_type: string;
  extension: string;
  method: string;
  connections_from: number[];
  connections_to: number[];
  position_x: number;
  position_y: number;
  matrix?: string[][];
  criteria_types?: string[];
  weights?: string[];
  kwargs?: CalculationNodeKwargItem[];
};

export type CalculationBodyType = {
  data: CalculationNode[];
};

export type ConvertedMatrixType = {
  matrix: number[][] | number[][][];
  criteria_types: number[];
};

export type StructureErrorItem = {
  id: null | string;
  type: null | string;
  message: string;
};

export type TempBodyType = {
  matrixFiles: [] | File[];
};

export type SelectItemType = {
  value: string;
  label: string;
};

export type MethodsKwargsValueType = {
  extension: string;
  label: string;
  type: string;
  parameter: string;
  default: string;
  items?: SelectItemType[];
  min?: number;
  max?: number;
  dimension?: number;
  required?: boolean;
};

export type MethodsKwargsItemsType = {
  [key: string]: MethodsKwargsValueType[];
};

export type CalculationSliceState = {
  results: ResultsNode[];
  filteredResults: ResultsNode[];
  alternatives: number;
  criteria: number;
  calculationBody: TempBodyType;
  resultsLoading: boolean;
  kwargsLoading: boolean;
  matrixLoading: boolean;
  error: null | string;
  resultsError: null | string;
  convertedMatrix: null | ConvertedMatrixType;
  matrixId: number[];
  methodsKwargsItems: MethodsKwargsItemsType;
  errorModalOpen: boolean;
  errorsList: StructureErrorItem[];
};
