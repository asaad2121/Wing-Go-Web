import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TouristSegment {
    cityId: number;
    cityName: string;
    days: number;
    budget: number;
    touristDestinationIds: number[];
    perDayBudget?: number;
    hotels?: HotelOption[];
}

interface HotelOption {
    id: number;
    name: string;
    cityId: number;
    latitude: string;
    longitude: string;
    rating: string;
    pricePerNight: string;
    address: string;
    contactNo?: string;
    email?: string;
    createdAt?: string;
    updatedAt?: string;
    images?: {
        id: number;
        hotelId: number;
        imagePublicId: string;
        format: string;
        isActive: boolean;
        createdAt?: string;
        updatedAt?: string;
    }[];
    avgDistance?: number;
}

interface TripPlannerState {
    tripDetails: TouristSegment[];
    hotelOptions: TouristSegment[];
    hotelDetails: HotelOption[];
}

interface InitialState {
    value: TripPlannerState;
}

const initialState: InitialState = {
    value: {
        tripDetails: [],
        hotelOptions: [],
        hotelDetails: [],
    },
};

export const tripPlannerSlice = createSlice({
    name: 'tripPlanner',
    initialState,
    reducers: {
        updateTripDetails: (state, action: PayloadAction<TouristSegment[]>) => {
            state.value.tripDetails = action.payload;
        },
        updateHotelOptions: (state, action: PayloadAction<TouristSegment[]>) => {
            state.value.hotelOptions = action.payload;
        },
        updateHotelDetails: (state, action: PayloadAction<HotelOption[]>) => {
            state.value.hotelDetails = action.payload;
        },
        setInitialState: () => initialState,
    },
});

export const { updateTripDetails, updateHotelOptions, updateHotelDetails, setInitialState } = tripPlannerSlice.actions;
export default tripPlannerSlice.reducer;
