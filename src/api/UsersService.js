import { getCsrfToken, getToken } from "../utils/Login"

export const registerUser = async (user) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users', {
        method: 'POST',
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify(user)    
    })
}

export const updateUser = async (userId, user) =>
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + '/users/' + userId, {
        method: 'PUT',
        headers: { "Content-Type": "application/json","Authorization": getToken(), "X-XSRF-TOKEN": await getCsrfToken()},
        body: JSON.stringify(user)    ,
        credentials: 'include' 
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
