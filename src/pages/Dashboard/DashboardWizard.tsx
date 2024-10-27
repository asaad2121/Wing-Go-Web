import NavBar from '@/components/Navbar/NavBar';
import { Box } from '@mui/material';
import classes from './DashboardWizard.module.scss';
import React from 'react';

const DashboardWizard: React.FC = () => {
    return (
        <>
            <NavBar />
            <Box className={classes['wg-dashboard-container']}>
                <h1>Dashboard Wizard</h1>
                <p>Welcome to the Dashboard Wizard. Follow the steps to set up your dashboard.</p>
            </Box>
        </>
    );
};

export default DashboardWizard;
