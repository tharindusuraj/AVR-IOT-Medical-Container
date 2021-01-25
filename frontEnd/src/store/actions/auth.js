import axios from '../../axios-admin';
import firebase from "firebase/app";
import "firebase/auth";

import * as actionTypes from './actionTypes';
import { AUTH_REQUEST_TIMEOUT } from "../../shared/config";

let authRequestInterceptor;

const authStart = () => {
    return {
        type: actionTypes.AUTH_START
    };
};

const authSuccess = (token, id) => {
    authRequestInterceptor = axios.interceptors.request.use(request => {
        request.headers['x-auth'] = token;
        return request;
    });

    return {
        type: actionTypes.AUTH_SUCCESS,
        idToken: token,
        userId: id
    };
};

const authFail = (error) => {
    return {
        type: actionTypes.AUTH_FAIL,
        error: error
    };
};

export const authLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('expirationDate');
    axios.interceptors.request.eject(authRequestInterceptor);
    return {
        type: actionTypes.AUTH_LOGOUT
    };
};

const checkAuthTimeout = (expirationTime) => (dispatch) => {
    setTimeout(() => {
        dispatch(authLogout());
    }, expirationTime * 1000)
};

export const auth = (email, password) => (dispatch) => {
    dispatch(authStart());
    firebase.auth().signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            userCredential.user.getIdTokenResult(false)
                .then(idTokenResult => {
                    if (idTokenResult) {
                        const token = idTokenResult.token;
                        const email = userCredential.user.email;
                        const expirationDate = new Date(idTokenResult.expirationTime);
                        localStorage.setItem('token', token);
                        localStorage.setItem('userId', email);
                        localStorage.setItem('expirationDate', expirationDate);
                        dispatch(authSuccess(token, email));
                        dispatch(checkAuthTimeout(AUTH_REQUEST_TIMEOUT));
                    }
                })
        })
        .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            if (errorCode) {
                dispatch(authFail(errorMessage));
            } else {
                dispatch(authFail('Server is under maintainance. Try again shortly.'));
            }
        });
}

export const authCheckState = () => (dispatch) => {
    const token = localStorage.getItem('token');
    if (!token) {
        dispatch(authLogout());
    } else {
        const expirationDate = new Date(localStorage.getItem('expirationDate'));
        if (expirationDate <= new Date()) {
            dispatch(authLogout());
        } else {
            const userId = localStorage.getItem('userId');
            dispatch(authSuccess(token, userId));
            dispatch(checkAuthTimeout((expirationDate.getTime() - new Date().getTime()) / 1000));
        }
    }
}
