import { getCsrfToken, getToken } from "../utils/Login"

export const registerUser = async (user) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/registration', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(user)
    })
}

export const updateUser = async (userId, user) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/' + userId, {
        method: 'PUT',
        headers: { "Content-Type": "application/json","Authorization": getToken()},
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

export const userServiceHealthCheck = async () =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/health', {
        method: 'GET',
        headers: { "Content-Type": "application/json"}  ,
        credentials: 'include'  
    })
}

export const resetPassword = async (token, password) =>
{
    console.log(token + ' ' + password);
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/password', {
        method: 'PUT',
        headers: { "Content-Type": "application/json","Authorization": getToken()},
        body: JSON.stringify({token, password})
    })
}

export const createResetPasswordRequest = async (email) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/password/' + email, {
        method: 'POST',
        headers: { "Content-Type": "application/json"}
    })
}

export const deleteUserAccount = async (username) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/username/' + username, {
        method: 'DELETE',
        headers: { "Content-Type": "application/json","Authorization": getToken()}
    })
}