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

export type CalculationBodyTypeNew = {
  data: CalculationNode[];
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

export type ResultsMatrixNodeData = {
  criteria_types: number[];
  // matrix: number[][] | number[][][];
  matrix: number[][];
};

export type ResultsMatrixNode = {
  node_type: 'matrix';
  data: ResultsMatrixNodeData[];
};

export type ResultsWeightsNodeData = {
  matrix_id: number;
  weights: number[] | number[][];
};

export type ResultsWeightsNode = {
  node_type: 'weights';
  data: ResultsWeightsNodeData[];
};

export type ResultsNodeKwargs = {
  matrix_id: number;
  // crisp
  bounds?: string[][];
  esp?: string[];
  expert_function?: string[];
  normalization_function?: string;
  alpha?: string;
  lam?: string;
  ref_point?: string[];
  sPROBID?: boolean;
  preference_function?: string;
  p?: string[];
  q?: string[];
  ref_ideal?: string[];
  v?: string;
  // fuzzy
  normalization?: string;
  distance?: string;
  distance_1?: string;
  distance_2?: string;
  defuzzify?: string;
};

export type ResultsMethodNodeData = {
  matrix_id: number;
  weights_method: string;
  preference: number[];
  kwargs: ResultsNodeKwargs[];
};

export type ResultsMethodNode = {
  node_type: 'method';
  data: ResultsMethodNodeData[];
};

export type ResultsRankingNodeData = {
  matrix_id: number;
  method: string;
  weights_method: string;
  ranking: number[];
  kwargs: ResultsNodeKwargs[];
};

export type ResultsRankingNode = {
  node_type: 'ranking';
  data: ResultsRankingNodeData[];
};

export type ResultsCorrelationNodeData = {
  matrix_id: number;
  correlation: number[][];
  labels: string[];
};

export type ResultsCorrelationNode = {
  node_type: 'correlation';
  data: ResultsCorrelationNodeData[];
};

export type ResultsVisualizationNodeData = {
  matrix_id: number;
  img: string;
};

export type ResultsVisualizationNode = {
  node_type: 'correlation';
  data: ResultsVisualizationNodeData[];
};

export type ResultsNodeData =
  | ResultsMatrixNode
  | ResultsWeightsNode
  | ResultsMethodNode
  | ResultsRankingNode
  | ResultsCorrelationNode
  | ResultsVisualizationNode;

export type ResultsNode = {
  method: string;
  id: number;
  extension: string;
} & ResultsNodeData;

export type FiltersProps = {
  matrix: string;
};

export type CalculationSliceState = {
  results: ResultsNode[];
  filteredResults: ResultsNode[];
  rankingResults: [] | RankingType[];
  correlationResults: [] | CorrelationType[];
  alternatives: number;
  criteria: number;
  calculationBody: TempBodyType;
  resultsLoading: boolean;
  kwargsLoading: boolean;
  matrixLoading: boolean;
  error: null | string;
  resultsError: null | string;
  convertedMatrix: null | ConvertedMatrixType;
  matrixId: [] | number[];
  methodsKwargsItems: MethodsKwargsItemsType;
};
