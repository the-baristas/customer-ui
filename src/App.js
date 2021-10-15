import React, { useEffect } from 'react';
import { Provider, useDispatch } from "react-redux";
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
import ResetPasswordForm from './components/reset-password/ResetPasswordForm';
import ForgotPasswordForm from './components/reset-password/ForgotPasswordForm';
import FetchInterceptor from './utils/FetchInterceptor';
import UserProfileBookingsList from './components/user-profile/UserProfileBookingsList';


function App() {

    return (
        <Provider store={store}>
            <Router>
                <FetchInterceptor/>
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

                    <Route exact path='/profile'>
                        <UserProfile />
                    </Route>

                    <Route path='/profile/history'>
                        <UserProfileBookingsList />
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
