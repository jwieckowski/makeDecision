import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'
import { 
  CalculationSliceState,
  ResultsType,
  CalculationBodyType
} from '../types'
import { BASE_URL } from '../../common/const';

export const getResults = createAsyncThunk('calculations/getResults', async (params: CalculationBodyType) => {
  const data = await axios.post(`${BASE_URL}/api/v1/results`, params)
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
    matrixFiles: []
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
    addMatrixFile: (state, action) => {
      state.calculationBody.matrixFiles = [...state.calculationBody.matrixFiles, action.payload]
    },
    clearMatrixFiles: (state, action) => {
      state.calculationBody.matrixFiles = []
    },
    clearBody: (state) => {
      state.calculationBody = {
        ...initialState.calculationBody,
      }
    },
    resetBody: (state) => {
      state.calculationBody = initialState.calculationBody
    },
    resetResults: (state) => {
      state.results = initialState.results
      state.error = null
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResults.pending, (state: CalculationSliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(getResults.fulfilled, (state: CalculationSliceState, action: PayloadAction<ResultsType>) => {
        state.results = action.payload
        state.loading = false;
      })
      .addCase(getResults.rejected, (state: CalculationSliceState, action) => {
        console.log(action.payload)
        state.error = 'Error occurred while getting calculation results from server';
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
  clearBody,
  resetBody,
  resetResults,
} = actions;
export default reducer;
