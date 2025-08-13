import { apiQuery } from '@/settings/api-queries';

export const getTopHotels = async ({ limit, imagesLimit }: { limit: number; imagesLimit: number }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getTopHotels`, { limit, imagesLimit }, 'get');
};

export const getHotelsByCity = async ({
    cityID,
    limit,
    imagesLimit,
}: {
    cityID: number;
    limit: number;
    imagesLimit: number;
}) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getHotelsByCity`, { cityID, limit, imagesLimit }, 'get');
};

export const getHotelsForTopCities = async ({ limit, imagesLimit }: { limit?: number; imagesLimit?: number }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getHotelsForTopCities`, { limit, imagesLimit }, 'get');
};
