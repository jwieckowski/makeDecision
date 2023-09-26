import { createSlice } from '@reduxjs/toolkit';
import { SearchSliceState } from '@/types';

const initialState: SearchSliceState = {
  query: ''
}

const searchSlice = createSlice({
  name: 'search',
  initialState: initialState,
  reducers: {
    queryChange: (state, action) => {
      state.query = action.payload
    },
    
  }
});
const { actions, reducer } = searchSlice
export const { queryChange } = actions;
export default reducer;
