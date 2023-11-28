import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL } from '@/common/const';

const getHomeDescriptions = createAsyncThunk('descriptions/getHomeDescriptions', async (locale: string) => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/home`, {
    headers: {
      locale: locale,
    },
  });
  return data.data;
});

const getMethodsDescriptions = createAsyncThunk('descriptions/getMethodsDescriptions', async (locale: string) => {
  const data = await axios.get(`${BASE_URL}/api/v1/descriptions/methods`, {
    headers: {
      locale: locale,
    },
  });
  return data.data.response;
});

export { getHomeDescriptions, getMethodsDescriptions };
