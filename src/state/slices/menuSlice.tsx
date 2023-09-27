import { createSlice } from '@reduxjs/toolkit';
import { MenuSliceState } from '@/types';

const initialState: MenuSliceState = {
  menuItemIndex: 0,
};

const menuSlice = createSlice({
  name: 'menu',
  initialState: initialState,
  reducers: {
    setMenuItemIndex: (state, action) => {
      state.menuItemIndex = action.payload;
    },
  },
});
const { actions, reducer } = menuSlice;
export const { setMenuItemIndex } = actions;
export default reducer;
