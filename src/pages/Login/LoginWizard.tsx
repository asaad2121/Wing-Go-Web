import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { logIn } from '@/redux/features/auth-slice';
import { useStoreSelector, useAppDispatch } from '@/redux/store';
import FormFields from '@/components/FormFields/FormFields';
import classes from './LoginWizard.module.scss';
import NavBar from '@/components/Navbar/NavBar';

const isProd = process.env.REACT_APP_ENV === 'prod';

interface LoginProps {
    isMobileServer: boolean;
}

const Login: React.FC<LoginProps> = ({ isMobileServer }) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const { user_email, user_password } = useStoreSelector((state) => state.authReducer.value);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formFields = [
        {
            name: 'user_email',
            label: 'Email Address',
            type: isProd ? 'email' : 'text',
            regex: isProd ? `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$` : '',
            regex_message: 'Invalid email',
            value: '',
            endAdornment: null,
        },
        {
            name: 'user_password',
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            regex: isProd ? `^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$` : '',
            regex_message: 'Invalid password',
            value: '',
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

    const submit = (errors: any[]) => {
        return (
            <Box mt={2}>
                <Button
                    variant="outlined"
                    type="submit"
                    className={classes['wg-login-submitForm']}
                    disabled={Boolean(errors?.length)}
                >
                    Login
                </Button>
            </Box>
        );
    };

    return (
        <>
            <NavBar />
            <Box className={classes['wg-login-container']}>
                {/* Showing User State, HIDE LATER */}
                {!isProd && (
                    <>
                        {user_email && <h5>User Email: {user_email}</h5>}
                        {user_password && <h5>User Password: {user_password}</h5>}
                    </>
                )}
                <Typography variant="h2" className={classes['wg-login-text']}>
                    Enter User Credentials
                </Typography>
                <FormFields formFields={formFields} onSubmit={submitData} onError={onErrors} submitButton={submit} />
            </Box>
        </>
    );
};

export default Login;
