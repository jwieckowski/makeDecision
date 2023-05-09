import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CalculationSliceState,
  ResultsType,
  CalculationBodyType,
  MatrixBodyType,
} from "../types";
import { BASE_URL } from "../../common/const";

export const getMatrix = createAsyncThunk(
  "calculations/getMatrix",
  async (body: any) => {
    const data = await axios.post(`${BASE_URL}/api/v1/matrix`, body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return data.data;
  }
);

export const getResults = createAsyncThunk(
  "calculations/getResults",
  async (params: CalculationBodyType) => {
    const data = await axios.post(`${BASE_URL}/api/v1/results`, params);
    return data.data;
  }
);

const initialState: CalculationSliceState = {
  results: [],
  rankingResults: [],
  correlationResults: [],
  methodParameters: [],
  alternatives: 3,
  criteria: 3,
  calculationBody: {
    matrixFiles: [],
  },
  convertedMatrix: [],
  loading: false,
  error: null,
};

const calculationSlice = createSlice({
  name: "calculations",
  initialState: initialState,
  reducers: {
    addMethodParameters: (state, action) => {
      state.methodParameters = [action.payload, ...state.methodParameters];
    },
    setAlternatives: (state, action) => {
      state.alternatives = action.payload;
    },
    setCriteria: (state, action) => {
      state.criteria = action.payload;
    },
    addMatrixFile: (state, action) => {
      state.calculationBody.matrixFiles = [
        ...state.calculationBody.matrixFiles,
        action.payload,
      ];
    },
    clearMatrixFiles: (state, action) => {
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
      state.error = null;
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
          state.loading = false;
        }
      )
      .addCase(
        getResults.rejected,
        (state: CalculationSliceState, action: PayloadAction<any>) => {
          state.error =
            "Error occurred while getting calculation results from server";
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
          state.error = "Error occurred while getting matrix from server";
          state.loading = false;
        }
      );
  },
});
const { actions, reducer } = calculationSlice;
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
