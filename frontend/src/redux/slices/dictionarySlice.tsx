import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'

import DictionarySliceState, { 
  AllMethodsItem,
  MethodsItem,
  CorrelationsItem,
  DecisionMatrixItem,
  DefuzzificationsItem,
  DistancesItem,
  NormalizationsItem,
  RankingItem,
  VisualizationItem,
  WeightsItem,
} from '../types'

const BASE_URL = 'http://127.0.0.1:5000'

export const fetchAllMethods = createAsyncThunk('dictionary/fetchAllMethods', async () => {
  // const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods/primary`)
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods`)
  return data.data;
});

export const fetchMethods = createAsyncThunk('dictionary/fetchMethods', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/methods`);
  return data.data;
});

export const fetchSingleMethod = createAsyncThunk('dictionary/fetchSingleMethods', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/methods/${id}`);
  return data.data;
});

export const fetchCorrelations = createAsyncThunk('dictionary/fetchCorrelations', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/correlations`);
  return data.data;
});

export const fetchSingleCorrelation = createAsyncThunk('dictionary/fetchSingleCorrelation', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/correlations/${id}`);
  return data.data;
});

export const fetchDecisionMatrix = createAsyncThunk('dictionary/fetchDecisionMatrix', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/decision-matrix`);
  return data.data;
});

export const fetchSingleDecisionMatrix = createAsyncThunk('dictionary/fetchSingleDecisionMatrix', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/decision-matrix/${id}`);
  return data.data;
});

export const fetchDefuzzifications = createAsyncThunk('dictionary/fetchDefuzzifications', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/defuzzifications`);
  return data.data;
});

export const fetchSingleDefuzzification = createAsyncThunk('dictionary/fetchSingleDefuzzification', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/defuzzifications/${id}`);
  return data.data;
});

export const fetchDistances = createAsyncThunk('dictionary/fetchDistances', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/distances`);
  return data.data;
});

export const fetchSingleDistance = createAsyncThunk('dictionary/fetchSingleDistance', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/distances/${id}`);
  return data.data;
});

export const fetchNormalizations = createAsyncThunk('dictionary/fetchNormalizations', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/normalizations`);
  return data.data;
});

export const fetchSingleNormalization = createAsyncThunk('dictionary/fetchSingleNormalization', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/normalizations/${id}`);
  return data.data;
});

export const fetchRanking = createAsyncThunk('dictionary/fetchRanking', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/ranking`);
  return data.data;
});

export const fetchSingleRanking = createAsyncThunk('dictionary/fetchSingleRanking', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/ranking/${id}`);
  return data.data;
});

export const fetchVisualization = createAsyncThunk('dictionary/fetchVisualization', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/visualization`);
  return data.data;
});

export const fetchSingleVisualization = createAsyncThunk('dictionary/fetchSingleVisualization', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/visualization/${id}`);
  return data.data;
});

export const fetchWeights = createAsyncThunk('dictionary/fetchWeights', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/weights`);
  return data.data;
});

export const fetchSingleWeight = createAsyncThunk('dictionary/fetchSingleWeight', async (id: number) => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/weights/${id}`);
  return data.data;
});

const initialState: DictionarySliceState = {
  allMethods: [],
  methods: [],
  methodItem: null,
  correlations: [],
  correlationItem: null,
  decisionMatrix: [],
  decisionMatrixItem: null,
  defuzzifications: [],
  defuzzificationItem: null,
  distances: [],
  distanceItem: null,
  normalizations: [],
  normalizationItem: null,
  ranking: [],
  rankingItem: null,
  visualization: [],
  visualizationItem: null,
  weights: [],
  weightItem: null,
  loading: false,
  error: null
}

const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState: initialState,
  reducers: {
    setMethodItem: (state, action) => {
      state.methodItem = action.payload
    },
    setCorrelationItem: (state, action) => {
      state.correlationItem = action.payload
    },
    setDecisionMatrixItem: (state, action) => {
      state.decisionMatrixItem = action.payload
    },
    setRankingItem: (state, action) => {
      state.rankingItem = action.payload
    },
    setVisualizationItem: (state, action) => {
      state.visualizationItem = action.payload
    },
    setWeightItem: (state, action) => {
      state.weightItem = action.payload
    }
  },
  extraReducers: (builder) => {
    builder
    //  fetch All Methods
      .addCase(fetchAllMethods.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchAllMethods.fulfilled, (state: DictionarySliceState, action: PayloadAction<AllMethodsItem[]>) => {
        state.allMethods = action.payload
        state.loading = false;
      })
      .addCase(fetchAllMethods.rejected, (state: DictionarySliceState) => {
        state.error = 'Error fetch all methods';
        state.loading = false;
      })
      // fetch Methods
      .addCase(fetchMethods.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchMethods.fulfilled, (state: DictionarySliceState, action: PayloadAction<MethodsItem[]>) => {
        state.methods = action.payload
        state.loading = false;
      })
      .addCase(fetchMethods.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch methods';
        state.loading = false;
      })
      .addCase(fetchSingleMethod.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleMethod.fulfilled, (state: DictionarySliceState, action: PayloadAction<MethodsItem>) => {
        state.methodItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleMethod.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single method';
        state.loading = false;
      })
      // fetch Correlations
      .addCase(fetchCorrelations.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchCorrelations.fulfilled, (state: DictionarySliceState, action: PayloadAction<CorrelationsItem[]>) => {
        state.correlations = action.payload
        state.loading = false;
      })
      .addCase(fetchCorrelations.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch correlations';
        state.loading = false;
      })
      .addCase(fetchSingleCorrelation.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleCorrelation.fulfilled, (state: DictionarySliceState, action: PayloadAction<CorrelationsItem>) => {
        state.correlationItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleCorrelation.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single correlation';
        state.loading = false;
      })
      // fetch Decision Matrix
      .addCase(fetchDecisionMatrix.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchDecisionMatrix.fulfilled, (state: DictionarySliceState, action: PayloadAction<DecisionMatrixItem[]>) => {
        state.decisionMatrix = action.payload
        state.loading = false;
      })
      .addCase(fetchDecisionMatrix.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch decision matrix';
        state.loading = false;
      })
      .addCase(fetchSingleDecisionMatrix.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleDecisionMatrix.fulfilled, (state: DictionarySliceState, action: PayloadAction<DecisionMatrixItem>) => {
        state.decisionMatrixItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleDecisionMatrix.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single input for decision matrix';
        state.loading = false;
      })
      // fetch Defuzzifications
      .addCase(fetchDefuzzifications.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchDefuzzifications.fulfilled, (state: DictionarySliceState, action: PayloadAction<DefuzzificationsItem[]>) => {
        state.defuzzifications = action.payload
        state.loading = false;
      })
      .addCase(fetchDefuzzifications.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch defuzzifications';
        state.loading = false;
      })
      .addCase(fetchSingleDefuzzification.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleDefuzzification.fulfilled, (state: DictionarySliceState, action: PayloadAction<DefuzzificationsItem>) => {
        state.defuzzificationItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleDefuzzification.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single defuzzification';
        state.loading = false;
      })
      // fetch Distances
      .addCase(fetchDistances.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchDistances.fulfilled, (state: DictionarySliceState, action: PayloadAction<DistancesItem[]>) => {
        state.distances = action.payload
        state.loading = false;
      })
      .addCase(fetchDistances.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch distances';
        state.loading = false;
      })
      .addCase(fetchSingleDistance.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleDistance.fulfilled, (state: DictionarySliceState, action: PayloadAction<DistancesItem>) => {
        state.distanceItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleDistance.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single distance';
        state.loading = false;
      })
      // fetch Normalizations
      .addCase(fetchNormalizations.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchNormalizations.fulfilled, (state: DictionarySliceState, action: PayloadAction<NormalizationsItem[]>) => {
        state.normalizations = action.payload
        state.loading = false;
      })
      .addCase(fetchNormalizations.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch normalizations';
        state.loading = false;
      })
      .addCase(fetchSingleNormalization.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleNormalization.fulfilled, (state: DictionarySliceState, action: PayloadAction<NormalizationsItem>) => {
        state.normalizationItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleNormalization.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single normalization';
        state.loading = false;
      })
      // fetch Ranking
      .addCase(fetchRanking.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchRanking.fulfilled, (state: DictionarySliceState, action: PayloadAction<RankingItem[]>) => {
        state.ranking = action.payload
        state.loading = false;
      })
      .addCase(fetchRanking.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch ranking';
        state.loading = false;
      })
      .addCase(fetchSingleRanking.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleRanking.fulfilled, (state: DictionarySliceState, action: PayloadAction<RankingItem>) => {
        state.rankingItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleRanking.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single ranking order';
        state.loading = false;
      })
      // fetch Visualization
      .addCase(fetchVisualization.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchVisualization.fulfilled, (state: DictionarySliceState, action: PayloadAction<VisualizationItem[]>) => {
        state.visualization = action.payload
        state.loading = false;
      })
      .addCase(fetchVisualization.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch visualization';
        state.loading = false;
      })
      .addCase(fetchSingleVisualization.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleVisualization.fulfilled, (state: DictionarySliceState, action: PayloadAction<VisualizationItem>) => {
        state.visualizationItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleVisualization.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single visualization method';
        state.loading = false;
      })
      // fetch Weights
      .addCase(fetchWeights.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchWeights.fulfilled, (state: DictionarySliceState, action: PayloadAction<WeightsItem[]>) => {
        state.weights = action.payload
        state.loading = false;
      })
      .addCase(fetchWeights.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch weights';
        state.loading = false;
      })
      .addCase(fetchSingleWeight.pending, (state: DictionarySliceState) => {
        state.loading = true;
      })
      .addCase(fetchSingleWeight.fulfilled, (state: DictionarySliceState, action: PayloadAction<WeightsItem>) => {
        state.weightItem = action.payload
        state.loading = false;
      })
      .addCase(fetchSingleWeight.rejected,  (state: DictionarySliceState) => {
        state.error = 'Error fetch single weight';
        state.loading = false;
      })
  }
});
const { actions, reducer } = dictionarySlice
export const { 
  setMethodItem,
  setCorrelationItem,
  setDecisionMatrixItem,
  setRankingItem,
  setVisualizationItem,
  setWeightItem
} = actions;
export default reducer;
