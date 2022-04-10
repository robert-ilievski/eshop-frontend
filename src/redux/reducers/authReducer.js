import { isExpired } from 'react-jwt';
import { AUTH_TOKEN } from '../../axios/axiosInstance';
import {AUTHENTICATE_TOKEN, CURRENT_USER, SIGN_IN, SIGN_OUT, SIGN_UP, UPDATE_TOKEN} from '../actionTypes';

const initialState = {
    currentUser: null,
    token: null,
};

export const AuthReducer = (state = initialState, action) => {
    switch (action.type) {
        case SIGN_IN:
            localStorage.setItem(AUTH_TOKEN, action.payload.token);
            localStorage.setItem(CURRENT_USER, JSON.stringify(action.payload.user));
            return {
                ...state,
                currentUser: action.payload.user,
                token: action.payload.token
            };
        case SIGN_OUT:
            localStorage.removeItem(AUTH_TOKEN);
            localStorage.removeItem(CURRENT_USER);
            return {
                ...state,
                currentUser: null,
                token: null
            };
        case UPDATE_TOKEN:
            let token = action.payload;
            let currentUser = null;
            const isExp = isExpired(token);

            if (!isExp) {
                localStorage.setItem(AUTH_TOKEN, token);
                currentUser = JSON.parse(localStorage.getItem(CURRENT_USER));
            } else {
                localStorage.removeItem(CURRENT_USER);
                localStorage.removeItem(AUTH_TOKEN);
                token = null;
            }
            return {
                ...state,
                token: token,
                currentUser: currentUser
            };
        case AUTHENTICATE_TOKEN:
            return {
                ...state
            };
        default:
            return {
                ...state
            };
    }
};