import { apiQuery } from '@/settings/api/queries';

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
