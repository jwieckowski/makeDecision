export type MethodAdditionalData = {
  id: number;
  method: string;
  parameter: string;
  default: string;
};
export type MethodAdditional = {
  extension: string;
  data: [] | MethodAdditionalData[];
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
  additional?: [] | MethodAdditional[];
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
