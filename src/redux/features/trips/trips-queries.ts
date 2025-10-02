import { apiQuery } from '@/settings/api-queries';

export type TripSegment = {
    cityId: number;
    cityName: string;
    days: number;
    budget: number;
    touristDestinationIds: number[];
};

export const planTouristTrip = async ({ tripData }: { tripData: TripSegment[] }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/trips/planTouristTrip`, { tripData });
};

export const tripHotelsSelect = async ({
    userId,
    tripData,
    selectedHotels,
}: {
    userId: number;
    tripData: TripSegment[];
    selectedHotels: number[];
}) => {
    return await apiQuery(`${process.env.REACT_APP_API}/trips/tripHotelsSelect`, {
        userId,
        tripData,
        selectedHotels,
    });
};

export const viewUserTrips = async ({ id }: { id?: number | string | string[] }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/trips/viewUserTrips`, { id }, 'get');
};

export const viewSingleUserTrip = async ({ id, tripId }: { id: number; tripId: number | string }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/trips/viewSingleUserTrip`, { id, tripId }, 'get');
};
