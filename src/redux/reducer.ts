import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth-slice';
import cityReducer from './features/city/city-slice';
import tripsSlice from './features/trips/trips-slice';

const mainReducer = combineReducers({
    auth: authReducer,
    city: cityReducer,
    trips: tripsSlice,
});

export default mainReducer;
