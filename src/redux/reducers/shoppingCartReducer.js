import {
    FETCH_SHOPPING_CART,
    ADD_TO_SHOPPING_CART,
    DELETE_FROM_SHOPPING_CART, UPDATE_PRODUCT_IN_CART,
} from '../actionTypes';

const initState = {

};

export const ShoppingCartReducer = (state = initState, action) => {
    switch (action.type) {
        case FETCH_SHOPPING_CART:
            return {
                state,
            };
        case ADD_TO_SHOPPING_CART:
            return {
                state,
            }
        case DELETE_FROM_SHOPPING_CART:
            return {
                state,
            }
        case UPDATE_PRODUCT_IN_CART:
            return {
                state,
            }
        default:
            return state;
    }
}