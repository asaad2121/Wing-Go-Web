import { apiQuery } from '@/settings/api-queries';

export type TripSegment = {
    cityId: number;
    cityName: string;
    days: number;
    budget: number;
    touristDestinationIds: number[];
};

export const planTouristTrip = async ({ tripData }: { tripData: TripSegment[] }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/trip-planner/planTouristTrip`, { tripData });
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
    return await apiQuery(`${process.env.REACT_APP_API}/trip-planner/tripHotelsSelect`, {
        userId,
        tripData,
        selectedHotels,
    });
};
