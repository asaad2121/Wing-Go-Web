import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './features/auth/auth-slice';
import cityReducer from './features/city/city-slice';
import tripPlannerReducer from './features/trip-planner/trip-planner-slice';

const mainReducer = combineReducers({
    auth: authReducer,
    city: cityReducer,
    tripPlanner: tripPlannerReducer,
});

export default mainReducer;
