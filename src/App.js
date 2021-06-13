import React from "react";
import { Provider } from "react-redux";
import {
    BrowserRouter as Router,
    Redirect,
    Route,
    Switch
} from "react-router-dom";
import "./App.css";
import Header from "./components/header/Header";
import Home from "./components/home/Home";
import LoginForm from "./components/loginForm/LoginForm";
import RegistrationForm from "./components/RegistrationForm/RegistrationForm";
import store from "./redux/store";

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Header />
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/booking" />
                    </Route>

                    <Route path="/booking">
                        <Home />
                    </Route>

                    <Route path="/register">
                        <RegistrationForm />
                    </Route>

                    <Route path="/login">
                        <LoginForm />
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
