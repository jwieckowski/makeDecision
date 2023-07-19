import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";
import {
  CalculationSliceState,
  ResultsType,
  CalculationBodyType,
  MatrixBodyType,
} from "../types";
import { BASE_URL } from "../../common/const";

type GetMatrixProps = {
  locale: string;
  body: any;
};

type GetResultsProps = {
  locale: string;
  params: CalculationBodyType;
};

export const getMatrix = createAsyncThunk(
  "calculations/getMatrix",
  async ({ locale, body }: GetMatrixProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/api/v1/matrix`, body, {
        headers: {
          locale: locale,
          "Content-Type": "multipart/form-data",
        },
      });
      return data.data;
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

export const getResults = createAsyncThunk(
  "calculations/getResults",
  async ({ locale, params }: GetResultsProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/api/v1/results`, params, {
        headers: {
          locale: locale,
        },
      });
      return data.data;
    } catch (e) {
      throw rejectWithValue(e);
    }
  }
);

const initialState: CalculationSliceState = {
  results: null,
  filteredResults: null,
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
  matrixId: [],
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
    resetConvertedMatrix: (state) => {
      state.convertedMatrix = [];
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
  addMethodParameters,
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
