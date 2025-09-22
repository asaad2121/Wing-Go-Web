import React from 'react';
import { Alert } from '@mui/material';
import classes from './Alert.module.scss';

export type AlertColor = 'success' | 'info' | 'warning' | 'error';

type AlertProps = {
    message?: string;
    variant?: AlertColor;
    onClose?: () => void;
};

const AlertComponent = React.forwardRef<HTMLDivElement, AlertProps>(({ message, variant: type, onClose }, ref) => {

    return (
        <Alert
            ref={ref}
            variant="filled"
            severity={type}
            onClose={onClose}
            className={`
                ${classes[`wg-Alert-main`]}
                ${classes[`wg-Alert-${type}`]}
            `}
        >
            {message}
        </Alert>
    );
});

export default AlertComponent;
