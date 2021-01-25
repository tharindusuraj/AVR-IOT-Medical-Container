import axios from 'axios';
import { SERVER_API } from './shared/config';

const instance = axios.create({
    baseURL: SERVER_API
});

instance.interceptors.response.use((response) => response, (error) => {
    // whatever you want to do with the error
    window.alert((error && error.response && error.response.data && error.response.data.error) || error);
});

export default instance;