import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { updateUser } from '@/redux/features/auth/auth-slice';
import { useAppDispatch } from '@/redux/store';
import FormFields from '@/components/FormFields/FormFields';
import classes from './LoginWizard.module.scss';
import NavBar from '@/components/Navbar/NavBar';
import { userLogin } from '@/redux/features/auth/auth-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { useRouter } from 'next/router';

interface LoginProps {
    isMobileServer: boolean;
}

const Login: React.FC<LoginProps> = ({ isMobileServer }) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();
    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formFields = [
        {
            id: 'user_email',
            name: 'user_email',
            label: 'Email Address',
            type: 'email',
            regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$`,
            regex_message: 'Invalid email',
            autoComplete: 'email',
            value: '',
            endAdornment: null,
        },
        {
            id: 'user_password',
            name: 'user_password',
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            regex: `^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$`,
            regex_message: 'Invalid password',
            autoComplete: 'current-password',
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

    const submitData = async (formData: any, _: any) => {
        const { success, data, error } = await userLogin({
            email: formData.user_email,
            password: formData.user_password,
        });

        if (!success || error) {
            snackbar.error(error, 5000);
            return;
        }
        const userData = { user_email: data.email, first_name: data.firstName, last_name: data.lastName };
        dispatch(updateUser(userData));
        localStorage.setItem('email', formData.user_email);
        router.push('/dashboard');
    };

    const onErrors = (formData: any, event: any) => {
        console.error(formData);
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
                <Typography variant="h2" className={classes['wg-login-text']}>
                    Enter User Credentials
                </Typography>
                <FormFields formFields={formFields} onSubmit={submitData} onError={onErrors} submitButton={submit} />
            </Box>
        </>
    );
};

export default Login;
