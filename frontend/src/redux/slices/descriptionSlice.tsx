import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'
import { DescriptionsSliceState, DescriptionType, MethodsDescriptionType } from '../types';

const BASE_URL = 'http://127.0.0.1:5000'

export const getHomeDescriptions = createAsyncThunk('descriptions/getHomeDescriptions', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/home`,)
  return data.data;
});

export const getMethodsDescriptions = createAsyncThunk('descriptions/getMethodsDescriptions', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/methods`,)
  return data.data;
});

const initialState: DescriptionsSliceState = {
  home: [],
  methods: [],
  loading: false,
  error: null
}

const descriptionsSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomeDescriptions.pending, (state: DescriptionsSliceState) => {
        state.loading = true;
      })
      .addCase(getHomeDescriptions.fulfilled, (state: DescriptionsSliceState, action: PayloadAction<DescriptionType[]>) => {
        state.home = action.payload;
        state.loading = false
      })
      .addCase(getHomeDescriptions.rejected, (state: DescriptionsSliceState) => {
        state.error = 'Error get descriptions home'
        state.loading = false
      })
      .addCase(getMethodsDescriptions.pending, (state: DescriptionsSliceState) => {
        state.loading = true;
      })
      .addCase(getMethodsDescriptions.fulfilled, (state: DescriptionsSliceState, action: PayloadAction<MethodsDescriptionType[]>) => {
        state.methods = action.payload;
        state.loading = false
      })
      .addCase(getMethodsDescriptions.rejected, (state: DescriptionsSliceState) => {
        state.error = 'Error get descriptions methods'
        state.loading = false
      })
  }
});
const { actions, reducer } = descriptionsSlice
export default reducer;
