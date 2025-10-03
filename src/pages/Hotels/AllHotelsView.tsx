import { snackbar } from '@/components/Snackbar/Snackbar';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Dialog from '@mui/material/Dialog';
import FormControl from '@mui/material/FormControl';
import IconButton from '@mui/material/IconButton';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import { useEffect, useState } from 'react';
import classes from './Hotel.module.scss';
import CardsComponent from '@/components/Cards/Cards';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import { store } from '@/redux/store';
import Pagination from '@/components/Pagination/Pagination';
import { getFilteredHotels } from '@/redux/features/hotel/hotel-queries';

interface Hotel {
    id: number;
    name: string;
    address: string;
    pricePerNight?: string;
    rating?: number;
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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type HotelList = Hotel[];

const AllHotelsView = () => {
    const router = useRouter();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

    const MenuProps = {
        PaperProps: {
            style: {
                maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
                width: isMobile ? '80%' : 250,
                backgroundColor: '#9fe870',
            },
        },
    };

    const initialFilters = {
        cityIds: [] as number[],
        rating: undefined as number | number[] | undefined,
        priceRange: undefined as number[] | undefined,
    };

    const initialPagination = {
        limit: 15,
        currentPageNo: 1,
        totalPages: 1,
        totalResults: 0,
    };

    const city = store.getState().city.value?.allCity;
    const [hotels, setHotels] = useState<HotelList>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [filters, setFilters] = useState(initialFilters);
    const [paginationInfo, setPaginationInfo] = useState(initialPagination);

    const fetchHotels = async (
        cityIds?: number[],
        limit?: number,
        currentPageNo?: number,
        rating?: number | number[],
        priceRange?: number[]
    ) => {
        const { success, data, error, pagination } = await getFilteredHotels({
            limit: limit || paginationInfo.limit,
            currentPageNo: currentPageNo || paginationInfo.currentPageNo,
            imagesLimit: 1,
            cityIds,
            rating,
            priceRange,
        });
        if (!success || error) {
            snackbar.error(error, 5000);
            return;
        }
        setPaginationInfo(pagination);
        setHotels(data);
    };

    useEffect(() => {
        fetchHotels();
    }, [fetchHotels]);

    const handleDialog = () => {
        setOpenDialog(!openDialog);
    };

    const handleChangeCity = (event: any) => {
        const {
            target: { value },
        } = event;
        setFilters({ ...filters, cityIds: typeof value === 'string' ? value.split(',') : value });
    };

    const handleChangeRating = (event: any) => {
        const val = event.target.value;
        if (val.includes('-')) {
            const [min, max] = val.split('-').map(Number);
            setFilters({ ...filters, rating: [min, max] });
        } else {
            setFilters({ ...filters, rating: Number(val) });
        }
    };

    const handleChangePrice = (event: any) => {
        const val = event.target.value;
        const [min, max] = val.split('-').map(Number);
        setFilters({ ...filters, priceRange: [min, max] });
    };

    const submitFilters = async () => {
        setOpenDialog(!openDialog);
        fetchHotels(
            filters.cityIds.map((e: any) => e.id),
            undefined,
            undefined,
            filters.rating,
            filters.priceRange
        );
    };

    const clearFilters = async () => {
        setFilters(initialFilters);
        setPaginationInfo(initialPagination);
        fetchHotels([], initialPagination.limit, initialPagination.currentPageNo);
    };

    const onPageChange = async (value: any) => {
        fetchHotels(
            filters.cityIds.map((e: any) => e?.id),
            paginationInfo.limit,
            value,
            filters.rating,
            filters.priceRange
        );
    };

    const onLimitChange = async (value: any) => {
        fetchHotels(
            filters.cityIds.map((e: any) => e?.id),
            value,
            paginationInfo.currentPageNo,
            filters.rating,
            filters.priceRange
        );
    };

    return (
        <>
            <Box className={classes['wg-hotel-container']}>
                <Box className={classes['wg-hotelList-header']}>
                    <Typography className={classes['wg-hotelList-title']}>
                        List of Hotels ({paginationInfo.totalResults})
                    </Typography>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-hotelList-filter']}
                        onClick={() => setOpenDialog(!openDialog)}
                    >
                        Filter
                    </Button>
                </Box>
                <Box className={classes['wg-hotelList-cardslist']}>
                    {hotels.filter(Boolean).map((tp, index) => (
                        <CardsComponent
                            key={tp.id || `${tp.name}-${index}`}
                            title={tp.name}
                            address={tp.address}
                            cost={tp.pricePerNight}
                            rating={tp.rating}
                            imageUrl={getImageFromCloudinary(tp.images[0]?.imagePublicId)}
                            onClick={() => router.push(`/hotels/${tp.id}`)}
                        />
                    ))}
                </Box>
                <Box className={classes['wg-hotelList-pagination']}>
                    <Pagination
                        totalPages={paginationInfo.totalPages}
                        limit={paginationInfo.limit}
                        currentPage={paginationInfo.currentPageNo}
                        onPageChange={onPageChange}
                        onLimitChange={onLimitChange}
                    />
                </Box>

                <Dialog
                    open={openDialog}
                    onClose={() => setOpenDialog(!openDialog)}
                    disableEscapeKeyDown
                    PaperProps={{
                        className: classes['wg-hotelList-dialog'],
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenDialog(!openDialog)}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon htmlColor={'#9fe870'} />
                    </IconButton>
                    <Box className={classes['wg-hotelList-dialogBox']}>
                        <FormControl className={classes['wg-hotelList-cityForm']}>
                            <InputLabel id="city-label" className={classes['wg-hotelList-cityForm-label']}>
                                City
                            </InputLabel>
                            <Select
                                labelId="city-multiple-chip-label"
                                id="city-multiple-chip"
                                multiple
                                value={filters.cityIds}
                                onChange={handleChangeCity}
                                className={classes['wg-hotelList-cityForm-inputField']}
                                input={<OutlinedInput id="select-multiple-chip" label="Chip" />}
                                renderValue={(selected) => (
                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                        {selected.map((value: any) => (
                                            <Chip key={value.id} label={value.name} />
                                        ))}
                                    </Box>
                                )}
                                MenuProps={MenuProps}
                            >
                                {city.map((value) => (
                                    <MenuItem
                                        key={value.id}
                                        value={value}
                                        className={classes['wg-hotelList-cityForm-menuItem']}
                                    >
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <FormControl className={classes['wg-hotelList-cityForm']}>
                            <InputLabel id="rating-label" className={classes['wg-hotelList-cityForm-label']}>
                                Rating
                            </InputLabel>
                            <Select
                                labelId="rating-label"
                                id="rating-select"
                                value={
                                    Array.isArray(filters.rating)
                                        ? `${filters.rating[0]}-${filters.rating[1]}`
                                        : filters.rating?.toString() || ''
                                }
                                onChange={handleChangeRating}
                                className={classes['wg-hotelList-cityForm-inputField']}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="3">3 Stars & Up</MenuItem>
                                <MenuItem value="4">4 Stars & Up</MenuItem>
                                <MenuItem value="3-5">3-5 Stars</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl className={classes['wg-hotelList-cityForm']}>
                            <InputLabel id="price-label" className={classes['wg-hotelList-cityForm-label']}>
                                Price Range
                            </InputLabel>
                            <Select
                                labelId="price-label"
                                id="price-select"
                                value={filters.priceRange ? `${filters.priceRange[0]}-${filters.priceRange[1]}` : ''}
                                onChange={handleChangePrice}
                                className={classes['wg-hotelList-cityForm-inputField']}
                                MenuProps={MenuProps}
                            >
                                <MenuItem value="0-100">$0 - $100</MenuItem>
                                <MenuItem value="100-300">$100 - $300</MenuItem>
                                <MenuItem value="300-1000">$300 - $1000</MenuItem>
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            type="submit"
                            className={classes['wg-hotelList-cityForm-submitForm']}
                            onClick={submitFilters}
                        >
                            Filter
                        </Button>
                        <Button className={classes['wg-hotelList-cityForm-submitForm']} onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Box>
                </Dialog>
            </Box>
        </>
    );
};

export default AllHotelsView;
