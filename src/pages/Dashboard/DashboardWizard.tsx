import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Paper, Typography } from '@mui/material';
import classes from './DashboardWizard.module.scss';
import { getHotelsForTopCities, getTopHotels } from '@/redux/features/hotel/hotel-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import { store, useAppDispatch } from '@/redux/store';
import { getAllCities, getTopCities } from '@/redux/features/city/city-queries';
import { updateAllCity, updateTopCity } from '@/redux/features/city/city-slice';

interface Hotel {
    id: number;
    name: string;
    address: string;
    images: [
        {
            imagePublicId: string;
        },
    ];
}

type HotelsByCity = Record<string, Hotel[]>;

type CardsInfo = Hotel[];

const DashboardWizard: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cityReduxStore = store.getState().city.value;
    const [cardsInfo, setCardsInfo] = useState<CardsInfo>([]);
    const [topCityHotels, setHotCityHotels] = useState<HotelsByCity>({});
    console.log(topCityHotels, typeof topCityHotels, topCityHotels?.Auckland);

    useEffect(() => {
        const getCardsInfo = async () => {
            const { success, data, error } = await getTopHotels({
                limit: 3,
                imagesLimit: 1,
            });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            setCardsInfo(data);
        };

        const fetchCityData = async (getAllCityData: boolean, getTopCityData: boolean) => {
            if (getAllCityData) {
                const { success, data, error } = await getAllCities();
                if (!success || error) {
                    snackbar.error(error, 5000);
                    return;
                }
                dispatch(updateAllCity(data));
            }
            if (getTopCityData) {
                const { success, data, error } = await getTopCities();
                if (!success || error) {
                    snackbar.error(error, 5000);
                    return;
                }
                dispatch(updateTopCity(data));
            }
        };

        const fetchHotelsForTopCities = async () => {
            const { success, data, error } = await getHotelsForTopCities({});
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            const sortedData = Object.fromEntries(
                Object.entries(data as HotelsByCity).sort((a, b) => b[1].length - a[1].length)
            ) as HotelsByCity;

            setHotCityHotels(sortedData);
        };

        getCardsInfo();
        fetchHotelsForTopCities();
        const isAllCityDataEmpty = (cityReduxStore.allCity?.length ?? 0) === 0;
        const isTopCityDataEmpty = (cityReduxStore.topCity?.length ?? 0) === 0;
        if (isAllCityDataEmpty || isTopCityDataEmpty) {
            fetchCityData(isAllCityDataEmpty, isTopCityDataEmpty);
        }
    }, []);

    return (
        <>
            <Box className={classes['wg-dashboard-container']}>
                {cardsInfo.length === 3 && (
                    <div className={classes['wg-carousel-container']}>
                        <Typography variant="h3">Top Hotels in New Zealand</Typography>
                        <Carousel animation="slide" navButtonsAlwaysVisible indicators autoPlay={false}>
                            {cardsInfo?.map((card, index) => (
                                <Paper
                                    key={index}
                                    className={classes['wg-carousel-slide']}
                                    style={{
                                        backgroundImage: `url(${getImageFromCloudinary(card?.images[0]?.imagePublicId)})`,
                                    }}
                                    onClick={() => router.push(`/hotels/${card.id}`)}
                                >
                                    <Typography variant="h5" gutterBottom>
                                        {card?.name}
                                    </Typography>
                                    <Typography variant="body1">{card?.address}</Typography>
                                </Paper>
                            ))}
                        </Carousel>
                    </div>
                )}
                <Box>
                    {Object.entries(topCityHotels)?.map(([cityName, hotels]) => (
                        <Box key={cityName} mb={4}>
                            <Typography variant="h4">{cityName}</Typography>
                            <Box display="flex" gap={2} flexWrap="wrap">
                                {hotels.map((hotel) => (
                                    <Paper
                                        key={hotel.id}
                                        style={{
                                            width: 250,
                                            height: 200,
                                            backgroundImage: `url(${getImageFromCloudinary(hotel.images[0]?.imagePublicId)})`,
                                            backgroundSize: 'cover',
                                            backgroundPosition: 'center',
                                        }}
                                        onClick={() => router.push(`/hotels/${hotel.id}`)}
                                    >
                                        <Typography variant="h6">{hotel.name}</Typography>
                                        <Typography variant="body2">{hotel.address}</Typography>
                                    </Paper>
                                ))}
                            </Box>
                        </Box>
                    ))}
                </Box>
            </Box>
        </>
    );
};

export default DashboardWizard;
