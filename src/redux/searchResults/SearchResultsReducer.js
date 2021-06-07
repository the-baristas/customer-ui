import * as actions from "./UserStatusActionTypes";

const initialState = {
    results: []
}

const searchResultsReducer = (state = initialState, action) => {
    switch(action.type){
        case actions.RESULTS_FOUND:
            return { ...state,
                results: action.payload
            }
        case actions.RESULTS_NOT_FOUND:
            return state;

        default:
            return state;
    }
}

export default searchResultsReducer;