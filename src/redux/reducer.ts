import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth-slice';
import cityReducer from './features/city/city-slice';

const mainReducer = combineReducers({
    auth: authReducer,
    city: cityReducer,
});

export default mainReducer;
