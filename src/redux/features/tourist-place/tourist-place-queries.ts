import { apiQuery } from '@/settings/api-queries';

export const getTouristPlaceData = async ({ id }: { id?: number | string | string[] }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/tourist-place/getTouristPlaceData`, { id }, 'get');
};

export const getTouristPlacesByCity = async ({
    cityId,
    limit,
    imagesLimit,
}: {
    cityId: number;
    limit?: number;
    imagesLimit?: number;
}) => {
    return await apiQuery(
        `${process.env.REACT_APP_API}/tourist-place/getTouristPlacesByCity`,
        { cityId, limit, imagesLimit },
        'get'
    );
};

export const getTouristPlacesForTopCities = async ({
    limit,
    imagesLimit,
}: {
    limit?: number;
    imagesLimit?: number;
}) => {
    return await apiQuery(
        `${process.env.REACT_APP_API}/tourist-place/getTouristPlacesForTopCities`,
        { limit, imagesLimit },
        'get'
    );
};

export const getFilteredTouristPlaces = async ({
    cityIds,
    limit,
    currentPageNo,
    imagesLimit,
}: {
    cityIds?: number[];
    limit?: number;
    currentPageNo?: number;
    imagesLimit?: number;
}) => {
    return await apiQuery(
        `${process.env.REACT_APP_API}/tourist-place/getFilteredTouristPlaces`,
        { cityIds, limit, currentPageNo, imagesLimit },
        'get'
    );
};
