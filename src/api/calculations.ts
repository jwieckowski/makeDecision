import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL } from '@/common/const';

// TYPES
import { CalculationBodyTypeNew } from '@/types';

type RandomMatrixProps = {
  extension: string;
  alternatives: number;
  criteria: number;
  lower_bound: number;
  upper_bound: number;
  precision: number;
};

type GetMatrixProps = {
  locale: string;
  body: FormData;
};

type GetRandomMatrixProps = {
  locale: string;
  body: RandomMatrixProps;
};

type GetKwargsItemsProps = {
  locale: string;
  method: string;
};

type GetResultsProps = {
  locale: string;
  params: CalculationBodyTypeNew;
};

const uploadMatrixFile = createAsyncThunk(
  'calculations/uploadMatrixFile',
  async ({ locale, body }: GetMatrixProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/api/v1/matrix/upload`, body, {
        headers: {
          locale: locale,
          'Content-Type': 'multipart/form-data',
        },
      });
      return data.data.response;
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

const generateMatrix = createAsyncThunk(
  'calculations/generateMatrix',
  async ({ locale, body }: GetRandomMatrixProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/api/v1/matrix/generate`, body, {
        headers: {
          locale: locale,
        },
      });
      return data.data.response;
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

const getKwargsItems = createAsyncThunk(
  'calculations/getKwargsItems',
  async ({ locale, method }: GetKwargsItemsProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(
        `${BASE_URL}/api/v1/calculations/items`,
        {
          method: method,
        },
        {
          headers: {
            locale: locale,
          },
        },
      );
      return { [method]: data.data.response };
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

const getResults = createAsyncThunk(
  'calculations/getResults',
  async ({ locale, params }: GetResultsProps, { rejectWithValue }) => {
    try {
      const data = await axios.post(`${BASE_URL}/api/v1/calculations/calculate`, params, {
        headers: {
          locale: locale,
        },
      });
      return data.data.response;
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

export { uploadMatrixFile, generateMatrix, getResults, getKwargsItems };
