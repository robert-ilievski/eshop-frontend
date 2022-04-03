import axios from "../../axios/axiosInstance";
import {
    ADD_CATEGORY,
    DELETE_CATEGORY,
    FETCH_CATEGORIES,
    FETCH_CATEGORY,
    UPDATE_CATEGORY
} from "../actionTypes";

export const CategoryActions = {
    fetchAllCategories: (callback) => dispatch => {
        axios.get("/categories").then(response => {
            dispatch({
                type: FETCH_CATEGORIES,
                categories: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
    fetchCategory: (id, callback) => dispatch => {
        axios.get(`/categories/${id}`).then(response => {
            dispatch({
                type: FETCH_CATEGORY,
                category: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error)
        });
    },
    updateCategory: (id, category, callback) => dispatch => {
        axios.put(`/categories/update/${id}`, category)
            .then(response => {
                dispatch({
                    type: UPDATE_CATEGORY,
                    category: response.data,
                });
                callback(true);
            })
            .catch(() => {
                callback(false);
            });
    },
    addCategory: (category, callback) => dispatch => {
        axios.post("/categories/create", category).then(response => {
            dispatch({
                type: ADD_CATEGORY,
                category: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    deleteCategory: id => dispatch => {
        axios.delete(`/categories/delete/${id}`).then(() => {
            dispatch({
                type: DELETE_CATEGORY,
                id: id
            })
        })
    }
}