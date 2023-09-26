import { configureStore } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

// SLICES
import calculationSlice from "./slices/calculationSlice";
import dictionarySlice from "./slices/dictionarySlice";
import searchSlice from "./slices/searchSlice";
import blocksSlice from "./slices/blocksSlice";
import descriptionSlice from "./slices/descriptionSlice";
import settingsSlice from "./slices/settingsSlice";
import filteringSlice from "./slices/filteringSlice";

const store = configureStore({
  reducer: {
    dictionary: dictionarySlice,
    calculation: calculationSlice,
    search: searchSlice,
    blocks: blocksSlice,
    description: descriptionSlice,
    settings: settingsSlice,
    filters: filteringSlice,
  }
})

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector

export default store;


