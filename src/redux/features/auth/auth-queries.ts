import { apiQuery } from '@/settings/api/queries';

export const userLogin = async ({ email, password }: { email: string; password: string }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/users/login`, { email, password });
};
