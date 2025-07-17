import axios from 'axios';
axios.defaults.withCredentials = true;

export const apiQuery = async (apiQuery: string, apiProperties?: any, apiQueryType: 'post' | 'get' = 'post') => {
    try {
        if (apiQueryType === 'get') {
            const response = await axios.get(apiQuery, { params: apiProperties, withCredentials: true });
            return response.data;
        } else {
            const response = await axios.post(apiQuery, apiProperties, { withCredentials: true });
            return response.data;
        }
    } catch (err: any) {
        if (err?.status === 401) {
            window.location.href = '/login';
            return { success: false, error: 'Session Expired. Login again' };
        }
        if (!err) return { success: false, error: 'Request failed, try again.' };
        const { error, message } = err?.response?.data || {};
        const errorMessage = error?.length > 0 ? error[0]?.msg : message ? message : 'Request failed, try again.';
        return { success: false, error: errorMessage };
    }
};
