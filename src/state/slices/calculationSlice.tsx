import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// API
import { getMatrix, getResults } from "@/api/calculations";

// TYPES
import {
  CalculationSliceState,
  ResultsType,
} from "@/types";

const initialState: CalculationSliceState = {
  results: null,
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
};

const calculationSlice = createSlice({
  name: "calculations",
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
      state.calculationBody.matrixFiles = [
        ...state.calculationBody.matrixFiles,
        action.payload,
      ];
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
    setCalculationMatrixId: (state, action) => {
      state.matrixId = action.payload;
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
      .addCase(
        getResults.fulfilled,
        (state: CalculationSliceState, action: PayloadAction<ResultsType>) => {
          state.results = action.payload;
          state.filteredResults = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        getResults.rejected,
        (state: CalculationSliceState, action: PayloadAction<any>) => {
          state.results = null;
          state.filteredResults = null;
          state.error = action.payload.response.data.message;
          state.loading = false;
        }
      )
      .addCase(getMatrix.pending, (state: CalculationSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getMatrix.fulfilled,
        (state: CalculationSliceState, action: PayloadAction<any>) => {
          state.convertedMatrix = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        getMatrix.rejected,
        (state: CalculationSliceState, action: PayloadAction<any>) => {
          state.error = action.payload.response.data.message;
          state.loading = false;
        }
      );
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
  setCalculationMatrixId,
  setFilteredResults,
} = actions;
export default reducer;