import * as actions from './UserStatusActionTypes';

export const login = (username, role) => {
    return { type: actions.USER_LOGGED_IN, username: username}
}

export const logout = () => {
    return {type: actions.USER_LOGGED_OUT}
}