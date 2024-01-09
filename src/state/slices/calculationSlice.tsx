import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// API
import { uploadMatrixFile, generateMatrix, getResults, getKwargsItems } from '@/api/calculations';

// TYPES
import { CalculationSliceState, ResultsNode } from '@/types';

const initialState: CalculationSliceState = {
  results: [],
  filteredResults: [],
  rankingResults: [],
  correlationResults: [],
  alternatives: 3,
  criteria: 3,
  calculationBody: {
    matrixFiles: [],
  },
  convertedMatrix: null,
  resultsLoading: false,
  kwargsLoading: false,
  matrixLoading: false,
  error: null,
  resultsError: null,
  matrixId: [],
  methodsKwargsItems: {},
};

const calculationSlice = createSlice({
  name: 'calculations',
  initialState: initialState,
  reducers: {
    setAlternatives: (state, action) => {
      state.alternatives = action.payload;
    },
    setCriteria: (state, action) => {
      state.criteria = action.payload;
    },
    resetConvertedMatrix: (state) => {
      state.convertedMatrix = null;
    },
    addMatrixFile: (state, action) => {
      state.calculationBody.matrixFiles = [...state.calculationBody.matrixFiles, action.payload];
    },
    clearMatrixFiles: (state) => {
      state.calculationBody.matrixFiles = [];
    },
    clearBody: (state) => {
      state.calculationBody = {
        ...initialState.calculationBody,
      };
    },
    resetBody: (state) => {
      state.calculationBody = initialState.calculationBody;
    },
    resetResults: (state) => {
      state.results = initialState.results;
      state.filteredResults = initialState.filteredResults;
      state.resultsError = null;
      state.error = null;
    },
    setFilteredResults: (state, action) => {
      state.filteredResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResults.pending, (state: CalculationSliceState) => {
        state.resultsError = null;
        state.resultsLoading = true;
      })
      .addCase(getResults.fulfilled, (state: CalculationSliceState, action: PayloadAction<ResultsNode[]>) => {
        state.results = action.payload;
        state.filteredResults = action.payload;
        state.resultsLoading = false;
      })
      .addCase(getResults.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.results = [];
        state.filteredResults = [];
        if (action.payload?.response?.data) {
          state.resultsError = action.payload.response.data.message;
        } else {
          state.resultsError = action.payload.message;
        }
        state.resultsLoading = false;
      })
      .addCase(uploadMatrixFile.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.matrixLoading = true;
      })
      .addCase(uploadMatrixFile.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.convertedMatrix = action.payload;
        state.matrixLoading = false;
      })
      .addCase(uploadMatrixFile.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        if (action.payload?.response?.data) {
          state.error = action.payload.response.data.message;
        } else {
          state.error = action.payload.message;
        }
        state.matrixLoading = false;
      })
      .addCase(generateMatrix.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.matrixLoading = true;
      })
      .addCase(generateMatrix.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.convertedMatrix = action.payload;
        state.matrixLoading = false;
      })
      .addCase(generateMatrix.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        if (action.payload?.response?.data) {
          state.error = action.payload.response.data.message;
        } else {
          state.error = action.payload.message;
        }
        state.matrixLoading = false;
      })
      .addCase(getKwargsItems.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.kwargsLoading = true;
      })
      .addCase(getKwargsItems.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.methodsKwargsItems = { ...state.methodsKwargsItems, ...action.payload };
        state.kwargsLoading = false;
      })
      .addCase(getKwargsItems.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        if (action.payload?.response?.data) {
          state.error = action.payload.response.data.message;
        } else {
          state.error = action.payload.message;
        }
        state.kwargsLoading = false;
      });
  },
});
const { actions, reducer } = calculationSlice;
export const {
  setAlternatives,
  setCriteria,
  addMatrixFile,
  clearMatrixFiles,
  clearBody,
  resetBody,
  resetResults,
  resetConvertedMatrix,
  setFilteredResults,
} = actions;
export default reducer;
