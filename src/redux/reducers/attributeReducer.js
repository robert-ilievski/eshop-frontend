import {
    FETCH_ATTRIBUTES,
    FETCH_ATTRIBUTE,
    UPDATE_ATTRIBUTE,
    ADD_ATTRIBUTE,
    ADD_ATTRIBUTES,
    DELETE_ATTRIBUTE,
    FETCH_ATTRIBUTES_BY_CATEGORY
} from "../actionTypes";
import {sortElementsByDateCreated} from "../../utils/utils";

const initialState = {
    attributes: []
}

export const AttributeReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_ATTRIBUTES:
            return {
                ...state,
                attributes: sortElementsByDateCreated(action.attributes)
            };
        case FETCH_ATTRIBUTE:
            const prevAttributes = state.attributes.filter(attribute => attribute.id !== action.attribute.id);
            return {
                ...state,
                attributes: [...prevAttributes, action.attribute],
            };
        case FETCH_ATTRIBUTES_BY_CATEGORY:
            return {
                ...state,
                attributes: action.attributes
            };
        case UPDATE_ATTRIBUTE:
            const attributes = state.attributes.filter(attribute => attribute.id !== action.attribute.id)
            return {
                ...state,
                attributes: [...attributes,action.attribute]
            };
        case ADD_ATTRIBUTE:
            return {
                ...state,
                attributes: [...state.attributes, action.attribute]
            };
        case ADD_ATTRIBUTES:
            return {
                ...state,
                attributes: [...state.attributes, action.attributes]
            };
        case DELETE_ATTRIBUTE:
            return {
                ...state,
                attributes: state.attributes.filter(attribute => attribute.id !== action.id)
            };
        default:
            return state;
    }
};