import React, { useEffect, useState } from 'react';
import { Box, Typography, Button, Paper } from '@mui/material';
import { useRouter } from 'next/router';
import classes from './UserTrips.module.scss';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { viewUserTrips } from '@/redux/features/trips/trips-queries';
import { store } from '@/redux/store';

type CitySummary = {
    cityName: string;
    days: number;
    budget: number;
    touristDestinationIds: number[];
};

type TripSummary = {
    tripId: number;
    createdAt: string;
    updatedAt: string;
    cities: CitySummary[];
};

const UserTrips: React.FC = () => {
    const router = useRouter();
    const { id } = store.getState().auth.value;
    const [trips, setTrips] = useState<TripSummary[]>([]);

    useEffect(() => {
        const getTrips = async () => {
            try {
                const { success, data, error } = await viewUserTrips({ id });
                if (!success || error) {
                    snackbar.error(error || 'Failed to fetch trips', 5000);
                    return;
                }
                setTrips(data);
            } catch (err: any) {
                console.error('Error fetching trips:', err);
                snackbar.error('Unexpected error occurred', 5000);
            }
        };
        getTrips();
    }, [id]);

    return (
        <Box className={classes['wg-userTrips-container']}>
            {trips.length === 0 && <Typography>No trips found. Plan a new trip!</Typography>}
            <Typography className={classes['wg-userTrips-myTrips']}>My trips</Typography>

            {trips.map((trip) => (
                <Paper key={trip.tripId} className={classes['wg-userTrips-trip-card']}>
                    <Box>
                        <Typography variant="h6">Trip ID: {trip.tripId}</Typography>
                        <Typography variant="subtitle2">
                            Created: {new Date(trip.createdAt).toLocaleDateString()}
                        </Typography>
                    </Box>
                    <Box className={classes['wg-userTrips-trip-card-cities']}>
                        {trip.cities.map((city, index) => (
                            <Box key={index} className={classes['wg-userTrips-trip-card-cityInfo']}>
                                <Typography variant="subtitle1" className={classes['wg-userTrips-trip-card-city']}>
                                    {city.cityName}
                                </Typography>
                                <Typography variant="body2">Days: {city.days}</Typography>
                                <Typography variant="body2">Budget: ${city.budget}</Typography>
                                <Typography variant="body2">
                                    Tourist Destinations: {city.touristDestinationIds?.length}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes['wg-userTrips-button']}
                        onClick={() => router.push(`/my-trips/${trip.tripId}`)}
                    >
                        View Details
                    </Button>
                </Paper>
            ))}
        </Box>
    );
};

export default UserTrips;
