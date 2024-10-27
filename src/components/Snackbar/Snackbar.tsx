import React, { useEffect, useState } from 'react';
import AlertComponent from '../Alert/Alert';
import { Snackbar as MuiSnackBar } from '@mui/material';

let openSnackbarFn: any;

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

type SnackBarProps = {
    message?: string;
    variant?: AlertColor;
};

const SnackBar: React.FC<SnackBarProps> = ({ message, variant: type }) => {
    const [open, setOpen] = useState(false);
    const [alertMessage, setAlertMessage] = useState(message);
    const [variant, setVariant] = useState(type);
    const [duration, setDuration] = useState(3000);

    const openSnackbar = (message: string, variant: AlertColor, duration: number) => {
        setOpen(true);
        setAlertMessage(message);
        setVariant(variant);
        setDuration(duration);
    };

    const closeSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpen(false);
    };

    useEffect(() => {
        openSnackbarFn = openSnackbar;
    }, []);

    return (
        <MuiSnackBar open={open} autoHideDuration={duration} onClose={closeSnackbar}>
            <AlertComponent variant={variant} message={alertMessage} onClose={closeSnackbar} />
        </MuiSnackBar>
    );
};

export function openSnackbar(message: string, variant: AlertColor, duration: number) {
    openSnackbarFn(message, variant, duration);
}

export const snackbar = {
    error: (message: string, duration: number) => openSnackbarFn && openSnackbarFn(message, 'error', duration),
    success: (message: string, duration: number) => openSnackbarFn && openSnackbarFn(message, 'success', duration),
    info: (message: string, duration: number) => openSnackbarFn && openSnackbarFn(message, 'info', duration),
    warning: (message: string, duration: number) => openSnackbarFn && openSnackbarFn(message, 'warning', duration),
};

export default SnackBar;
