import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { Box, Typography, Paper } from '@mui/material';
import { viewSingleUserTrip } from '@/redux/features/trips/trips-queries';
import { store } from '@/redux/store';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { getImageFromCloudinary } from '@/shared/utility';
import classes from './UserTrips.module.scss';
import CardsComponent from '@/components/Cards/Cards';

type Hotel = {
    id: number;
    name: string;
    pricePerNight: string;
    rating: number;
    address: string;
    image: string;
};

type TouristPlace = {
    id: number;
    name: string;
    image: string;
};

type City = {
    cityId: number;
    cityName: string;
    days: number;
    budget: string;
    hotels: Hotel | null;
    touristPlaces?: TouristPlace[];
};

type Trip = {
    tripId: number;
    cities: City[];
    touristPlaces: TouristPlace[];
};

const SingleTripPage: React.FC = () => {
    const router = useRouter();
    const { id } = router.query;
    const tripId = id ? parseInt(id as string, 10) : undefined;
    const { id: userId } = store.getState().auth.value;
    const [trip, setTrip] = useState<Trip | null>(null);
    const [totalBudget, setTotalBudget] = useState(0);

    useEffect(() => {
        let count = 0;
        trip?.cities.map((e) => (count += parseFloat(e.budget) * e.days));
        setTotalBudget(count);
    }, [trip]);

    useEffect(() => {
        if (!tripId) return;

        const fetchTrip = async () => {
            try {
                const { success, data, error } = await viewSingleUserTrip({ id: userId, tripId });
                if (!success || error) {
                    snackbar.error(error || 'Failed to fetch trip', 5000);
                    return;
                }

                setTrip(data);
            } catch (err: any) {
                console.error(err);
                snackbar.error('Unexpected error occurred', 5000);
            }
        };

        fetchTrip();
    }, [tripId, userId]);

    if (!trip) return <Typography>Loading...</Typography>;

    return (
        <Box className={classes['wg-userTrips-container']}>
            <Box className={classes['wg-userTrips-header']}>
                <Typography className={classes['wg-userTrips-tripId']}>Trip ID: {trip.tripId}</Typography>
                <Typography className={classes['wg-userTrips-totalBudget']}>Total budget: ${totalBudget}</Typography>
                <Typography className={classes['wg-userTrips-totalBudget']}>
                    Cities: {trip.cities.map((e) => e.cityName).join(', ')}
                </Typography>
            </Box>

            <Box className={classes['wg-userTrips-hotels']}>
                {trip.cities.map((city) => (
                    <>
                        {city.hotels && (
                            <CardsComponent
                                key={city.hotels.id}
                                title={city.hotels.name}
                                address={city.hotels.address}
                                rating={city.hotels.rating}
                                cost={city.hotels.pricePerNight}
                                imageUrl={getImageFromCloudinary(city.hotels.image)}
                                onClick={() => router.push(`/hotels/${city.hotels?.id}`)}
                                titleLimit={50}
                                hideRatings
                            />
                        )}
                    </>
                ))}
            </Box>

            {trip.touristPlaces?.length ? (
                <Box className={classes['wg-userTrips-touristPlaces']}>
                    <Typography className={classes['wg-userTrips-allTP']} variant="h6" gutterBottom>
                        All Tourist Places in this Trip:
                    </Typography>
                    <Box className={classes['wg-userTrips-touristPlaces-box']}>
                        {trip.touristPlaces.map((tp) => (
                            <Box
                                key={tp.id}
                                className={classes['wg-userTrips-touristPlaces-item']}
                                onClick={() => router.push(`/tourist-destinations/${tp.id}`)}
                            >
                                <img
                                    src={getImageFromCloudinary(tp.image)}
                                    alt={tp.name}
                                    className={classes['wg-userTrips-touristPlaces-image']}
                                />
                                <Typography align="center">{tp.name}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ) : null}
        </Box>
    );
};

export default SingleTripPage;
