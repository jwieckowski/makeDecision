import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios'
import { AboutSliceState, AboutDescriptionType } from '../types';
import { BASE_URL } from '../../common/const';

export const getAboutDescription = createAsyncThunk('about/description', async () => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/about`)
  return data.data;
});


export const getAboutFile = createAsyncThunk('about/aboutFile', async () => {
    const data = 
    await axios
        .get(`${BASE_URL}/api/v1/files/about`)
        .then(response => {
          if (!Object.keys(response.data).includes('result')) return []
          return response.data.result.map((data: any) => {
            return "data:;base64," + data
          })
        })
    return data
});


const initialState: AboutSliceState = {
  about: [],
  file: null,
  loading: false,
  error: null
}

const aboutSlice = createSlice({
  name: 'about',
  initialState: initialState,
  reducers: {

  },
  extraReducers: (builder) => {
    builder
      .addCase(getAboutDescription.pending, (state: AboutSliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(getAboutDescription.fulfilled, (state: AboutSliceState, action: PayloadAction<AboutDescriptionType[]>) => {
        state.about = action.payload;
        state.loading = false
      })
      .addCase(getAboutDescription.rejected, (state: AboutSliceState) => {
        state.error = 'Error occurred while getting data from server'
        state.loading = false
      })
      .addCase(getAboutFile.pending, (state: AboutSliceState) => {
        state.error = null
        state.loading = true;
      })
      .addCase(getAboutFile.fulfilled, (state: AboutSliceState, action: PayloadAction<any>) => {
        state.file = action.payload;
        state.loading = false
      })
      .addCase(getAboutFile.rejected, (state: AboutSliceState) => {
        state.error = 'Error occurred while getting data from server'
        state.loading = false
      })
    }
  });
const { actions, reducer } = aboutSlice
export default reducer;
