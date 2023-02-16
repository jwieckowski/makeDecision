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
    matrixFiles: [],
    matrix: [],
    extensions: [],
    types: [],
    method: [],
    methodCorrelations: [],
    methodRankings: [],
    rankingCorrelations: []
  },
  matrixFileNames: [],
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
    addMatrixFile: (state, action) => {
      state.calculationBody.matrixFiles = [...state.calculationBody.matrixFiles, action.payload]
    },
    clearMatrixFiles: (state, action) => {
      state.calculationBody.matrixFiles = []
    },
    addBodyMatrix: (state, action) => {
      state.calculationBody.matrix = [...state.calculationBody.matrix, action.payload]
    },
    addBodyExtension: (state, action) => {
      if (action.payload.id < 0) {
        state.calculationBody.extensions = [...state.calculationBody.extensions, action.payload.extension]
      }
      else if (state.calculationBody.extensions.length >= action.payload.id) {
        state.calculationBody.extensions = state.calculationBody.extensions.map((e, idx) => {
          return idx === action.payload.id
            ? action.payload.extension
            : e
        })
      }
    },
    deleteBodyExtension: (state, action) => {
      state.calculationBody.extensions = state.calculationBody.extensions.filter((e, idx) => idx !== action.payload.id)
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
      state.calculationBody = {
        ...initialState.calculationBody,
        extensions: state.calculationBody.extensions
      }
    },
    resetBody: (state) => {
      state.calculationBody = initialState.calculationBody
      state.matrixFileNames = initialState.matrixFileNames
    },
    resetResults: (state) => {
      state.results = initialState.results
    },
    addMatrixFileName: (state, action) => {
      if (action.payload.id+1 > state.matrixFileNames.length) {
        state.matrixFileNames = [...state.matrixFileNames, action.payload.name]
      } else {
        state.matrixFileNames = state.matrixFileNames.map((f, idx) => {
          return idx === action.payload.id
            ? action.payload.name
            : f
        })
      }
    },
    deleteMatrixFileName: (state, action) => {
      state.matrixFileNames = state.matrixFileNames.filter((m, idx) => idx !== action.payload.id)
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResults.pending, (state: CalculationSliceState) => {
        state.loading = true;
      })
      .addCase(getResults.fulfilled, (state: CalculationSliceState, action: PayloadAction<ResultsType>) => {
        state.results = action.payload
        state.loading = false;
      })
      .addCase(getResults.rejected, (state: CalculationSliceState) => {
        state.error = 'Error get results';
        state.loading = false;
      })
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
      .addCase(getRanking.pending, (state: CalculationSliceState) => {
        state.loading = true;
      })
      .addCase(getRanking.fulfilled, (state: CalculationSliceState, action: PayloadAction<RankingType[]>) => {
        state.rankingResults = action.payload
        state.loading = false;
      })
      .addCase(getRanking.rejected, (state: CalculationSliceState, action) => {
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
  addMatrixFile,
  clearMatrixFiles,
  addBodyMatrix,
  addBodyExtension,
  deleteBodyExtension,
  addBodyTypes,
  addBodyMethod,
  addBodyMethodCorrelations,
  addBodyMethodRankings,
  addBodyRankingCorrelations,
  clearBody,
  resetBody,
  resetResults,
  addMatrixFileName,
  deleteMatrixFileName
} = actions;
export default reducer;
