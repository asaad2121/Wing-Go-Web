import React, { useEffect, useState } from 'react';
import {
    Box,
    Typography,
    Button,
    FormControl,
    InputLabel,
    Select,
    Chip,
    OutlinedInput,
    MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Checkbox,
    Divider,
} from '@mui/material';
import classes from '../TripPlanner.module.scss';
import { store, useAppDispatch } from '@/redux/store';
import { getAllCities, getTopCities } from '@/redux/features/city/city-queries';
import { snackbar } from '@/components/Snackbar/Snackbar';
import { updateAllCity, updateTopCity } from '@/redux/features/city/city-slice';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Tooltip from '@mui/material/Tooltip';
import { ArrowDropDownCircleOutlined } from '@mui/icons-material';
import { getFilteredTouristPlaces } from '@/redux/features/tourist-place/tourist-place-queries';
import { getImageFromCloudinary } from '@/shared/utility';
import { planTouristTrip } from '@/redux/features/trips/trips-queries';
import { updateHotelOptions, updateTripDetails } from '@/redux/features/trips/trips-slice';

type SelectProps = {
    handleNext: () => void;
};

type TripSegment = {
    cityId: number;
    cityName: string;
    days: number;
    budget: number;
    touristDestinationIds: number[];
};

interface TouristPlace {
    id: number;
    name: string;
    address: string;
    cost?: string;
    latitude: string;
    longitude: string;
    cityId: number;
    description?: string;
    website?: string;
    city: {
        id: number;
        name: string;
    };
    images: {
        imagePublicId: string;
    }[];
}

type TouristPlaceList = TouristPlace[];

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const TripPlannerStepSelect = React.forwardRef<HTMLDivElement, SelectProps>(({ handleNext }, ref) => {
    const dispatch = useAppDispatch();
    const cityReduxStore = store.getState().city.value;
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const [totalTouristDestinations, setTotalTouristDestinations] = useState<TouristPlaceList>([]);
    const { tripDetails } = store.getState().trips.value;
    const [tripData, setTripData] = useState<TripSegment[]>(
        tripDetails?.length > 0
            ? tripDetails
            : [{ cityId: 0, cityName: '', days: 1, budget: 0, touristDestinationIds: [] }]
    );

    useEffect(() => {
        const cityIds = tripData.map((segment) => segment.cityId).filter((id) => id !== 0);
        if (cityIds.length > 0) {
            fetchTouristPlaces(cityIds);
        }
    }, [tripData]);

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: isMobile ? '80%' : 250,
                backgroundColor: '#9fe870',
            },
        },
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

    useEffect(() => {
        const isAllCityDataEmpty = (cityReduxStore.allCity?.length ?? 0) === 0;
        const isTopCityDataEmpty = (cityReduxStore.topCity?.length ?? 0) === 0;
        if (isAllCityDataEmpty || isTopCityDataEmpty) {
            fetchCityData(isAllCityDataEmpty, isTopCityDataEmpty);
        }
    }, []);

    const fetchTouristPlaces = async (cityIds: number[]) => {
        const { success, data, error } = await getFilteredTouristPlaces({
            imagesLimit: 1,
            limit: 50,
            cityIds,
        });
        if (!success || error) {
            snackbar.error(error, 5000);
            return;
        }
        setTotalTouristDestinations(data);
    };

    const addNewCity = () => {
        if (tripData?.length > 4) {
            snackbar.error('Maximum city limit reached', 5000);
            return;
        }
        setTripData([...tripData, { cityId: 0, cityName: '', days: 1, budget: 0, touristDestinationIds: [] }]);
    };

    const removeCity = (index: number) => {
        if (tripData?.length > 1) {
            const updated = tripData.filter((_, i) => i !== index);
            setTripData(updated);
            const cityIds = updated.map((e) => e.cityId);
            if (cityIds[0] !== 0) fetchTouristPlaces(cityIds);
        }
    };

    const handleChangeCity = (index: number, event: any) => {
        const city = event.target.value;
        const updatedTripData = [...tripData];
        updatedTripData[index] = {
            ...updatedTripData[index],
            cityId: city.id,
            cityName: city.name,
        };
        setTripData(updatedTripData);

        const cityIds = updatedTripData.map((e) => e.cityId);
        if (cityIds[0] !== 0) fetchTouristPlaces(cityIds);
    };

    const handleTouristPlaceSelected = (touristPlace: any, value: boolean) => {
        setTripData((prevTripData) =>
            prevTripData.map((segment) => {
                if (segment.cityId === touristPlace.city.id) {
                    const updatedIds = value
                        ? Array.from(new Set([...segment.touristDestinationIds, touristPlace.id]))
                        : segment.touristDestinationIds.filter((id) => id !== touristPlace.id);

                    return {
                        ...segment,
                        touristDestinationIds: updatedIds,
                    };
                }
                return segment;
            })
        );
    };

    const submitTripData = async () => {
        const hasInvalidBudget = tripData.some((segment) => segment.budget < 50);
        if (hasInvalidBudget) {
            snackbar.error('Budget for all cities should be above $50', 5000);
            return;
        }

        try {
            const { success, data, error } = await planTouristTrip({ tripData });
            if (!success || error) {
                snackbar.error(error || 'Failed to plan trip', 5000);
                return;
            }
            dispatch(updateTripDetails(tripData));
            dispatch(updateHotelOptions(data));
            handleNext();
        } catch (err: any) {
            console.error('Error planning trip:', err);
            snackbar.error('Unexpected error occurred', 5000);
        }
    };

    return (
        <Box ref={ref} className={classes['wg-tripPlanner-step']}>
            <Typography variant="h5">Select City & Tourist Places</Typography>

            <Box className={classes['wg-tripPlanner-step-trip-container']}>
                {tripData.map((segment, index) => (
                    <Box key={segment.cityId || index} className={classes['wg-tripPlanner-step-form-container']}>
                        <FormControl className={classes['wg-tripPlanner-step-cityForm']}>
                            <InputLabel
                                id={`city-label-${index}`}
                                className={classes['wg-tripPlanner-step-cityForm-label']}
                            >
                                Select a city
                            </InputLabel>
                            <Select
                                labelId={`city-label-${index}`}
                                id={`city-select-${index}`}
                                value={segment.cityId ? { id: segment.cityId, name: segment.cityName } : ''}
                                onChange={(e) => handleChangeCity(index, e)}
                                className={classes['wg-tripPlanner-step-cityForm-inputField']}
                                renderValue={(selected: any) => (
                                    <Typography>{selected?.name || 'Select a city'}</Typography>
                                )}
                                MenuProps={MenuProps}
                            >
                                {cityReduxStore.allCity.map((value) => (
                                    <MenuItem
                                        key={value.id}
                                        value={value}
                                        className={classes['wg-tripPlanner-step-cityForm-menuItem']}
                                    >
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes['wg-tripPlanner-step-cityForm']}>
                            <InputLabel shrink className={classes['wg-tripPlanner-step-cityForm-label']}>
                                Days
                            </InputLabel>
                            <OutlinedInput
                                type="number"
                                value={segment.days}
                                onChange={(e) => {
                                    const updated = tripData.map((segment, i) =>
                                        i === index ? { ...segment, days: Number(e.target.value) } : segment
                                    );
                                    setTripData(updated);
                                }}
                                inputProps={{ min: 1 }}
                                className={classes['wg-tripPlanner-step-cityForm-inputField']}
                                disabled={!segment.cityId}
                            />
                        </FormControl>
                        <FormControl key={index} className={classes['wg-tripPlanner-step-cityForm']}>
                            <InputLabel shrink className={classes['wg-tripPlanner-step-cityForm-label']}>
                                Budget
                            </InputLabel>
                            <OutlinedInput
                                type="number"
                                value={segment.budget || ''}
                                onChange={(e) => {
                                    const updated = tripData.map((item, i) =>
                                        i === index ? { ...item, budget: Number(e.target.value) } : item
                                    );
                                    setTripData(updated);
                                }}
                                placeholder="0"
                                inputProps={{ min: 50 }}
                                className={classes['wg-tripPlanner-step-cityForm-inputField']}
                                disabled={!segment.cityId}
                            />
                        </FormControl>
                        <Tooltip title={index === 0 ? 'Cannot remove first row' : ''} arrow>
                            <span>
                                <IconButton
                                    aria-label="delete"
                                    onClick={() => removeCity(index)}
                                    disabled={index === 0}
                                >
                                    <DeleteIcon style={{ color: index === 0 ? '#ccc' : '#9fe870' }} />
                                </IconButton>
                            </span>
                        </Tooltip>
                    </Box>
                ))}
            </Box>

            <Button variant="outlined" onClick={addNewCity} className={classes['wg-tripPlanner-step-button']}>
                Add another city
            </Button>

            {totalTouristDestinations?.length > 0 && (
                <Accordion className={classes['wg-tripPlanner-step-accordion']}>
                    <AccordionSummary
                        expandIcon={<ArrowDropDownCircleOutlined sx={{ color: '#163300' }} />}
                        className={classes['wg-tripPlanner-step-accordion-summary']}
                    >
                        <Typography>Select tourist places you want to visit</Typography>
                    </AccordionSummary>
                    <AccordionDetails className={classes['wg-tripPlanner-step-accordion-details']}>
                        {totalTouristDestinations.map((e) => (
                            <Box key={e.id} className={classes['wg-tripPlanner-step-accordion-touristPlace']}>
                                <Checkbox
                                    onChange={(event) => handleTouristPlaceSelected(e, event.target.checked)}
                                    inputProps={{ 'aria-label': e.name }}
                                    sx={{ color: '#163300', '&.Mui-checked': { color: '#163300' } }}
                                />
                                <Box className={classes['wg-tripPlanner-step-accordion-touristPlace-content']}>
                                    <img
                                        src={getImageFromCloudinary(e.images[0]?.imagePublicId)}
                                        alt={e.name}
                                        style={{ width: 60, height: 60, borderRadius: 8, objectFit: 'cover' }}
                                    />
                                    <Box className={classes['wg-tripPlanner-step-accordion-touristPlace-body']}>
                                        <Typography variant="subtitle1" fontWeight="bold">
                                            {e.name}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {e.address}
                                        </Typography>
                                        <Typography variant="body2">{e.description}</Typography>
                                    </Box>
                                </Box>
                            </Box>
                        ))}
                    </AccordionDetails>
                </Accordion>
            )}

            <Button variant="outlined" onClick={submitTripData} className={classes['wg-tripPlanner-step-button']}>
                Select your hotels {'>'}
            </Button>
        </Box>
    );
});

TripPlannerStepSelect.displayName = 'TripPlannerStepSelect';
export default TripPlannerStepSelect;
