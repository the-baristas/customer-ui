import jwt_decode from "jwt-decode";

const keyName = 'utopiaCustomerKey';

export const loggedIn = () => {
    return localStorage.getItem(keyName) !== null;
}

export const getUsername = () => {
    var jwtToken = localStorage.getItem(keyName);
    if (jwtToken === null)
        return "";
    return jwt_decode(jwtToken).sub;
    
}

export const saveToken = (token) => {
    localStorage.setItem(keyName, token);
}

export const removeToken = () => {
    localStorage.removeItem(keyName);
}

export const getToken = () => {
    return localStorage.getItem(keyName);
}