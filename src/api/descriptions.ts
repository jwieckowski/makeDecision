import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL, REQUEST_TIMEOUT_SHORT } from '@/common/const';

const getHomeDescriptions = createAsyncThunk('descriptions/getHomeDescriptions', async (locale: string) => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/home`, {
    headers: {
      locale: locale,
    },
  });
  return data.data;
});

const getMethodsDescriptions = createAsyncThunk(
  'descriptions/getMethodsDescriptions',
  async (locale: string, { rejectWithValue }) => {
    try {
      const data = await axios.get(`${BASE_URL}/api/v1/descriptions/methods`, {
        headers: {
          locale: locale,
        },
        timeout: REQUEST_TIMEOUT_SHORT,
      });
      return data.data.response;
    } catch (err) {
      return rejectWithValue('Timeout error');
    }
  },
);

export { getHomeDescriptions, getMethodsDescriptions };
