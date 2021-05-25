import * as actions from './UserStatusActionTypes';

export const login = () => {
    return { type: actions.USER_LOGGED_IN}
}

export const logout = () => {
    return {type: actions.USER_LOGGED_OUT}
}