import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, IconButton, InputAdornment } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { logIn } from '@/redux/features/auth-slice';
import { useStoreSelector, useAppDispatch } from '@/redux/store';
import FormFields from '../src/components/FormFields';

const isProd = process.env.REACT_APP_ENV === 'prod';

const Login: React.FC = () => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const { user_email, user_password } = useStoreSelector(
        (state) => state.authReducer.value
    );

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (
        event: React.MouseEvent<HTMLButtonElement>
    ) => {
        event.preventDefault();
    };

    const formFields = [
        {
            name: 'user_email',
            label: 'Email Address',
            type: isProd ? 'email' : 'text',
            regex: isProd
                ? `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$`
                : '',
            regex_message: 'Invalid email',
            endAdornment: null,
        },
        {
            name: 'user_password',
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            regex: isProd
                ? `^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$`
                : '',
            regex_message: 'Invalid password',
            endAdornment: (
                <InputAdornment position="end">
                    <IconButton
                        aria-label="toggle password visibility"
                        onClick={handleClickShowPassword}
                        onMouseDown={handleMouseDownPassword}
                        edge="end"
                    >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                </InputAdornment>
            ),
        },
    ];

    const submitData = (formData: any, event: any) => {
        console.log('SUBMITTED', formData);
        dispatch(logIn(formData));
    };

    const onErrors = (formData: any, event: any) => {
        console.log('ERROR', formData);
    };

    return (
        <>
            {/* Showing User State, HIDE LATER */}
            {!isProd && (
                <>
                    {user_email && <h5>User Email: {user_email}</h5>}
                    {user_password && <h5>User Password: {user_password}</h5>}
                </>
            )}
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                sx={{
                    height: '100vh',
                }}
            >
                <Box
                    sx={{
                        width: '300px',
                        height: '300px',
                    }}
                >
                    <FormFields
                        formFields={formFields}
                        onSubmit={submitData}
                        onError={onErrors}
                    />
                </Box>
            </Box>
        </>
    );
};

export default Login;
