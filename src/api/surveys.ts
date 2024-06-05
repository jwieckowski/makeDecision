import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// CONST
import { BASE_URL, REQUEST_TIMEOUT_SHORT } from '@/common/const';

// TYPES
import { SurveyRating } from '@/types';

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

const getRatingSurveyItems = createAsyncThunk('surveys/getRatingSurveyItems', async (_, { rejectWithValue }) => {
  try {
    const data = await axios.get(`${BASE_URL}/api/v1/surveys/rating`, {
      timeout: REQUEST_TIMEOUT_SHORT,
    });
    return data.data.response;
  } catch (e) {
    throw rejectWithValue(e);
  }
});

const postRatingSurveyItem = createAsyncThunk(
  'surveys/postRatingSurveyItem',
  async (
    { helpful, easyInterface, easeOfUse, overallRating, changeSuggestion, features }: SurveyRating,
    { rejectWithValue },
  ) => {
    try {
      const data = await axios.post(
        `${BASE_URL}/api/v1/surveys/rating`,
        {
          helpful,
          easyInterface,
          easeOfUse,
          overallRating,
          changeSuggestion,
          features,
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

export { fetchUsageSurvey, getUsageSurveyItems, postUsageSurveyItem, getRatingSurveyItems, postRatingSurveyItem };
