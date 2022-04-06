import axios from "../../axios/axiosInstance";
import {
    FETCH_SHOPPING_CART,
    ADD_TO_SHOPPING_CART,
    DELETE_FROM_SHOPPING_CART, UPDATE_PRODUCT_IN_CART,
} from "../actionTypes";

export const ShoppingCartActions = {
    fetchShoppingCart: (username, callback) => dispatch => {
        axios.get(`/shoppingCart/${username}`).then(response => {
            dispatch({
                type: FETCH_SHOPPING_CART,
                shoppingCart: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
    deleteFromShoppingCart: (deleteFromCartDto, callback) => dispatch => {
        axios.post(`/shoppingCart/deleteProduct`, deleteFromCartDto).then(response => {
            dispatch({
                type: DELETE_FROM_SHOPPING_CART,
                message: response.data,
            });
            callback(true, response);
        }).catch((error) => {
            callback(false, error);
        })
    },
    addToShoppingCart: (username, productInCartDto, callback) => dispatch => {
        axios.post(`/shoppingCart/${username}/addToShoppingCart`, productInCartDto).then(response => {
            dispatch({
                type: ADD_TO_SHOPPING_CART,
                shoppingCart: response.data,
            });
            callback(true, response)
        }).catch((error) => {
            callback(false, error)
        });
    },
    updateProductInCart: (updateProductInShoppingCartDto, callback) => dispatch => {
        axios.put(`/shoppingCart/updateProductInCart`, updateProductInShoppingCartDto).then(response => {
            dispatch({
                type: UPDATE_PRODUCT_IN_CART,
            });
            callback(true);
        }).catch(error => {
            callback(false, error)
        })
    }
}