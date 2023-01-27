import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'
import { 
  CalculationSliceState,
  ResultsBodyType,
  ResultsType, 
  RankingBodyType, 
  RankingType, 
  CorrelationBodyType, 
  CorrelationType, 
  CalculationBodyType
} from '../types'

const BASE_URL = 'http://127.0.0.1:5000'

export const getResults = createAsyncThunk('calculations/getResults', async (params: CalculationBodyType) => {
// export const getResults = createAsyncThunk('calculations/getResults', async (params: ResultsBodyType) => {
  const data = await axios.post(`${BASE_URL}/api/v1/results`, params)
  return data.data;
});

export const getRanking = createAsyncThunk('calculations/getRanking', async (params: RankingBodyType) => {
  const data = await axios.post(`${BASE_URL}/api/v1/ranking`, params)
  return data.data;
});

export const getCorrelations = createAsyncThunk('calculations/getCorrelations', async (params: CorrelationBodyType) => {
  const data = await axios.post(`${BASE_URL}/api/v1/correlation`, params)
  return data.data;
});

const initialState: CalculationSliceState = {
  results: [],
  rankingResults: [],
  correlationResults: [],
  methodParameters: [],
  alternatives: 3,
  criteria: 3,
  calculationBody: {
    matrix: [],
    extensions: [],
    types: [],
    method: [],
    methodCorrelations: [],
    methodRankings: [],
    rankingCorrelations: []
  },
  loading: false,
  error: null
}


const calculationSlice = createSlice({
  name: 'calculations',
  initialState: initialState,
  reducers: {
    addMethodParameters: (state, action) => {
      state.methodParameters = [action.payload, ...state.methodParameters]
    },
    setAlternatives: (state, action) => {
      state.alternatives = action.payload
    },
    setCriteria: (state, action) => {
      state.criteria = action.payload
    },
    addBodyMatrix: (state, action) => {
      state.calculationBody.matrix = [...state.calculationBody.matrix, action.payload]
    },
    addBodyExtension: (state, action) => {
      state.calculationBody.extensions = [...state.calculationBody.extensions, action.payload]
    },
    addBodyTypes: (state, action) => {
      state.calculationBody.types = [...state.calculationBody.types, [...action.payload]]
    },
    addBodyMethod: (state, action) => {
      state.calculationBody.method = [...state.calculationBody.method, [...action.payload]]
    },
    addBodyMethodCorrelations: (state, action) => {
      state.calculationBody.methodCorrelations = [...state.calculationBody.methodCorrelations, [...action.payload]]
    },
    addBodyMethodRankings: (state, action) => {
      state.calculationBody.methodRankings = [...state.calculationBody.methodRankings, [...action.payload]]
    },
    addBodyRankingCorrelations: (state, action) => {
      state.calculationBody.rankingCorrelations = [...state.calculationBody.rankingCorrelations, [...action.payload]]
    },
    clearBody: (state) => {
      state.calculationBody = initialState.calculationBody
    }
  },
  extraReducers: (builder) => {
    builder
      // all results
      .addCase(getResults.pending, (state: CalculationSliceState) => {
        state.loading = true;
      })
      .addCase(getResults.fulfilled, (state: CalculationSliceState, action: PayloadAction<ResultsType[]>) => {
        state.results = action.payload
        state.loading = false;
      })
      .addCase(getResults.rejected, (state: CalculationSliceState) => {
        state.error = 'Error get results';
        state.loading = false;
      })
      // correlation
      .addCase(getCorrelations.pending, (state: CalculationSliceState) => {
        state.loading = true;
      })
      .addCase(getCorrelations.fulfilled, (state: CalculationSliceState, action: PayloadAction<CorrelationType[]>) => {
        state.correlationResults = action.payload
        state.loading = false;
      })
      .addCase(getCorrelations.rejected, (state: CalculationSliceState) => {
        state.error = 'Error get correlation';
        state.loading = false;
      })
      // ranking
      .addCase(getRanking.pending, (state: CalculationSliceState) => {
        state.loading = true;
      })
      .addCase(getRanking.fulfilled, (state: CalculationSliceState, action: PayloadAction<RankingType[]>) => {
        state.rankingResults = action.payload
        state.loading = false;
      })
      .addCase(getRanking.rejected, (state: CalculationSliceState, action) => {
        console.log(action)
        state.error = 'Error get ranking';
        state.loading = false;
      })
  }
});
const { actions, reducer } = calculationSlice
export const { 
  addMethodParameters,
  setAlternatives, 
  setCriteria,
  addBodyMatrix,
  addBodyExtension,
  addBodyTypes,
  addBodyMethod,
  addBodyMethodCorrelations,
  addBodyMethodRankings,
  addBodyRankingCorrelations,
  clearBody
} = actions;
export default reducer;
