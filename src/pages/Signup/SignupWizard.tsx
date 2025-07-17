import { Visibility, VisibilityOff } from '@mui/icons-material';
import { Box, Button, IconButton, InputAdornment, Typography } from '@mui/material';
import React from 'react';
import { useState } from 'react';
import { updateUser } from '@/redux/features/auth/auth-slice';
import { useAppDispatch } from '@/redux/store';
import FormFields from '@/components/FormFields/FormFields';
import classes from './SignupWizard.module.scss';
import { userSignup } from '@/redux/features/auth/auth-queries';
import { useRouter } from 'next/router';
import GoogleIcon from './../../../public/GoogleIcon';

interface SignupProps {
    isMobileServer: boolean;
}

const Signup: React.FC<SignupProps> = ({ isMobileServer }) => {
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useAppDispatch();
    const router = useRouter();

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
        event.preventDefault();
    };

    const formFields = [
        {
            name: 'first_name',
            label: 'First Name',
            type: 'text',
            regex: `^[A-Za-z ]{1,64}$`,
            regex_message: 'Incorrect format',
            value: '',
            required: true,
            endAdornment: null,
        },
        {
            name: 'last_name',
            label: 'Last Name',
            type: 'text',
            regex: `^[A-Za-z ]{1,64}$`,
            regex_message: 'Incorrect format',
            value: '',
            required: true,
            endAdornment: null,
        },
        {
            name: 'user_email',
            label: 'Email Address',
            type: 'email',
            regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$`,
            regex_message: 'Invalid email',
            value: '',
            required: true,
            endAdornment: null,
        },
        {
            name: 'user_password',
            label: 'Password',
            type: showPassword ? 'text' : 'password',
            regex: `^(?=.*[0-9])(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{7,}$`,
            regex_message: 'Invalid password',
            value: '',
            required: true,
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
        const { success, error } = await userSignup({
            email: formData.user_email,
            password: formData.user_password,
            firstName: formData.first_name,
            lastName: formData.last_name,
        });

        if (!success || error) {
            console.error(error);
            return;
        }
        const userData = {
            user_email: formData.user_email,
            first_name: formData.first_name,
            last_name: formData.last_name,
        };
        dispatch(updateUser(userData));
        router.push('/dashboard');
    };

    const onErrors = (formData: any, event: any) => {
        console.error(formData);
    };

    const GoogleOAuthButton = () => {
        const handleGoogleLogin = () => {
            window.location.href = `${process.env.REACT_APP_API}/auth/google/callback`;
        };

        return (
            <Box mt={2}>
                <Button onClick={handleGoogleLogin} className={classes['wg-google-oauth-button']}>
                    <GoogleIcon style={{ width: '20px', height: '20px' }} />
                    {'Sign up with Google'}
                </Button>
            </Box>
        );
    };

    const submit = (errors: any[]) => {
        return (
            <Box mt={2} className={classes['wg-signup-box']}>
                {GoogleOAuthButton()}
                <Button
                    variant="outlined"
                    type="submit"
                    className={classes['wg-signup-submitForm']}
                    disabled={Boolean(errors?.length)}
                >
                    Signup
                </Button>
            </Box>
        );
    };

    return (
        <>
            <Box className={classes['wg-signup-container']}>
                <Typography variant="h2" className={classes['wg-signup-text']}>
                    Sign Up to WingGo
                </Typography>
                <FormFields formFields={formFields} onSubmit={submitData} onError={onErrors} submitButton={submit} />
            </Box>
        </>
    );
};

export default Signup;
