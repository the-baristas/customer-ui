import './App.css';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom'
import {Link} from 'react-router-dom'
import RegistrationForm from './components/RegistrationForm';

function App() {


    return (
        <Router>
        <div className="container">
            <Switch>
                <Route exact path='/'> 
                    <Link to='/'><h1>Home</h1></Link>
                    <h3>Login</h3>
                    <Link to='/register'><h3>Register</h3></Link>
                </Route>
                
                <Route path="/register">
                    <Link to='/'><h1>Home</h1></Link>
                    <RegistrationForm></RegistrationForm>
                </Route>
            </Switch>
        </div>
    </Router>
  );
}

export default App;
