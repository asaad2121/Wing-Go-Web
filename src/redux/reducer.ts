import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth-slice';

const mainReducer = combineReducers({
    auth: authReducer,
});

export default mainReducer;
