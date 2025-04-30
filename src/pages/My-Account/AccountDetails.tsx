import React, { useEffect, useState } from 'react';
import { Box, Button } from '@mui/material';
import classes from './AccountDetails.module.scss';
import { getUserInfo } from '@/redux/features/account-details/account-details-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import FormFields from '@/components/FormFields/FormFields';
import Loader from '@/components/Loader/Loader';
import { useRouter } from 'next/router';

const AccountDetails: React.FC = () => {
    const [editDetails, setEditDetails] = useState(false);
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true);
    const [userInfo, setUserInfo] = useState({
        firstName: '',
        lastName: '',
        email: '',
        dob: '',
        phoneNumber: '',
    });

    useEffect(() => {
        getInitialData();
    }, []);

    const formFields = [
        {
            name: 'first_name',
            label: 'First Name',
            type: 'text',
            regex: `^[A-Za-z ]{1,64}$`,
            regex_message: 'Incorrect format',
            value: userInfo.firstName,
            endAdornment: null,
            required: true,
            disabled: !editDetails,
        },
        {
            name: 'last_name',
            label: 'Last Name',
            type: 'text',
            regex: `^[A-Za-z ]{1,64}$`,
            regex_message: 'Incorrect format',
            value: userInfo.lastName,
            endAdornment: null,
            required: true,
            disabled: !editDetails,
        },
        {
            name: 'user_email',
            label: 'Email Address',
            type: 'email',
            regex: `^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$`,
            regex_message: 'Invalid email',
            value: userInfo.email || '',
            endAdornment: null,
            disabled: true,
        },
        {
            name: 'dob',
            label: 'Date of Birth',
            type: 'date',
            regex: `^(19|20)\\d{2}-(0[1-9]|1[0-2])-(0[1-9]|[12][0-9]|3[01])$`,
            regex_message: 'Invalid date format (YYYY-MM-DD)',
            value: userInfo.dob || '',
            endAdornment: null,
            disabled: !editDetails,
        },
        {
            name: 'phone_number',
            label: 'Phone Number',
            type: 'tel',
            regex: `^\\+?[1-9]\\d{1,14}$`,
            regex_message: 'Invalid phone number format',
            value: userInfo.phoneNumber || '',
            endAdornment: null,
            disabled: !editDetails,
        },
    ];

    const getInitialData = async () => {
        const { success, data, error } = await getUserInfo();
        if (!success || error) {
            snackbar.error(error, 5000);
            setIsLoading(false);
            router.push('/dashboard');
            return;
        }
        setUserInfo({ ...userInfo, ...data });
        setIsLoading(false);
    };

    const submitData = async (formData: any, _: any) => {
        console.log(formData, userInfo);
    };
    const onErrors = (formData: any, event: any) => {
        console.error(formData);
    };

    const submit = (errors: any[]) => {
        if (!editDetails) {
            return (
                <Box>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-myAccount-button']}
                        onClick={() => setEditDetails(true)}
                    >
                        {'Edit'}
                    </Button>
                </Box>
            );
        }

        return (
            <Box>
                <Button
                    variant="outlined"
                    type="submit"
                    className={classes['wg-myAccount-button']}
                    disabled={errors?.length > 0}
                >
                    {'Save'}
                </Button>
            </Box>
        );
    };

    const onChange = (property: string, value: string) => {
        setUserInfo({ ...userInfo, [property]: value });
    };

    if (isLoading) return <Loader />;

    return (
        <>
            <Box className={classes['wg-myAccount-container']}>
                <h1>My Account Details</h1>
                <FormFields
                    formFields={formFields}
                    onSubmit={submitData}
                    onError={onErrors}
                    submitButton={submit}
                    customOnChange={onChange}
                />
            </Box>
        </>
    );
};

export default AccountDetails;
