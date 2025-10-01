import React from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Button } from '@mui/material';
import classes from './TripPlanner.module.scss';

const TripPlanningCompleted: React.FC = () => {
    const router = useRouter();

    const goToDashboard = () => {
        router.push('/dashboard');
    };

    const goToMyTrips = () => {
        router.push('/my-trips');
    };

    return (
        <Box className={classes['wg-tripPlanner-landing-container']}>
            <Typography className={classes['wg-tripPlanner-landing-title']}>Your Trip Plan is Ready</Typography>
            <Typography className={classes['wg-tripPlanner-landing-description']}>
                Your personalized trip has been successfully created. You can now view your trip details or go back to
                the dashboard.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' }, mt: 4 }}>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes['wg-tripPlanner-landing-button']}
                    onClick={goToDashboard}
                >
                    Go to Dashboard
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    className={classes['wg-tripPlanner-landing-button']}
                    onClick={goToMyTrips}
                >
                    View Your Trips
                </Button>
            </Box>
        </Box>
    );
};

export default TripPlanningCompleted;
