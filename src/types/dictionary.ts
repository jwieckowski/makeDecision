export type MethodKwargsData = {
  id: number;
  method: string;
  parameter: string;
  default: string;
  type: string;
  min?: number;
  max?: number;
  dimension?: number;
  required?: boolean;
};

export type MethodKwargs = {
  extension: string;
  data: [] | MethodKwargsData[];
};

export type AllMethodsDataItem = {
  id: number;
  name: string;
  extensions: [] | string[];
  hints: string;
  inputConnections: [] | string[];
  outputConnections: [] | string[];
  abbreviation?: string;
  order?: string;
  kwargs?: [] | MethodKwargs[];
  functionName?: string;
};

export type AllMethodsItem = {
  id: number;
  key: string;
  label: string;
  function: string;
  type: string;
  data: [] | AllMethodsDataItem[];
};

export type DictionarySliceState = {
  allMethods: [] | AllMethodsItem[];
  loading: boolean;
  error: null | string;
};
