import * as actionTypes from './actionTypes';
import * as APIs from '../../utils/APIs.js';

export const loadAllDevices = () => (dispatch) => {
    APIs.getDevices().then(response => {
        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }
        dispatch(actionToDispatch(actionTypes.LOAD_DEVICES,{
            data: response.data
        }));
    })
    .catch((error) => {
        window.alert("Error loading data from servers.")
    });
};

export const loadSelectedDeviceInfo = (deviceId) => (dispatch) => {
    APIs.getDeviceInfo(deviceId).then(response => {
        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }
        dispatch(actionToDispatch(actionTypes.LOAD_DEVICES,{
            data: response.data
        }));
    })
        .catch((error) => {
            window.alert("Error loading data from servers.")
        });
};

export const loadDeviceInfo = (deviceId) => (dispatch) => {
    dispatch(actionToDispatch(actionTypes.LOADING_DEVICE_INFO, {}))
    APIs.getDeviceInfo(deviceId).then(response => {
        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }

        dispatch(actionToDispatch(actionTypes.LOAD_DEVICE_INFO, {
            data: response.data,
        }))

    })
    .catch((error) => {
        window.alert("Error loading data from servers.")
    });
};

export const loadDeviceInfoWithTime = (deviceId, start, end) => (dispatch) => {
    console.log('sent data',deviceId ,start,end);
    APIs.getDevicesInfoWithTime(deviceId, start, end).then(response => {
        console.log('loadDeviceInfoWithTime res',response);

        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }

        dispatch(actionToDispatch(actionTypes.LOAD_DEVICE_INFO_WITH_TIME, {
            data: response.data
        }))
    })
    .catch((error) => {
        window.alert("Error loading data from servers.")
    });
};

export const toggleDeviceStatus = (deviceData, callback) => (dispatch) => {
    APIs.toggleDeviceStatus(deviceData).then(response => {
        console.log('device data',deviceData);
        if (response.error) {
            window.alert(response.error)
        }

        if(!response.error){
            dispatch(actionToDispatch(actionTypes.TOGGLE_DEVICE_STATUS, {
                status: deviceData.enabled
            }));
            dispatch(loadSelectedDeviceInfo(deviceData.deviceId));
        }
        callback();
    })
    .catch((error) => {
        window.alert("An error occured while trying to toggle the device status.")
    });
};

export const addNewDevice = (device) => (dispatch) => {
    APIs.addNewDevice(device).then(response => {
        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }

        if(!response.error){
            dispatch(loadAllDevices());
        }
    })
    .catch((error) => {
        window.alert("An error occured while trying to add a new device.")
    });
};

export const deleteDevice = (deviceId, callback) => dispatch => {
    APIs.deleteDevice(deviceId).then(response => {
        if (response.error) {
            dispatch(actionToDispatch(actionTypes.ADD_ALERT, {
                alert: response.error
            }));
        }

        if(!response.error){
            dispatch(loadAllDevices());
        }
        callback();
    })
    .catch((error) => {
        window.alert("An error occured while trying to delete the device.")
    });
}

const actionToDispatch = (actionType, payload) => ({
    type: actionType,
    payload: payload
});
