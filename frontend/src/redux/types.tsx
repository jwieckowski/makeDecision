// DICTIONARIES TYPES ---------------------------------

export type MethodAdditionalData = {
    id: number,
    method: string,
    parameter: string
}

export type AllMethodsDataItem = {
    id: number,
    type: string,
    name: string,
    extensions: [] | string[],
    requiredData: [] | string[],
    hints: [] | string[],
    order?: string,
    additional?: [] | MethodAdditional[],
    abbreviation?: string,
    formats?: [] | string[],
    functionName?: string
}

export type AllMethodsItem = {
    id: number,
    key: string,
    type: string,
    data: [] | AllMethodsDataItem[],
    inputConnections: [] | string[],
    outputConnections: [] | string[],
}

export type MethodAdditional = {
    extension: string,
    data: [] | MethodAdditionalData[]
}

export type MethodsItem = {
    id: number,
    type: string,
    name: string,
    abbreviation: string,
    extensions: [] | string[],
    order: string,
    requiredData: [] | string[],
    additional: [] | MethodAdditional[],
    inputConnections: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
}

export type CorrelationsItem = {
    id: number,
    type: string,
    name: string,
    requiredData: [] | string[],
    inputConnections: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
    additional?: null
}

export type DecisionMatrixItem = {
    id: number,
    type: string,
    name: string,
    extensions: [] | string[],
    formats?: [] | string[], 
    requiredData: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
    additional?: null
}

export type DefuzzificationsItem = {
    id: number,
    type: string,
    name: string,
    functionName: string,
    extensions: [] | string[],
    inputConnections: [] | string[],
    hints: [] | string[]
}

export type DistancesItem = {
    id: number,
    type: string,
    name: string,
    functionName: string,
    extensions: [] | string[],
    inputConnections: [] | string[],
    hints: [] | string[]
}

export type NormalizationsItem = {
    id: number,
    type: string,
    name: string,
    functionName: string,
    extensions: [] | string[],
    requiredData: [] | string[],
    inputConnections: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
}

export type RankingItem = {
    id: number,
    type: string,
    name: string,
    inputConnections: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
    additional?: null
}

export type VisualizationItem = {
    id: number,
    type: string,
    name: string,
    inputConnections: [] | string[],
    hints: [] | string[]
    additional?: null
}

export type WeightsItem = {
    id: number,
    type: string,
    name: string,
    extensions: [] | string[],
    requiredData: [] | string[],
    inputConnections: [] | string[],
    outputConnections: [] | string[],
    hints: [] | string[]
    additional?: null
}

type DictionarySliceState = {
    allMethods: [] | AllMethodsItem[],
    methods: [] | MethodsItem[],
    methodItem: null | MethodsItem,
    correlations: [] | CorrelationsItem[],
    correlationItem: null | CorrelationsItem,
    decisionMatrix: [] | DecisionMatrixItem[],
    decisionMatrixItem: null | DecisionMatrixItem,
    defuzzifications: [] | DefuzzificationsItem[],
    defuzzificationItem: null | DefuzzificationsItem,
    distances: [] | DistancesItem[],
    distanceItem: null | DistancesItem,
    normalizations: [] | NormalizationsItem[],
    normalizationItem: null | NormalizationsItem,
    ranking: [] | RankingItem[],
    rankingItem: null | RankingItem,
    visualization: [] | VisualizationItem[],
    visualizationItem: null | VisualizationItem,
    weights: [] | WeightsItem[],
    weightItem: null | WeightsItem,
    loading: boolean,
    error: null | string
}

//  SEARCH SLICE TYPES --------------------------------------------------------
export type SearchSliceState = {
    query: string
}

// RESULTS TYPES --------------------------------------------------------------

export type AdditionalType = {
    [key: string]: string
}

type ParamsType = {
    method: string,
    extension: string,
    additional: AdditionalType
}

export type ResultsBodyType = {
    matrix: number[][] | number[][][],
    mcda_methods: string[],
    extension: string,
    types: number[],
    weights_method: string,
    correlation_methods: string[],
    ranking_order: string,
    params?: ParamsType[]
}

export type RankingBodyType = {
    matrix: number[] | number[][],
    order: [] | string[]
}

export type CorrelationBodyType = {
    matrix: number[][],
    correlationMethods: string[]
}

export type ResultsMethod = {
    method: string,
    weights: string,
    weights_value: [] | number[],
    preference: [] | number[],
    extension: string,
    additional: [] | AdditionalType[],
    error: boolean | string
}

export type ResultsMethodCorrelations = {
    correlation: string,
    results: [] | number[][],
    methods: [] | AdditionalType[],
    error: boolean | string
}

export type ResultsMethodRankings = {
    ranking: [] | number[],
    methods: AdditionalType,
    error: boolean | string
}

export type ResultsRankingCorrelations = {
    correlation: string,
    results: [] | number[][],
    methods: [] | AdditionalType[],
    error: boolean | string
}

export type ResultsType = {
    method: [] | ResultsMethod[][],
    methodCorrelations: [] | ResultsMethodCorrelations[][],
    methodRankings: [] | ResultsMethodRankings[][][],
    rankingCorrelations: [] | ResultsRankingCorrelations[][]
}

export type RankingType = {
    order: [] | string[],
    ranking: [] | number[],
    error: null | string
}

export type CorrelationType = {
    method: string,
    correlation: number[][],
    error: null | string
}

export type MethodType = {
    method: string,
    weights: string
}

export type MethodCorrelationType = {
    correlation: string,
    data: [] | MethodType[]
}

export type MethodRankingItem = {
    method: string,
    weights: string,
    order: string
}

export type MethodRankingType = {
    data: [] | MethodRankingItem[]
}

export type RankingCorrelationType = {
    correlation: string,
    data: [] | MethodRankingItem[]
}

export type CalculationBodyType = {
    matrixFiles: [] | File[],
    matrix: [] | any,
    extensions: [] | string[],
    types: [] | string[][],
    method: [] | MethodType[][],
    methodCorrelations: [] | MethodCorrelationType[][],
    methodRankings: [] | MethodRankingType[][],
    rankingCorrelations: [] | RankingCorrelationType[][]
}

export type CalculationSliceState = {
    results: [] | ResultsType,
    rankingResults: [] | RankingType[],
    correlationResults: [] | CorrelationType[],
    methodParameters: [] | ParamsType[],
    alternatives: number,
    criteria: number,
    calculationBody: CalculationBodyType,
    matrixFileNames: [] | string[],
    loading: boolean,
    error: null | string
}

// BLOCKS TYPES --------------------------------------------------------------------------------

export type BlockType = {
    _id: number,
    type: string,
    method: string,
    inputConnections: [] | string[],
    outputConnections: [] | string[]
}


export type BlocksSliceState = {
    blocks: [] | BlockType[],
    clickedBlocks: [] | string[],
    connections: [] | string[][],
    activeBlock: null | MethodsItem | CorrelationsItem | DecisionMatrixItem | RankingItem | VisualizationItem | WeightsItem,
    clickedBlockId: null | number,
    draggedItem: null | string,
    modalOpen: boolean,
    modalType: null | string,
    connectionToDelete: null | string[]
}

export default DictionarySliceState


// DESCRIPTIONS TYPES ----------------------------------------------------------------------------

export type DescriptionType = {
    id: number,
    text: string
}

export type DataDescriptionType = {
    id: number,
    name: string,
    description: [] | DescriptionType[]
}

export type MethodsDescriptionType = {
    id: number,
    key: string,
    data: [] | DataDescriptionType[]
}

export type DescriptionsSliceState = {
    home: [] | DescriptionType[],
    methods: [] | MethodsDescriptionType[],
    loading: boolean,
    error: null | string
}