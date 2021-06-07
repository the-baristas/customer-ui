import './App.css';
import {Provider} from 'react-redux';
import store from './redux/store';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import RegistrationForm from './components/registrationForm/RegistrationForm';
import LoginForm from './components/loginForm/LoginForm';
import Header from './components/header/Header';
import Home from './components/home/Home';
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from './components/paymentForm/PaymentForm';

const promise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY);

function App() {


    return (
        
    <Provider store={store}>
        <Router>
            <Header></Header>
                <Switch>
                    <Route exact path='/'> 
                        <Home></Home>
                    </Route>
                    
                    <Route path="/register">
                        <RegistrationForm></RegistrationForm>
                    </Route>

                    <Route path='/login'>
                        <LoginForm></LoginForm>
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
