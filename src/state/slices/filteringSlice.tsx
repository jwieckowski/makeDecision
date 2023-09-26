import { createSlice } from "@reduxjs/toolkit";
import { FilteringSliceState } from "@/types";

const initialState: FilteringSliceState = {
  matrixFilter: "",
  methodFilter: "",
  correlationFilter: "",
};

const filteringSlice = createSlice({
  name: "filtering",
  initialState: initialState,
  reducers: {
    setMatrixFilter: (state, action) => {
      state.matrixFilter = action.payload;
    },
    setMethodFilter: (state, action) => {
      state.methodFilter = action.payload;
    },
    setCorrelationFilter: (state, action) => {
      state.correlationFilter = action.payload;
    },
    clearFilters: () => initialState,
  },
});
const { actions, reducer } = filteringSlice;
export const {
  setMatrixFilter,
  setMethodFilter,
  setCorrelationFilter,
  clearFilters,
} = actions;
export default reducer;
