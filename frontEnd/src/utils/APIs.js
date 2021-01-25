import axios from '../axios-admin';

const DEVICE_STATUS_URI = '/toggleDeviceStatus';
const DELETE_DEVICE_URI = '/deleteDevice';

export const getDevices = () => get('/dashboard');

export const getDeviceInfo = (deviceId) => get(`/dashboard?deviceId=${deviceId}`);

export const getDevicesInfoWithTime = (deviceId, start, end) =>
    get(`/dashboard?deviceId=${deviceId}&end=${end}&start=${start}`);

export const toggleDeviceStatus = async (data) => post(DEVICE_STATUS_URI, data);

export const addNewDevice = async (device) => post(DEVICE_STATUS_URI,
    {
        "deviceId": device.id,
        "client": device.client,
        "setTemp": device.setTemp
    }
)

export const deleteDevice = async (deviceId) => deleteR(`${DELETE_DEVICE_URI}?deviceId=${deviceId}`);

// Utility functions
const get = async (uri) => {
    try {
        let response = await axios.get(uri);

        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
};

const post = async (uri, data) => {
    try {
        let response = await axios.post(uri, data);

        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
};

const deleteR = async (uri) => {
    try {
        let response = await axios.delete(uri);

        return {
            data: response.data,
            error: null
        }
    } catch (error) {
        return {
            data: null,
            error: error
        }
    }
}