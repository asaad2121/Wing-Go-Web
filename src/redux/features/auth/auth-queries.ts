import { apiQuery } from '@/settings/api/queries';
import { logOut } from './auth-slice';

export const userLogin = async ({ email, password }: { email: string; password: string }) => {
    return await apiQuery(`${process.env.REACT_APP_API}/users/login`, { email, password });
};

export const userSignup = async ({
    email,
    password,
    firstName,
    lastName,
}: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
}) => {
    return await apiQuery(`${process.env.REACT_APP_API}/users/signup`, { email, password, firstName, lastName });
};

export const userLogout = async () => {
    logOut();
    window.location.href = '/login';
    return await apiQuery(`${process.env.REACT_APP_API}/users/logout`);
};
