import instance from '../config/axios.config';

export const postDataApi = async ({ url, data }) => {
    try {
        const response = await instance.post(url, data);
        return response;
    } catch (error) {
        throw error;
    }
};
