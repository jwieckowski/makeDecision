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
  node_type: 'visualization';
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
