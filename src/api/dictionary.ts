import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// CONST
import { BASE_URL } from '@/common/const'

const fetchAllMethods = createAsyncThunk(
  "dictionary/fetchAllMethods",
  async (locale: string) => {
    const data = await axios.get(`${BASE_URL}/api/v1/dictionary/all-methods`, {
      headers: {
        locale: locale,
      },
    });
    return data.data;
  }
);

export {
  fetchAllMethods
}