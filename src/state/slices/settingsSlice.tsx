import { createSlice } from '@reduxjs/toolkit';
import { SettingsSliceState } from '@/types';

const initialState: SettingsSliceState = {
  scale: 1,
  gridOn: true,
  gridSize: 50,
  size: 2,
  headSize: 6,
  color: '#000000',
  curveness: 0.8,
  path: 'smooth',
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState: initialState,
  reducers: {
    setSize: (state, action) => {
      state.size = action.payload;
    },
    setHeadSize: (state, action) => {
      state.headSize = action.payload;
    },
    setCurveness: (state, action) => {
      state.curveness = action.payload;
    },
    setColor: (state, action) => {
      state.color = action.payload;
    },
    setPath: (state, action) => {
      state.path = action.payload;
    },
    setScale: (state, action) => {
      state.scale = action.payload;
    },
    setGrid: (state, action) => {
      state.gridOn = action.payload;
    },
    setGridSize: (state, action) => {
      state.gridSize = action.payload;
    },
  },
});
const { actions, reducer } = settingsSlice;
export const { setSize, setHeadSize, setCurveness, setColor, setPath, setScale, setGrid, setGridSize } = actions;
export default reducer;
