import { snackbar } from '@/components/Snackbar/Snackbar';
import { getFilteredTouristPlaces } from '@/redux/features/tourist-place/tourist-place-queries';
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
import classes from './TouristPlace.module.scss';
import CardsComponent from '@/components/Cards/Cards';
import { getImageFromCloudinary } from '@/shared/utility';
import { useRouter } from 'next/router';
import CloseIcon from '@mui/icons-material/Close';
import { store } from '@/redux/store';
import Pagination from '@/components/Pagination/Pagination';

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

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

type TouristPlaceList = TouristPlace[];

const AllTouristPlacessView = () => {
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

    const city = store.getState().city.value?.allCity;
    const [touristPlaces, setTouristPlaces] = useState<TouristPlaceList>([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [filterCity, setFilterCity] = useState<string[]>([]);
    const [paginationInfo, setPaginationInfo] = useState({
        limit: 15,
        currentPageNo: 1,
        totalPages: 1,
        totalResults: 0,
    });

    const fetchTouristPlaces = async (cityIds?: number[], limit?: number, currentPageNo?: number) => {
        const { success, data, error, pagination } = await getFilteredTouristPlaces({
            limit: limit || paginationInfo.limit,
            currentPageNo: currentPageNo || paginationInfo.currentPageNo,
            imagesLimit: 1,
            cityIds,
        });
        if (!success || error) {
            snackbar.error(error, 5000);
            return;
        }
        setPaginationInfo(pagination);
        setTouristPlaces(data);
    };

    useEffect(() => {
        fetchTouristPlaces();
    }, []);

    const handleDialog = () => {
        if (openDialog) setFilterCity([]);
        setOpenDialog(!openDialog);
    };

    const handleChangeCity = (event: any) => {
        const {
            target: { value },
        } = event;
        setFilterCity(typeof value === 'string' ? value.split(',') : value);
    };

    const submitFilters = async () => {
        handleDialog();
        fetchTouristPlaces(filterCity.map((e: any) => e.id));
    };

    const clearFilters = async () => {
        handleDialog();
        fetchTouristPlaces([], 15, 1);
    };

    const onPageChange = async (value: any) => {
        fetchTouristPlaces(
            filterCity.map((e: any) => e?.id),
            paginationInfo.limit,
            value
        );
    };

    const onLimitChange = async (value: any) => {
        fetchTouristPlaces(
            filterCity.map((e: any) => e?.id),
            value,
            paginationInfo.currentPageNo
        );
    };

    return (
        <>
            <Box className={classes['wg-touristPlace-container']}>
                <Box className={classes['wg-touristPlaceList-header']}>
                    <Typography className={classes['wg-touristPlaceList-title']}>
                        List of Tourist Places ({paginationInfo.totalResults})
                    </Typography>
                    <Button
                        variant="outlined"
                        type="submit"
                        className={classes['wg-touristPlaceList-filter']}
                        onClick={handleDialog}
                    >
                        Filter
                    </Button>
                </Box>
                <Box className={classes['wg-touristPlaceList-cardslist']}>
                    {touristPlaces.map((tp) => (
                        <CardsComponent
                            key={tp.id}
                            title={tp.name}
                            address={tp.address}
                            cost={tp.cost}
                            imageUrl={getImageFromCloudinary(tp.images[0]?.imagePublicId)}
                            onClick={() => router.push(`/tourist-destinations/${tp.id}`)}
                            isTouristPlace
                        />
                    ))}
                </Box>
                <Box className={classes['wg-touristPlaceList-pagination']}>
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
                    onClose={handleDialog}
                    disableEscapeKeyDown
                    PaperProps={{
                        className: classes['wg-touristPlaceList-dialog'],
                    }}
                >
                    <IconButton
                        aria-label="close"
                        onClick={handleDialog}
                        sx={{
                            position: 'absolute',
                            right: 8,
                            top: 8,
                        }}
                    >
                        <CloseIcon htmlColor={'#9fe870'} />
                    </IconButton>
                    <Box className={classes['wg-touristPlaceList-dialogBox']}>
                        <FormControl className={classes['wg-touristPlaceList-cityForm']}>
                            <InputLabel id="city-label" className={classes['wg-touristPlaceList-cityForm-label']}>
                                City
                            </InputLabel>
                            <Select
                                labelId="city-multiple-chip-label"
                                id="city-multiple-chip"
                                multiple
                                value={filterCity}
                                onChange={handleChangeCity}
                                className={classes['wg-touristPlaceList-cityForm-inputField']}
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
                                        value={value}
                                        className={classes['wg-touristPlaceList-cityForm-menuItem']}
                                    >
                                        {value.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <Button
                            variant="outlined"
                            type="submit"
                            className={classes['wg-touristPlaceList-cityForm-submitForm']}
                            onClick={submitFilters}
                        >
                            Filter
                        </Button>
                        <Button className={classes['wg-touristPlaceList-cityForm-submitForm']} onClick={clearFilters}>
                            Clear Filters
                        </Button>
                    </Box>
                </Dialog>
            </Box>
        </>
    );
};

export default AllTouristPlacessView;
