import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type AuthState = {
    isAuthenticated: boolean;
    user_email: string;
    user_password: string;
    isTest: boolean;
};

type InitialState = {
    value: AuthState;
};

const initialState = {
    value: {
        isAuthenticated: false,
        user_email: '',
    } as AuthState,
} as InitialState;

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        updateUser: (state, action: PayloadAction<{ user_email: string; first_name: string; last_name: string }>) => {
            const { user_email, first_name, last_name } = action.payload;
            return {
                value: {
                    ...state.value,
                    isAuthenticated: true,
                    user_email,
                    first_name,
                    last_name,
                },
            };
        },
    },
});

export const { logOut, updateUser } = auth.actions;
export default auth.reducer;
