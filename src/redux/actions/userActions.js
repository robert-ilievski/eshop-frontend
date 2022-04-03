import axios from "../../axios/axiosInstance";
import {
    FETCH_USER,
    FORGOT_PASSWORD,
    CHANGE_PASSWORD, CREATE_POSTMAN
} from "../actionTypes";

export const UserActions = {
    fetchUser: (id, callback) => dispatch => {
        axios.get(`/users/${id}`).then(response => {
            dispatch({
                type: FETCH_USER,
                user: response.data,
            })
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    forgotPassword: (email, callback) => dispatch => {
        axios.post("/users/forgot-password", email).then(response => {
            dispatch({
                type: FORGOT_PASSWORD,
            });
            callback(true, response);
        }).catch(error => {
            callback(false, error);
        })
    },
    changePassword: (changePasswordDto, callback) => dispatch => {
        axios.put("/users/change-password", changePasswordDto).then(response => {
            dispatch({
                type: CHANGE_PASSWORD
            });
            callback(true, response);
        }).catch(error => {
            callback(false, error);
        })
    },
    createPostman: (postmanDto, callback) => dispatch => {
        axios.post("/users/create", postmanDto).then(response => {
            dispatch({
                type: CREATE_POSTMAN,
                postman: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    }
};
