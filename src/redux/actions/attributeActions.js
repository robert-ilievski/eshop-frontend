import axios from "../../axios/axiosInstance";
import {
    FETCH_ATTRIBUTES,
    FETCH_ATTRIBUTE,
    FETCH_ATTRIBUTES_BY_CATEGORY,
    UPDATE_ATTRIBUTE,
    ADD_ATTRIBUTE,
    ADD_ATTRIBUTES,
    DELETE_ATTRIBUTE
} from "../actionTypes";

export const AttributeActions = {
    fetchAllAttributes: () => dispatch => {
        axios.get("/attributes").then(response => {
            dispatch({
                type: FETCH_ATTRIBUTES,
                attributes: response.data,
            });
        });
    },
    fetchAttribute: (id, callback) => dispatch => {
        axios.get(`/attributes/${id}`).then(response => {
            dispatch({
                type: FETCH_ATTRIBUTE,
                attribute: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error)
        });
    },
    fetchAttributesByCategory: (cat_id, callback) => dispatch => {
        axios.get(`/attributes/bycategory/${cat_id}`).then(response => {
            dispatch({
                type: FETCH_ATTRIBUTES_BY_CATEGORY,
                attributes: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error)
        });
    },
    updateAttribute: (attribute, callback) => dispatch => {
        axios.put(`/attributes/update`, attribute)
            .then(response => {
                dispatch({
                    type: UPDATE_ATTRIBUTE,
                    attribute: response.data,
                });
                callback(true);
            })
            .catch(() => {
                callback(false);
            });
    },
    addAttribute: (attribute, callback) => dispatch => {
        axios.post("/attributes/create", attribute).then(response => {
            dispatch({
                type: ADD_ATTRIBUTE,
                attribute: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    addAttributes: (attributes, callback) => dispatch => {
        axios.post("/attributes/createall", attributes).then(response => {
            dispatch({
                type: ADD_ATTRIBUTES,
                response: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    deleteAttribute: (id, callback) => dispatch => {
        axios.delete(`/attributes/delete/${id}`).then(response => {
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    }
}