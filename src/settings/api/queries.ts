import axios from 'axios';

export const apiQuery = async (apiQuery: string, apiProperties: any) => {
    try {
        const response = await axios.post(apiQuery, apiProperties);
        return response.data;
    } catch (err: any) {
        if (!err) return { success: false, error: 'Request failed, try again.' };
        const { error, message } = err?.response?.data || {};
        const errorMessage = error?.length > 0 ? error[0]?.msg : message ? message : 'Request failed, try again.';
        return { success: false, error: errorMessage };
    }
};
