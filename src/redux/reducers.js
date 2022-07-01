import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from "redux-thunk";
import { AuthReducer } from './reducers/authReducer';
import { AttributeReducer } from './reducers/attributeReducer';
import { CategoryReducer } from "./reducers/categoryReducer";
import { UserReducer } from "./reducers/userReducer";
import { ProductReducer } from "./reducers/productReducer";
import {ShoppingCartReducer} from "./reducers/shoppingCartReducer";
import {OrderReducer} from "./reducers/orderReducer";

const rootReducer = combineReducers({
    auth: AuthReducer,
    attribute: AttributeReducer,
    category: CategoryReducer,
    user: UserReducer,
    product: ProductReducer,
    shoppingCart: ShoppingCartReducer,
    order: OrderReducer,
});

export const store = createStore(rootReducer, applyMiddleware(thunk));
