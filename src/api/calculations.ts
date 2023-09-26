import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

// CONST
import { BASE_URL } from '@/common/const'

// TYPES
import {
    CalculationBodyType,
  } from "@/types";

type GetMatrixProps = {
    locale: string;
    body: FormData;
  };
  
  type GetResultsProps = {
    locale: string;
    params: CalculationBodyType;
  };

const getMatrix = createAsyncThunk(
    "calculations/getMatrix",
    async ({ locale, body }: GetMatrixProps, { rejectWithValue }) => {
      try {
        const data = await axios.post(`${BASE_URL}/api/v1/matrix`, body, {
          headers: {
            locale: locale,
            "Content-Type": "multipart/form-data",
          },
        });
        return data.data;
      } catch (e) {
        throw rejectWithValue(e);
      }
    }
  );
  
const getResults = createAsyncThunk(
    "calculations/getResults",
    async ({ locale, params }: GetResultsProps, { rejectWithValue }) => {
      try {
        const data = await axios.post(`${BASE_URL}/api/v1/results`, params, {
          headers: {
            locale: locale,
          },
        });
        return data.data;
      } catch (e) {
        throw rejectWithValue(e);
      }
    }
  );

export {
  getMatrix,
  getResults
}