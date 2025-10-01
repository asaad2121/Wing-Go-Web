import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './TripPlanner.module.scss';
import { useAppDispatch } from '@/redux/store';
import { setInitialState } from '@/redux/features/trips/trips-slice';

const TripPlannerLanding: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();

    const handleOnClick = () => {
        dispatch(setInitialState());
        router.push('/trip-planner/steps');
    };

    return (
        <Box className={classes['wg-tripPlanner-landing-container']}>
            <Typography variant="h2" className={classes['wg-tripPlanner-landing-title']}>
                Trip Planner
            </Typography>

            <Typography variant="h4" className={classes['wg-tripPlanner-landing-description']}>
                Plan your perfect journey in just a few clicks. Choose your cities, set your budget, and let us generate
                a smart itinerary with the best hotels and must-visit tourist spots.
            </Typography>

            <Button variant="contained" className={classes['wg-tripPlanner-landing-button']} onClick={handleOnClick}>
                Get Started
            </Button>
        </Box>
    );
};

export default TripPlannerLanding;
