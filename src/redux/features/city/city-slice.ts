import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type CityState = {
    topCity: any[];
    allCity: any[];
};

type InitialState = {
    value: CityState;
};

const initialState = {
    value: {
        topCity: [],
        allCity: [],
    },
} as InitialState;

export const city = createSlice({
    name: 'city',
    initialState,
    reducers: {
        updateTopCity: (state, action) => {
            state.value.topCity = action.payload;
        },
        updateAllCity: (state, action) => {
            state.value.allCity = action.payload;
        },
    },
});

export const { updateTopCity, updateAllCity } = city.actions;
export default city.reducer;
