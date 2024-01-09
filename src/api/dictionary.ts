import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL, REQUEST_TIMEOUT_SHORT } from '@/common/const';

const fetchAllMethods = createAsyncThunk('dictionary/fetchAllMethods', async (locale: string, { rejectWithValue }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods`, {
      headers: {
        locale: locale,
      },
      timeout: REQUEST_TIMEOUT_SHORT,
    });
    return data.data.response;
  } catch (err) {
    return rejectWithValue('Timeout error');
  }
});

export { fetchAllMethods };
