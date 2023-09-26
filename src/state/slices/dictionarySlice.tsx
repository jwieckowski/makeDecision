import { createSlice,  PayloadAction } from "@reduxjs/toolkit";

// API
import { fetchAllMethods } from "@/api/dictionary";

// TYPES
import { DictionarySliceState, AllMethodsItem } from "@/types";

const initialState: DictionarySliceState = {
  allMethods: [],
  loading: false,
  error: null,
};

const dictionarySlice = createSlice({
  name: "dictionary",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMethods.pending, (state: DictionarySliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        fetchAllMethods.fulfilled,
        (
          state: DictionarySliceState,
          action: PayloadAction<AllMethodsItem[]>
        ) => {
          state.allMethods = action.payload;
          state.loading = false;
        }
      )
      .addCase(fetchAllMethods.rejected, (state: DictionarySliceState) => {
        state.error = "Error occurred while getting data from server";
        state.loading = false;
      });
  },
});
const { reducer } = dictionarySlice;
export default reducer;
