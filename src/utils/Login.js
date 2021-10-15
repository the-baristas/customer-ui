import jwt_decode from "jwt-decode";
import { userServiceHealthCheck } from "../api/UsersService";

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

export const getRole = () => {
    var jwtToken = localStorage.getItem(keyName);
    if (jwtToken === null)
        return "";
    return jwt_decode(jwtToken).authorities[0].authority;
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

export const generateCsrfToken = async () => {
    return userServiceHealthCheck()
    .then((response) => {
            if(!response.ok){
                throw Error();
            }   
    })
    .catch((error) => {
        alert("Something went wrong on our end. Please try again later.")
    })
}

export const getCsrfToken = async () => {
    try{
            return document.cookie.split('; ').find(row => row.startsWith('XSRF-TOKEN=')).split('=')[1];
    }
    catch{
        alert("Something went wrong. Please try reloading the page.")
    }
}