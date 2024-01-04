import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// API
import { uploadMatrixFile, generateMatrix, getResults, getKwargsItems } from '@/api/calculations';

// TYPES
import { CalculationSliceState, ResultsNode } from '@/types';

const initialState: CalculationSliceState = {
  results: [],
  filteredResults: null,
  rankingResults: [],
  correlationResults: [],
  alternatives: 3,
  criteria: 3,
  calculationBody: {
    matrixFiles: [],
  },
  convertedMatrix: null,
  loading: false,
  error: null,
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
      state.error = null;
    },
    setFilteredResults: (state, action) => {
      state.filteredResults = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getResults.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getResults.fulfilled, (state: CalculationSliceState, action: PayloadAction<ResultsNode[]>) => {
        state.results = action.payload;
        // state.filteredResults = action.payload;
        state.loading = false;
      })
      .addCase(getResults.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.results = [];
        state.filteredResults = null;
        state.error = action.payload.response.data.message;
        state.loading = false;
      })
      .addCase(uploadMatrixFile.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(uploadMatrixFile.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.convertedMatrix = action.payload;
        state.loading = false;
      })
      .addCase(uploadMatrixFile.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.error = action.payload.response.data.message;
        state.loading = false;
      })
      .addCase(generateMatrix.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(generateMatrix.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.convertedMatrix = action.payload;
        state.loading = false;
      })
      .addCase(generateMatrix.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.error = action.payload.response.data.message;
        state.loading = false;
      })
      .addCase(getKwargsItems.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(getKwargsItems.fulfilled, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.methodsKwargsItems = { ...state.methodsKwargsItems, ...action.payload };
        state.loading = false;
      })
      .addCase(getKwargsItems.rejected, (state: CalculationSliceState, action: PayloadAction<any>) => {
        state.error = action.payload.response.data.message;
        state.loading = false;
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
