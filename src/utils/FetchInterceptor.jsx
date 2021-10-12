import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router';
import { logout } from '../redux/userStatus/UserStatusActions';
import { removeToken } from './Login';

const FetchInterceptor = () => {

    const dispatch = useDispatch();
    const history = useHistory();

    // Sets up interceptor fetch calls
    // Import the interceptor in index.js to have it be applied to all fetch invocations in the app.
    // This interceptor will intercept responses from fetch to check if they
    // have status code 403, which signifies that the user's JWT token has expired.
    // They will be logged out and redirected to the login page.
    const tokenExpirationInterceptor = (function() {
        const originalFetch = window.fetch;
        window.fetch = function() {
            return originalFetch.apply(this, arguments)
                .then((res) => {
                    if(res.status === 403){
                        handleLogout();
                    }
                    return res;
                })
        }
    })();
    const handleLogout = () => {
        removeToken();
        dispatch(logout());
        history.push('/login')
    }

    return ( <></> );
}
 
export default FetchInterceptor;