import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// API
import { getHomeDescriptions, getMethodsDescriptions } from "@/api/descriptions";

// TYPES
import {
  DescriptionsSliceState,
  DescriptionType,
  MethodsDescriptionType,
} from "@/types";

const initialState: DescriptionsSliceState = {
  home: [],
  methods: [],
  loading: false,
  error: null,
};

const descriptionsSlice = createSlice({
  name: "descriptions",
  initialState: initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getHomeDescriptions.pending, (state: DescriptionsSliceState) => {
        state.error = null;
        state.loading = true;
      })
      .addCase(
        getHomeDescriptions.fulfilled,
        (
          state: DescriptionsSliceState,
          action: PayloadAction<DescriptionType[]>
        ) => {
          state.home = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        getHomeDescriptions.rejected,
        (state: DescriptionsSliceState) => {
          state.error = "Error occurred while getting data from server";
          state.loading = false;
        }
      )
      .addCase(
        getMethodsDescriptions.pending,
        (state: DescriptionsSliceState) => {
          state.error = null;
          state.loading = true;
        }
      )
      .addCase(
        getMethodsDescriptions.fulfilled,
        (
          state: DescriptionsSliceState,
          action: PayloadAction<MethodsDescriptionType[]>
        ) => {
          state.methods = action.payload;
          state.loading = false;
        }
      )
      .addCase(
        getMethodsDescriptions.rejected,
        (state: DescriptionsSliceState) => {
          state.error = "Error occurred while getting data from server";
          state.loading = false;
        }
      );
  },
});
const { reducer } = descriptionsSlice;
export default reducer;
