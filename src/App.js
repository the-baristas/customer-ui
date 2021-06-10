import './App.css';
import {Provider} from 'react-redux';
import store from './redux/store';
import {BrowserRouter as Router, Route, Switch, Link, Redirect} from 'react-router-dom';
import RegistrationForm from './components/RegistrationForm/RegistrationForm';
import LoginForm from './components/loginForm/LoginForm';
import Header from './components/header/Header';
import Home from './components/home/Home';
import SearchResults from './components/flight-list/FlightList';

function App() {


    return (
    <Provider store={store}>
        <Router>
            <Header></Header>
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/booking" />
                    </Route>

                    <Route path='/booking'> 
                        <Home />
                    </Route>
                    
                    <Route path="/register">
                        <RegistrationForm />
                    </Route>

                    <Route path='/login'>
                        <LoginForm />
                    </Route>
                </Switch>
        </Router>
    </Provider>
  );
}

export default App;
