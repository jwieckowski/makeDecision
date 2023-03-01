import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'
import { DescriptionsSliceState, DescriptionType, MethodsDescriptionType } from '../types';
import { BASE_URL } from '../../common/const';

export const getHomeDescriptions = createAsyncThunk('descriptions/getHomeDescriptions', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/home`)
  return data.data;
});

export const getMethodsDescriptions = createAsyncThunk('descriptions/getMethodsDescriptions', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/methods`)
  return data.data;
});

const initialState: DescriptionsSliceState = {
  home: [],
  methods: [],
  loading: false,
  error: null
}

const descriptionsSlice = createSlice({
  name: 'descriptions',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getHomeDescriptions.pending, (state: DescriptionsSliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(getHomeDescriptions.fulfilled, (state: DescriptionsSliceState, action: PayloadAction<DescriptionType[]>) => {
        state.home = action.payload;
        state.loading = false
      })
      .addCase(getHomeDescriptions.rejected, (state: DescriptionsSliceState) => {
        state.error = 'Error occurred while getting data from server'
        state.loading = false
      })
      .addCase(getMethodsDescriptions.pending, (state: DescriptionsSliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(getMethodsDescriptions.fulfilled, (state: DescriptionsSliceState, action: PayloadAction<MethodsDescriptionType[]>) => {
        state.methods = action.payload;
        state.loading = false
      })
      .addCase(getMethodsDescriptions.rejected, (state: DescriptionsSliceState) => {
        state.error = 'Error occurred while getting data from server'
        state.loading = false
      })
    }
  });
const { reducer } = descriptionsSlice
export default reducer;
