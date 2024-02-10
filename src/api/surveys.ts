import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL, REQUEST_TIMEOUT_SHORT } from '@/common/const';

const fetchUsageSurvey = createAsyncThunk('surveys/fetchUsageSurvey', async (locale: string, { rejectWithValue }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/v1/surveys/usage-survey`, {
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

type UsageSurveyItem = {
  option: string;
  name: string;
};

const getUsageSurveyItems = createAsyncThunk('surveys/getUsageSurveyItems', async (_, { rejectWithValue }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/v1/surveys/usage`, {
      timeout: REQUEST_TIMEOUT_SHORT,
    });
    return data.data.response;
  } catch (e) {
    throw rejectWithValue(e);
  }
});

const postUsageSurveyItem = createAsyncThunk(
  'surveys/postUsageSurveyItem',
  async ({ option, name }: UsageSurveyItem, { rejectWithValue }) => {
    try {
      const data = await axios.post(
        `${BASE_URL}/api/v1/surveys/usage`,
        {
          option,
          name,
        },
        {
          timeout: REQUEST_TIMEOUT_SHORT,
        },
      );
      return data.data.response;
    } catch (e) {
      throw rejectWithValue(e);
    }
  },
);

export { fetchUsageSurvey, getUsageSurveyItems, postUsageSurveyItem };
