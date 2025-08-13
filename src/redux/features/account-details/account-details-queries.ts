import { store } from '@/redux/store';
import { apiQuery } from '@/settings/api-queries';

export const getUserInfo = async () => {
    const email = store.getState().auth?.value?.user_email;
    return await apiQuery(`${process.env.REACT_APP_API}/user-details/get-user-data`, { email: email }, 'get');
};
