import {
    FETCH_ORDERS,
    FETCH_ORDERS_BY_ADMIN,
    FETCH_ORDERS_BY_POSTMAN,
    MAKE_ORDER,
    UPDATE_ORDER_STATUS
} from "../actionTypes";
import {sortElementsByDateCreated} from "../../utils/utils";

const initState = {
    orders: [],
    ordersByPostman: [],
    ordersByAdmin: [],
};

export const OrderReducer = (state = initState, action) => {
    switch (action.type) {
        case MAKE_ORDER:
            return {
                ...state,
                orders: [...state.orders, action.order]
            };
        case FETCH_ORDERS:
            return {
                ...state,
                orders: sortElementsByDateCreated(action.orders),
            }
        case FETCH_ORDERS_BY_POSTMAN:
            return {
                ...state,
                ordersByPostman: sortElementsByDateCreated(action.ordersByPostman),
            }
        case FETCH_ORDERS_BY_ADMIN:
            return {
                ...state,
                ordersByAdmin: sortElementsByDateCreated(action.ordersByAdmin),
            }
        case UPDATE_ORDER_STATUS:
            const orders = state.orders.filter(order => order.id !== action.order.id)
            return {
                ...state,
                orders: sortElementsByDateCreated([...orders, action.order])
            }
        default:
            return state;
    }
}