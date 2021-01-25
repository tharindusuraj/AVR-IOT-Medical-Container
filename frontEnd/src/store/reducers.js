import * as actionTypes from './actions/actionTypes';
import { updateObject } from '../shared/utility';


const initialState = {
    token: null,
    userId: null,
    error: null,
    loading: false,
    devices: [],
    selectedDevice: {},
    loadingDeviceInfo: false
}

const authStart = (state) => {
    return updateObject(
        state,
        {
            error: null,
            loading: true
        }
    );
};

const authSuccess = (state, action) => {
    return updateObject(
        state,
        {
            token: action.idToken,
            userId: action.userId,
            error: null,
            loading: false
        }
    );
};

const authFail = (state, action) => {
    return updateObject(
        state,
        {
            token: null,
            userId: null,
            error: action.error,
            loading: false
        }
    );
};

const authLogout = (state) => {
    return updateObject(
        state,
        {
            token: null,
            userId: null,
        }
    );
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case actionTypes.AUTH_START: return authStart(state);
        case actionTypes.AUTH_SUCCESS: return authSuccess(state, action);
        case actionTypes.AUTH_FAIL: return authFail(state, action);
        case actionTypes.AUTH_LOGOUT: return authLogout(state);
        case actionTypes.LOAD_DEVICES:
            return {
                ...state,
                devices: action.payload.data.devices,
                selectedDevice: state.selectedDevice.device === undefined ?
                    action.payload.data.info : state.selectedDevice
            };
        case actionTypes.LOAD_DEVICE_INFO:
            return {
                ...state,
                selectedDevice: action.payload.data.info,
                loadingDeviceInfo: false
            }
        case actionTypes.LOAD_DEVICE_INFO_WITH_TIME:
            return {
                ...state,
                selectedDevice: action.payload.data.info
            }
        case actionTypes.TOGGLE_DEVICE_STATUS:
            return {
                ...state,
                selectedDevice: {
                    ...state.selectedDevice,
                    deviceExpiry: action.payload.deviceExpiry
                }
            }
        case actionTypes.LOADING_DEVICE_INFO:
            return {
                ...state,
                loadingDeviceInfo: true
            }
        default:
            return state;
    }
}

export default reducer;