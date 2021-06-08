import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import React from 'react';
import { Provider } from 'react-redux';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import './App.css';
import Header from './components/header/Header';
import Home from './components/home/Home';
import LoginForm from './components/loginForm/LoginForm';
import PaymentForm from './components/paymentForm/PaymentForm';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import SearchResults from './components/search-results/SearchResults';
import store from './redux/store';

const promise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY);

function App() {
    return (
        <Provider store={store}>
            <Router>
                <Header></Header>
                <Switch>
                    <Route exact path='/'>
                        <Redirect to="/booking"/>
                    </Route>
                    <Route path="/booking">
                        <Home />
                    </Route>

                    <Route path="/register">
                        <RegistrationForm />
                    </Route>

                    <Route path='/login'>
                        <LoginForm />
                    </Route>

                    <Route path="/search-results">
                        <SearchResults />
                    </Route>

                    <Route path='/payment'>
                        <Elements stripe={promise} ><PaymentForm></PaymentForm></Elements>
                    </Route>
                </Switch>
            </Router>
        </Provider>
    );
}

export default App;
