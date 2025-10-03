import React, { useEffect, useRef, useState } from 'react';
import Carousel from 'react-material-ui-carousel';
import { Box, Paper, Typography } from '@mui/material';
import classes from './TouristPlace.module.scss';
import { getTouristPlaceData, getTouristPlacesByCity } from '@/redux/features/tourist-place/tourist-place-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import CardsComponent from '@/components/Cards/Cards';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Link from 'next/link';

interface TouristPlace {
    id: number;
    name: string;
    address: string;
    rating: number;
    cityId: number;
    cost: string;
    latitude: string;
    longitude: string;
    contactNo?: string;
    email?: string;
    description?: string;
    images: [
        {
            imagePublicId: string;
        },
    ];
    city?: {
        name: string;
    };
}

const TouristPlaceView: React.FC = () => {
    const router = useRouter();
    const mapContainerRef = useRef<HTMLDivElement | null>(null);
    const mapRef = useRef<mapboxgl.Map | null>(null);
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const [mapSize, setMapSize] = useState(isMobile ? '250px' : '375px');
    const [touristPlaceData, setTouristPlaceData] = useState<TouristPlace>();
    const [relatedTouristPlaces, setRelatedTouristPlaces] = useState<TouristPlace[]>([]);
    const { id } = router.query;

    useEffect(() => {
        setMapSize(isMobile ? '250px' : '375px');
    }, [isMobile]);

    useEffect(() => {
        mapboxgl.accessToken = process.env.MAPBOX_TOKEN!;

        if (touristPlaceData?.longitude && touristPlaceData?.latitude && mapContainerRef.current) {
            try {
                mapRef.current = new mapboxgl.Map({
                    container: mapContainerRef.current,
                    style: 'mapbox://styles/mapbox/standard',
                    center: [parseFloat(touristPlaceData.longitude), parseFloat(touristPlaceData.latitude)],
                    zoom: 12,
                });

                new mapboxgl.Marker()
                    .setLngLat([parseFloat(touristPlaceData.longitude), parseFloat(touristPlaceData.latitude)])
                    .addTo(mapRef.current);
            } catch (err) {
                console.error('Error initializing map:', err);
                snackbar.error('Failed to load map', 5000);
            }
        }

        return () => {
            mapRef?.current?.remove();
        };
    }, [touristPlaceData]);

    useEffect(() => {
        const fetchTouristPlaceData = async () => {
            const { success, data, error } = await getTouristPlaceData({ id: id });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }
            setTouristPlaceData(data);
        };
        fetchTouristPlaceData();
    }, [id]);

    useEffect(() => {
        const fetchRelatedTouristData = async () => {
            const { success, data, error } = await getTouristPlacesByCity({ cityId: touristPlaceData?.cityId || 1 });
            if (!success || error) {
                snackbar.error(error, 5000);
                return;
            }

            setRelatedTouristPlaces(data);
        };
        if (touristPlaceData?.cityId) fetchRelatedTouristData();
    }, [touristPlaceData]);

    return (
        <Box className={classes['wg-touristPlace-container']}>
            <Link href="/tourist-destinations" className={classes['wg-touristPlace-link']}>
                {'< Go back to Tourist Destinations'}
            </Link>
            <Box className={classes['wg-touristPlace-header']}>
                <div className={classes['wg-carousel-root']}>
                    <Carousel animation="slide" navButtonsAlwaysVisible indicators autoPlay={true} interval={4000}>
                        {touristPlaceData?.images?.map((card, index) => (
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
                <Box className={classes['wg-touristPlace-info']}>
                    <Typography variant="h2">
                        <b>{touristPlaceData?.name}</b>
                    </Typography>
                    <Typography variant="h5">{touristPlaceData?.address}</Typography>
                    {touristPlaceData?.cost && (
                        <Typography variant="h6">
                            Price (Per person): ${parseInt(touristPlaceData?.cost || '', 10)}
                        </Typography>
                    )}
                    <Box className={classes['wg-touristPlace-mapbox']}>
                        <div ref={mapContainerRef} style={{ height: mapSize, width: mapSize }} />
                    </Box>
                </Box>
            </Box>
            <Box width={'100%'}>
                <Typography variant="h4">Description</Typography>
                <Typography variant="h6">{touristPlaceData?.description}</Typography>
            </Box>
            <Typography variant="h3" className={classes['wg-more-touristPlaces']}>
                More Tourist Places{' '}
                {relatedTouristPlaces.length > 0
                    ? `in ${relatedTouristPlaces[0]?.city?.name}`
                    : 'near this tourist place'}
            </Typography>
            <Box className={classes['wg-touristPlace-cardslist']}>
                {relatedTouristPlaces?.map((touristPlace) => (
                    <CardsComponent
                        key={touristPlace.id}
                        title={touristPlace.name}
                        address={touristPlace.address}
                        rating={touristPlace.rating}
                        cost={touristPlace.cost}
                        imageUrl={getImageFromCloudinary(touristPlace.images[0]?.imagePublicId)}
                        onClick={() => router.push(`/tourist-destinations/${touristPlace.id}`)}
                        isTouristPlace
                    />
                ))}
            </Box>
            {relatedTouristPlaces!.length > 0}
        </Box>
    );
};

export default TouristPlaceView;
