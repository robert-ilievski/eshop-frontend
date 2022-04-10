import axios from '../../axios/axiosInstance';
import {AUTHENTICATE_TOKEN, SIGN_IN, SIGN_OUT, UPDATE_TOKEN} from '../actionTypes';

export const AuthActions = {
    signUp: (name, surname, username, email, password, role, callback) => dispatch => {
        axios.post('/auth/signup', {
            name,
            surname,
            username,
            email,
            password,
            role
        }).then(response => {
            dispatch(AuthActions.signIn(username, password));
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        });
    },
    signIn: (username, password, callback) => dispatch => {
        axios.post('/auth/signin', {
            username,
            password
        }).then((jwtResponse) => {
            const response = jwtResponse.data;
            const token = response.token;
            const user = {
                id: response.id,
                username: response.username,
                email: response.email,
                name: response.name,
                surname: response.surname,
                role: response.role
            };
            dispatch({
                type: SIGN_IN,
                payload: {
                    token,
                    user
                }
            });
            callback && callback(true);
        }).catch(() => {
            callback && callback(false);
        });
    },
    signOut: () => dispatch => {
        dispatch({
            type: SIGN_OUT
        });
    },
    updateToken: (token) => dispatch => {
        dispatch({
            type: UPDATE_TOKEN,
            payload: token
        });
    },
    authenticateToken: (token, callback) => dispatch => {
        axios.post(`/auth/authenticateToken/${token}`).then(response => {
            dispatch({
                type: AUTHENTICATE_TOKEN,
                userId: response.data
            })
            callback(true, response);
        }).catch(error => {
            callback(false, error);
        })
    }
};