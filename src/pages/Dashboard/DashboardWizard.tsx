import React, { useEffect, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Button, Paper, Typography } from '@mui/material';
import classes from './DashboardWizard.module.scss';
import { getHotelsForTopCities, getTopHotels } from '@/redux/features/hotel/hotel-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import { store, useAppDispatch } from '@/redux/store';
import { getAllCities, getTopCities } from '@/redux/features/city/city-queries';
import { updateAllCity, updateTopCity } from '@/redux/features/city/city-slice';
import CardsComponent from '@/components/Cards/Cards';
import { getTouristPlacesForTopCities } from '@/redux/features/tourist-place/tourist-place-queries';

interface Hotel {
    id: number;
    name: string;
    address: string;
    rating: number;
    pricePerNight: string;
    images: [
        {
            imagePublicId: string;
        },
    ];
}

interface TouristPlace {
    id: number;
    name: string;
    address: string;
    rating: number;
    cost: string;
    images: [
        {
            imagePublicId: string;
        },
    ];
}

type HotelsByCity = Record<string, Hotel[]>;

type TouristPlaceByCity = Record<string, TouristPlace[]>;

type CardsInfo = Hotel[];

const DashboardWizard: React.FC = () => {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const cityReduxStore = store.getState().city.value;
    const [cardsInfo, setCardsInfo] = useState<CardsInfo>([]);
    const [topCityHotels, setHotCityHotels] = useState<HotelsByCity>({});
    const [topCityTouristPlaces, setHotCityTouristPlaces] = useState<TouristPlaceByCity>({});

    useEffect(() => {
        const getHotelCardsInfo = async () => {
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

        const fetchTouristPlacesForTopCities = async () => {
            const { success, data, error } = await getTouristPlacesForTopCities({
                limit: 6,
            });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            setHotCityTouristPlaces(data);
        };

        const fetchHotelsForTopCities = async () => {
            const { success, data, error } = await getHotelsForTopCities({ limit: 6 });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            const sortedData = Object.fromEntries(
                Object.entries(data as HotelsByCity).sort((a, b) => b[1].length - a[1].length)
            ) as HotelsByCity;

            setHotCityHotels(sortedData);
        };

        getHotelCardsInfo();
        fetchTouristPlacesForTopCities();
        fetchHotelsForTopCities();
        const isAllCityDataEmpty = (cityReduxStore?.allCity?.length ?? 0) === 0;
        const isTopCityDataEmpty = (cityReduxStore?.topCity?.length ?? 0) === 0;
        if (isAllCityDataEmpty || isTopCityDataEmpty) {
            fetchCityData(isAllCityDataEmpty, isTopCityDataEmpty);
        }
    }, [dispatch, cityReduxStore.allCity?.length, cityReduxStore.topCity?.length]);

    return (
        <>
            <Box className={classes['wg-dashboard-container']}>
                {cardsInfo?.length === 3 && (
                    <div className={classes['wg-carousel-container']}>
                        <Typography variant="h3">Top Hotels in New Zealand</Typography>
                        <Carousel animation="slide" navButtonsAlwaysVisible indicators autoPlay={true} interval={4000}>
                            {cardsInfo?.map((card, index) => (
                                <Paper
                                    key={index}
                                    className={classes['wg-carousel-slide']}
                                    style={{
                                        backgroundImage: `url(${getImageFromCloudinary(card?.images[0]?.imagePublicId)})`,
                                    }}
                                    onClick={() => router.push(`/hotels/${card.id}`)}
                                >
                                    <Typography variant="h5" className={classes['wg-carousel-title']}>
                                        {card?.name}
                                    </Typography>
                                    <Typography variant="body1" className={classes['wg-carousel-address']}>
                                        {card?.address}
                                    </Typography>
                                </Paper>
                            ))}
                        </Carousel>
                    </div>
                )}

                <Box className={classes['wg-dashboard-buttonGroup']}>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-dashboard-filter']}
                        onClick={() => router.push(`/hotels`)}
                    >
                        View Hotels
                    </Button>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-dashboard-filter']}
                        onClick={() => router.push(`/trip-planner`)}
                    >
                        Plan a trip!
                    </Button>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-dashboard-filter']}
                        onClick={() => router.push(`/tourist-destinations`)}
                    >
                        View Tourist destinations
                    </Button>
                </Box>

                <Box className={classes['wg-carousel-hotelBox']}>
                    {Object.entries(topCityHotels)?.map(([cityName, hotels]) => {
                        const touristPlaces = topCityTouristPlaces?.[cityName] ?? [];

                        return (
                            <div key={cityName}>
                                <Box mb={4}>
                                    <Typography variant="h4">Hotels in {cityName}</Typography>
                                    <Box className={classes['wg-dashboard-cardslist']}>
                                        {hotels?.map((hotel) => (
                                            <CardsComponent
                                                key={hotel.id}
                                                title={hotel.name}
                                                address={hotel.address}
                                                rating={hotel.rating}
                                                cost={hotel.pricePerNight}
                                                imageUrl={getImageFromCloudinary(hotel.images[0]?.imagePublicId)}
                                                onClick={() => router.push(`/hotels/${hotel.id}`)}
                                            />
                                        ))}
                                    </Box>
                                </Box>

                                {touristPlaces?.length > 0 && (
                                    <Box mb={4}>
                                        <Typography variant="h4">Tourist places in {cityName}</Typography>
                                        <Box className={classes['wg-dashboard-cardslist']}>
                                            {touristPlaces.map((tp, index) => (
                                                <CardsComponent
                                                    key={tp.id || `${tp.name}-${index}`}
                                                    title={tp.name}
                                                    address={tp.address}
                                                    rating={tp.rating}
                                                    cost={tp.cost}
                                                    imageUrl={getImageFromCloudinary(tp.images[0]?.imagePublicId)}
                                                    onClick={() => router.push(`/tourist-destinations/${tp.id}`)}
                                                    isTouristPlace
                                                />
                                            ))}
                                        </Box>
                                    </Box>
                                )}
                            </div>
                        );
                    })}
                </Box>
            </Box>
        </>
    );
};

export default DashboardWizard;
