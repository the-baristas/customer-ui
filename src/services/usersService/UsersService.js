import { getToken } from "../../utils/Login"

export const registerUser = async (user) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(user)    
    })
}

export const getUserByUsername = async (username) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/username/' + username, {
        method: 'GET',
        headers: { "Content-Type": "application/json","Authorization": getToken()}    
    })
}