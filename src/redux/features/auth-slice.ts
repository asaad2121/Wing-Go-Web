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
        user_password: '',
        isTest: false,
    } as AuthState,
} as InitialState;

export const auth = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        logOut: () => {
            return initialState;
        },
        logIn: (
            state,
            action: PayloadAction<{ user_email: string; user_password: string }>
        ) => {
            const { user_email, user_password } = action.payload;
            return {
                value: {
                    ...state.value,
                    isAuthenticated: true,
                    user_email,
                    user_password,
                },
            };
        },
    },
});

export const { logOut, logIn } = auth.actions;
export default auth.reducer;
