
const keyName = 'utopiaCustomerKey';

export const loggedIn = () => {
    return localStorage.getItem(keyName) !== null;
}

export const saveToken = (token) => {
    localStorage.setItem(keyName, token);
}

export const removeToken = () => {
    localStorage.removeItem(keyName);
}