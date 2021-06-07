import * as actions from "./UserStatusActionTypes";

const initialState = {
    userLoggedIn: false,
    username: ""
}

const userStatusReducer = (state = initialState, action) => {
    switch(action.type){
        case actions.USER_LOGGED_IN:
            return { ...state,
                userLoggedIn: true,
                username: action.username
            }

        case actions.USER_LOGGED_OUT:
            return { ...state,
                userLoggedIn: false,
                username: ""
            }

        default:
            return state;
    }
}

export default userStatusReducer;