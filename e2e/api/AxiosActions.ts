import Axios from 'axios';

const sendPostRequest = async (url: string, body: string, requestHeader: any): Promise<void> => {
    await Axios.post(url, body, { headers: requestHeader });
};

const sendGetRequest = async (url: string, requestHeader: any): Promise<void> => {
    await Axios.get(url, { headers: requestHeader });
};

export default {
    sendPostRequest,
    sendGetRequest
};
