// DICTIONARIES TYPES ---------------------------------

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
  type: string;
  label: string;
  name: string;
  extensions: [] | string[];
  requiredData: [] | string[];
  hints: string;
  order?: string;
  additional?: [] | MethodAdditional[];
  abbreviation?: string;
  formats?: [] | string[];
  functionName?: string;
};

export type AllMethodsItem = {
  id: number;
  key: string;
  label: string;
  type: string;
  data: [] | AllMethodsDataItem[];
  inputConnections: [] | string[];
  outputConnections: [] | string[];
};

export type DictionarySliceState = {
  allMethods: [] | AllMethodsItem[];
  loading: boolean;
  error: null | string;
};

//  SEARCH SLICE TYPES --------------------------------------------------------
export type SearchSliceState = {
  query: string;
};

//  MENU SLICE TYPES --------------------------------------------------------
export type MenuSliceState = {
  menuItemIndex: number;
};

//  SETTINGS SLICE TYPES --------------------------------------------------------
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

// RESULTS TYPES --------------------------------------------------------------

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
  criteriaTypes: number[];
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
};

// BLOCKS TYPES --------------------------------------------------------------------------------

export type BlockDataType = {
  matrix: [] | any;
  matrixFile: [] | File;
  fileName: null | string;
  randomMatrix: [] | number[];
  types: [] | string[];
  weights: [] | string[];
  extension: string;
  additionals: [] | ResultsAdditional[][];
  alternatives: number;
  criteria: number;
  styles: null | React.CSSProperties;
};

export type BlockType = {
  _id: number;
  type: string;
  typeLabel: string;
  method: string;
  label: string;
  inputConnections: [] | string[];
  outputConnections: [] | string[];
  data: BlockDataType;
};

export type ActiveBlockType = {
  id: number;
  type: string;
};

export type BlocksSliceState = {
  blocks: [] | BlockType[];
  clickedBlocks: [] | string[];
  connections: [] | string[][];
  activeBlock: null | ActiveBlockType;
  clickedBlockId: null | number;
  draggedItem: null | string;
  modalOpen: boolean;
  modalType: null | string;
  connectionToDelete: null | string[];
};

// DESCRIPTIONS TYPES ----------------------------------------------------------------------------

export type DescriptionType = {
  id: number;
  text: string;
};

export type DataDescriptionType = {
  id: number;
  name: string;
  description: [] | DescriptionType[];
};

export type MethodsDescriptionType = {
  id: number;
  key: string;
  data: [] | DataDescriptionType[];
};

export type DescriptionsSliceState = {
  home: [] | DescriptionType[];
  methods: [] | MethodsDescriptionType[];
  loading: boolean;
  error: null | string;
};

// HEADERS TYPE ------------------------------------------------------------------------------------------

export type HeadersType = {
  locale: string;
};
