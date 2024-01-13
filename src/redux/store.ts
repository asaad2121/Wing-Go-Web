import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/auth-slice"
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    authReducer,
  }
})

export type RootState = ReturnType<typeof store.getState>;

// Dispatch Function 
type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;

// Custom useSelector for our store
export const useStoreSelector: TypedUseSelectorHook<RootState> = useSelector;