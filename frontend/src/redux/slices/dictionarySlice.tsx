import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'

import {DictionarySliceState, AllMethodsItem} from '../types'
import { BASE_URL } from '../../common/const';

export const fetchAllMethods = createAsyncThunk('dictionary/fetchAllMethods', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods`)
  return data.data;
});

const initialState: DictionarySliceState = {
  allMethods: [],
  loading: false,
  error: null
}

const dictionarySlice = createSlice({
  name: 'dictionary',
  initialState: initialState,
  reducers: {
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMethods.pending, (state: DictionarySliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(fetchAllMethods.fulfilled, (state: DictionarySliceState, action: PayloadAction<AllMethodsItem[]>) => {
        state.allMethods = action.payload
        state.loading = false;
      })
      .addCase(fetchAllMethods.rejected, (state: DictionarySliceState) => {
        state.error = 'Error occurred while getting data from server';
        state.loading = false;
      })
  }
});
const { reducer } = dictionarySlice
export default reducer;
