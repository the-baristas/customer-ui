import React, { useEffect } from 'react';
import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Booking from "./components/booking/Booking";
import LoginForm from "./components/loginForm/LoginForm";
import RegistrationForm from "./components/registrationForm/RegistrationForm";
import UserProfile from "./components/user-profile/UserProfile";
import store from "./redux/store";
import { generateCsrfToken } from './utils/Login';
import ResetPasswordForm from './components/reset-password/ResetPasswordForm';
import ForgotPasswordForm from './components/reset-password/ForgotPasswordForm';


function App() {

    useEffect(() => {
        generateCsrfToken();
    }, [])

    return (
        <Provider store={store}>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/booking" />
                    </Route>

                    <Route path='/booking'>
                        <Booking />
                    </Route>

                    <Route path="/register">
                        <RegistrationForm />
                    </Route>

                    <Route path="/login">
                        <LoginForm />
                    </Route>

                    <Route path='/profile'>
                        <UserProfile />
                    </Route>

                    <Route path='/forgotpassword'>
                       <ForgotPasswordForm/>
                    </Route>

                    <Route path='/resetpassword/:token'>
                        <ResetPasswordForm />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
