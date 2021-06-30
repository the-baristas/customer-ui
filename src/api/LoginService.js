import { getCsrfToken } from "../utils/Login";

export async function userLogin(username, password)
{
    return fetch(process.env.REACT_APP_USER_SERVICE_URL + "/login", {
        method: 'POST',
        headers: { "Content-Type": "application/json", "X-XSRF-TOKEN": await getCsrfToken() },
        body: JSON.stringify({username, password}),
        credentials: 'include'
    })
}