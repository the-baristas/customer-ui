import './App.css';
import {Provider} from 'react-redux';
import store from './redux/store'
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Link} from 'react-router-dom'
import RegistrationForm from './components/registrationForm/RegistrationForm';
import LoginForm from './components/loginForm/LoginForm';
import Header from './components/header/Header';
import Home from './components/home/Home';

function App() {


    return (
    <Provider store={store}>
        <Router>
            <div className="container">
            <Header></Header>
                <Switch>
                    <Route exact path='/'> 
                        <Home></Home>
                    </Route>
                    
                    <Route path="/register">
                        <Link to='/'><h1>Home</h1></Link>
                        <RegistrationForm></RegistrationForm>
                    </Route>

                    <Route path='/login'>
                        <LoginForm></LoginForm>
                    </Route>
                </Switch>
            </div>
        </Router>
    </Provider>
  );
}

export default App;
