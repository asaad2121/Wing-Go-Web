import { apiQuery } from '@/settings/api-queries';

export const getTopHotels = async ({ limit, imagesLimit }: { limit: number; imagesLimit: number }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getTopHotels`, { limit, imagesLimit }, 'get');
};

export const getHotelsByCity = async ({
    cityId,
    limit,
    imagesLimit,
}: {
    cityId: number;
    limit?: number;
    imagesLimit?: number;
}) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getHotelsByCity`, { cityId, limit, imagesLimit }, 'get');
};

export const getHotelsForTopCities = async ({ limit, imagesLimit }: { limit?: number; imagesLimit?: number }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getHotelsForTopCities`, { limit, imagesLimit }, 'get');
};

export const getHotelData = async ({ id }: { id?: number | string | string[] }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/hotel/getHotelData`, { id }, 'get');
};

export const getFilteredHotels = async ({
    cityIds,
    rating,
    priceRange,
    limit,
    currentPageNo,
    imagesLimit,
}: {
    cityIds?: number[];
    rating?: number | number[];
    priceRange?: number[];
    limit?: number;
    currentPageNo?: number;
    imagesLimit?: number;
}) => {
    return await apiQuery(
        `${process.env.REACT_APP_API}/hotel/getFilteredHotels`,
        { cityIds, rating, priceRange, limit, currentPageNo, imagesLimit },
        'get'
    );
};
