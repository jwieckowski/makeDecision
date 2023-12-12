export type ResultsAdditional = {
  normalization_function?: string;
  preference_function?: string;
  normalization?: string;
  defuzzify?: string;
  distance?: string;
  distance_1?: string;
  distance_2?: string;
};

export type ResultsMethod = {
  method: string;
  weights: string;
  weights_value: [] | number[] | number[][];
  preference: [] | number[];
  extension: string;
  additional: ResultsAdditional;
  error: boolean | string;
};

type ResultsCorrelationsMethods = {
  method: string;
  weights: string;
  additionals: ResultsAdditional;
};

export type ResultsMethodCorrelations = {
  correlation: string;
  results: [] | number[][];
  methods: ResultsCorrelationsMethods[];
  error: boolean | string;
};

type RankingMethods = {
  method: string;
  weights: string;
  order: string;
  ranking: boolean;
  additionals: ResultsAdditional;
};

export type ResultsMethodRankings = {
  ranking: [] | number[];
  methods: RankingMethods;
  error: boolean | string;
};

export type ResultsRankingCorrelations = {
  correlation: string;
  results: [] | number[][];
  methods: ResultsCorrelationsMethods[];
  error: boolean | string;
};

export type ResultsType = {
  matrices: [] | number[][] | number[][][];
  method: [] | ResultsMethod[][];
  methodCorrelations: [] | ResultsMethodCorrelations[][];
  methodRankings: [] | ResultsMethodRankings[][][];
  rankingCorrelations: [] | ResultsRankingCorrelations[][];
};

export type RankingType = {
  order: [] | string[];
  ranking: [] | number[];
  error: null | string;
};

export type CorrelationType = {
  method: string;
  correlation: number[][];
  error: null | string;
};

export type MethodType = {
  method: string;
  weights: string | number[] | string[];
};

export type MethodCorrelationDataType = {
  method: string;
  weights: string | number[] | string[];
  correlation: boolean;
};

export type MethodCorrelationType = {
  correlation: string;
  data: [] | MethodCorrelationDataType[];
};

export type MethodRankingItem = {
  method: string;
  weights: string;
  order: string;
  ranking: boolean;
};

export type MethodCorrelationItem = {
  method: string;
  weights: string;
  order: string;
  correlation: boolean;
};

export type MethodRankingType = {
  data: [] | MethodRankingItem[];
};

export type RankingCorrelationType = {
  correlation: string;
  data: [] | MethodCorrelationItem[];
};

type CalculationParamsType = {
  method: string;
  extension: string;
  additional: ResultsAdditional;
};

export type CalculationBodyType = {
  matrix: [] | any;
  extensions: [] | string[];
  types: [] | number[][];
  method: [] | MethodType[][];
  methodCorrelations: [] | MethodCorrelationType[][];
  methodRankings: [] | MethodRankingType[][];
  rankingCorrelations: [] | RankingCorrelationType[][];
  params: [] | CalculationParamsType[][];
};

export type TempBodyType = {
  matrixFiles: [] | File[];
};

type ConvertedMatrixType = {
  matrix: number[][] | number[][][];
  criteria_types: number[];
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
  results: null | ResultsType;
  filteredResults: null | ResultsType;
  rankingResults: [] | RankingType[];
  correlationResults: [] | CorrelationType[];
  alternatives: number;
  criteria: number;
  calculationBody: TempBodyType;
  loading: boolean;
  error: null | string;
  convertedMatrix: null | ConvertedMatrixType;
  matrixId: [] | number[];
  methodsKwargsItems: MethodsKwargsItemsType;
};
