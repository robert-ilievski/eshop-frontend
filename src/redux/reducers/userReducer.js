import {
    CHANGE_PASSWORD, CREATE_POSTMAN,
    FETCH_USER,
    FORGOT_PASSWORD,
} from "../actionTypes";
import {sortElementsByDateCreated} from "../../utils/utils";

const initState = {
    users: []
};

export const UserReducer = (state = initState, action) => {
    switch (action.type) {
        case FETCH_USER:
            const oldUsers = state.users.filter(user => user.id !== action.user.id);
            return {
                ...state,
                users: [...oldUsers, action.user],
            };
        case FORGOT_PASSWORD:
            return {
                ...state
            };
        case CHANGE_PASSWORD:
            let usersBeforeChangePassword = state.users.filter(user => user.id !== action.user.id);
            return {
                ...state,
                users: [action.user, ...usersBeforeChangePassword]
            }
        case CREATE_POSTMAN:
            return {
                ...state,
                users: sortElementsByDateCreated([...state.users, action.postman])
            }
        default:
            return state;
    }
};