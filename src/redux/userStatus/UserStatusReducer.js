import * as actions from "./UserStatusActionTypes";

const initialState = {
    userLoggedIn: false
}

const userStatusReducer = (state = initialState, action) => {
    switch(action.type){
        case actions.USER_LOGGED_IN:
            return { ...state,
                userLoggedIn: true
            }

        case actions.USER_LOGGED_OUT:
            return { ...state,
                userLoggedIn: false
            }

        default:
            return state;
    }
}

export default userStatusReducer;