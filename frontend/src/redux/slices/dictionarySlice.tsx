import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'

import DictionarySliceState, {AllMethodsItem} from '../types'
import { BASE_URL } from '../../common/const';

export const fetchAllMethods = createAsyncThunk('dictionary/fetchAllMethods', async () => {
  // const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods/primary`)
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods`)
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
      .addCase(fetchAllMethods.pending, (state: DictionarySliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(fetchAllMethods.fulfilled, (state: DictionarySliceState, action: PayloadAction<AllMethodsItem[]>) => {
        state.allMethods = action.payload
        state.loading = false;
      })
      .addCase(fetchAllMethods.rejected, (state: DictionarySliceState) => {
        state.error = 'Error occurred while getting data from server';
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
