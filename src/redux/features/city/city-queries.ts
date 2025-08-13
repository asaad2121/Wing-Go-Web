import { apiQuery } from '@/settings/api-queries';

export const getTopCities = async () => {
    return await apiQuery(`${process.env.REACT_APP_API}/city/getTopCities`, {}, 'get');
};

export const getAllCities = async () => {
    return await apiQuery(`${process.env.REACT_APP_API}/city/getAllCities`, {}, 'get');
};
