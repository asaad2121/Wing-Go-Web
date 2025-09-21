import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Paper, Rating, Typography } from '@mui/material';
import classes from './Hotel.module.scss';
import { getHotelData, getHotelsByCity } from '@/redux/features/hotel/hotel-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CardsComponent from '@/components/Cards/Cards';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

interface Hotel {
    id: number;
    name: string;
    address: string;
    rating: number;
    cityId: number;
    pricePerNight: string;
    latitude: string;
    longitude: string;
    contactNo?: string;
    email?: string;
    images: [
        {
            imagePublicId: string;
        },
    ];
    city?: {
        name: string;
    };
}

const HotelView: React.FC = () => {
    const router = useRouter();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const theme = useTheme();
    const isTablet = useMediaQuery(theme.breakpoints.down('md'));
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mapSize, setMapSize] = useState(isMobile ? '250px' : '375px');
    const [hotelData, setHotelData] = useState<Hotel>();
    const [relatedHotels, setRelatedHotels] = useState<Hotel[]>([]);
    const { id } = router.query;

    useEffect(() => {
        setMapSize(isMobile ? '250px' : '375px');
    }, [isMobile]);

    useEffect(() => {
        mapboxgl.accessToken = process.env.MAPBOX_TOKEN!;

        if (hotelData?.longitude && hotelData?.latitude && mapContainerRef.current) {
            try {
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/standard',
                    center: [parseFloat(hotelData.longitude), parseFloat(hotelData.latitude)],
                    zoom: 12,
                });

                new mapboxgl.Marker()
                    .setLngLat([parseFloat(hotelData.longitude), parseFloat(hotelData.latitude)])
                    .addTo(mapRef.current);
            } catch (err) {
                console.error('Error initializing map:', err);
                snackbar.error('Failed to load map', 5000);
            }
        }

        return () => {
            mapRef?.current?.remove();
        };
    }, [hotelData]);

    useEffect(() => {
        const fetchHotelData = async () => {
            const { success, data, error } = await getHotelData({ id: id });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            setHotelData(data);
        };
        fetchHotelData();
    }, [id]);

    useEffect(() => {
        const fetchRelatedHotelsData = async (cityId: any) => {
            const { success, data, error } = await getHotelsByCity({ cityId: cityId || 1 });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }

            setRelatedHotels(data);
        };
        if (hotelData?.cityId) fetchRelatedHotelsData(hotelData?.cityId);
    }, [hotelData]);

    return (
        <Box className={classes['wg-hotel-container']}>
            <a href="/hotels" className={classes['wg-hotel-link']}>
                {'< Go back to Hotels'}
            </a>
            <Box className={classes['wg-hotel-header']}>
                <div className={classes['wg-carousel-root']}>
                    <Carousel animation="slide" navButtonsAlwaysVisible indicators autoPlay={true} interval={4000}>
                        {hotelData?.images?.map((card, index) => (
                            <Paper
                                key={index}
                                className={classes['wg-carousel-slide']}
                                style={{
                                    backgroundImage: `url(${getImageFromCloudinary(card?.imagePublicId)})`,
                                }}
                            ></Paper>
                        ))}
                    </Carousel>
                </div>
                <Box className={classes['wg-hotel-data']}>
                    <Box className={classes['wg-hotel-info']}>
                        <Typography variant="h2">
                            <b>{hotelData?.name}</b>
                        </Typography>
                        <Typography variant="h5">{hotelData?.address}</Typography>
                    </Box>
                    <Box className={classes['wg-hotel-mapbox']}>
                        <div ref={mapContainerRef} style={{ height: mapSize, width: mapSize }} />
                    </Box>
                </Box>
            </Box>
            <Box className={classes['wg-hotel-rating-price']}>
                <Box className={classes['wg-hotel-price']}>
                    <Typography variant="h4">Price (per night)</Typography>
                    <Typography variant="h6">{hotelData?.pricePerNight}</Typography>
                </Box>
                <Box className={classes['wg-hotel-price']}>
                    <Typography variant="h4">Ratings</Typography>
                    <Typography variant="h6">
                        {hotelData?.rating}
                        <Rating
                            name="rating"
                            value={parseFloat(hotelData?.rating?.toString() || '0')}
                            precision={0.5}
                            readOnly
                            size="small"
                        />
                    </Typography>
                </Box>
            </Box>
            <Typography variant="h3" className={classes['wg-more-hotels']}>
                More Hotels {relatedHotels.length > 0 ? `in ${relatedHotels[0]?.city?.name}` : 'near this hotel'}
            </Typography>
            <Box className={classes['wg-hotel-cardslist']}>
                {relatedHotels?.map((hotel) => (
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
            {relatedHotels!.length > 0}
        </Box>
    );
};

export default HotelView;
