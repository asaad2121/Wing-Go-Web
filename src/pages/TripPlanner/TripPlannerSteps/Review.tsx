import React, { useState } from 'react';
import { Box, Typography, Button, FormControl, InputLabel, Select, MenuItem, Rating } from '@mui/material';
import classes from '../TripPlanner.module.scss';
import { store } from '@/redux/store';
import { getImageFromCloudinary } from '@/shared/utility';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { tripHotelsSelect } from '@/redux/features/trip-planner/trip-planner-queries';

type Review = {
    handleBack: () => void;
    handleNext: () => void;
};

const TripPlannerStepReview = React.forwardRef<HTMLDivElement, Review>(({ handleBack, handleNext }, ref) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { tripDetails, hotelOptions } = store.getState().tripPlanner.value;
    const { id } = store.getState().auth.value;
    const [selectedHotels, setSelectedHotels] = useState<(number | null)[]>(tripDetails.map(() => null));

    const handleHotelSelect = (cityIndex: number, hotelId: number) => {
        setSelectedHotels((prev) => {
            const updated = [...prev];
            updated[cityIndex] = hotelId;
            return updated;
        });
    };

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: 224,
                width: isMobile ? '80%' : 250,
                backgroundColor: '#9fe870',
            },
        },
    };

    const anyCityWithoutHotels = hotelOptions.some((segment) => (segment.hotels?.length ?? 0) === 0);

    const allHotelsSelected = selectedHotels.every(
        (id, index) => id !== null || (hotelOptions[index].hotels?.length ?? 0) === 0
    );

    const handleOnClick = async () => {
        try {
            if (selectedHotels.some((id) => id === null)) {
                return snackbar.error('Please select a hotel for all cities', 5000);
            }

            const payload = {
                userId: id,
                tripData: tripDetails,
                selectedHotels: selectedHotels as number[],
            };

            const { success, data, error } = await tripHotelsSelect(payload);
            if (!success || error) {
                snackbar.error(error || 'Failed to plan trip', 5000);
                return;
            }
            handleNext();
        } catch (err: any) {
            console.error('Error planning trip:', err);
            snackbar.error('Unexpected error occurred', 5000);
        }
    };

    return (
        <Box ref={ref} className={classes['wg-tripPlanner-review']}>
            <Typography variant="h5" gutterBottom>
                Select your hotels
            </Typography>

            <Box className={classes['wg-tripPlanner-hotels-box']}>
                {hotelOptions.map((segment, cityIndex) => (
                    <Box key={segment.cityId} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ mb: 1 }}>
                            {segment.cityName} - Select 1 hotel
                        </Typography>

                        {!(segment.hotels?.length ?? 0) ? (
                            <Typography color="error">
                                Your budget for this city is too low. Please go back and increase it.
                            </Typography>
                        ) : (
                            <FormControl fullWidth>
                                <InputLabel
                                    id={`hotel-select-label-${cityIndex}`}
                                    className={classes['wg-tripPlanner-step-cityForm-label']}
                                >
                                    Choose a hotel
                                </InputLabel>
                                <Select
                                    labelId={`hotel-select-label-${cityIndex}`}
                                    value={selectedHotels[cityIndex] ?? ''}
                                    onChange={(e) => handleHotelSelect(cityIndex, Number(e.target.value))}
                                    label="Choose a hotel"
                                    className={classes['wg-tripPlanner-hotels-select']}
                                    MenuProps={MenuProps}
                                >
                                    {(segment.hotels ?? []).map((hotel) => (
                                        <MenuItem
                                            key={hotel.id}
                                            value={hotel.id}
                                            className={classes['wg-tripPlanner-hotels-MenuItem']}
                                        >
                                            <Box className={classes['wg-tripPlanner-hotels-content']}>
                                                <img
                                                    src={getImageFromCloudinary(hotel.images?.[0]?.imagePublicId ?? '')}
                                                    alt={hotel.name}
                                                    className={classes['wg-tripPlanner-hotels-image']}
                                                />
                                                <Box>
                                                    <Typography variant="h6">{hotel.name}</Typography>
                                                    <Typography variant="subtitle2">{hotel.address}</Typography>
                                                    <Typography variant="body2">
                                                        ${hotel.pricePerNight} / night
                                                    </Typography>
                                                    {hotel.avgDistance !== undefined && (
                                                        <Typography variant="body2">
                                                            Avg. distance: {hotel.avgDistance} km
                                                        </Typography>
                                                    )}
                                                    <Box className={classes['wg-tripPlanner-hotels-rating']}>
                                                        <Typography variant="body1">Rating:</Typography>
                                                        <Typography variant="body2">{hotel.rating}</Typography>
                                                        <Rating
                                                            name={`hotel-rating-${hotel.id}`}
                                                            value={parseFloat(hotel.rating?.toString() || '0')}
                                                            precision={0.5}
                                                            readOnly
                                                            size="small"
                                                        />
                                                    </Box>
                                                </Box>
                                            </Box>
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                    </Box>
                ))}
            </Box>

            <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                <Button variant="contained" color="primary" onClick={handleBack}>
                    Back
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    disabled={anyCityWithoutHotels || !allHotelsSelected}
                    onClick={handleOnClick}
                >
                    Finish
                </Button>
            </Box>
        </Box>
    );
});

export default TripPlannerStepReview;
