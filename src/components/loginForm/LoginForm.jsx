import React, { useState } from 'react';
import { Form } from 'react-bootstrap';
import { useSelector, useDispatch } from 'react-redux';

import { login } from '../../redux/userStatus/UserStatusActions';
import { saveToken } from '../../utils/Login';
import { useHistory } from 'react-router-dom';

const LoginForm = (props) => {

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const [isPending, setIsPending] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');

    const userLoggedIn = useSelector(state => state.userLoggedIn)
    const dispatch = useDispatch();
    const history = useHistory();

    const handleSubmit = (event) => {
        event.preventDefault();
        setErrorMessage('');
        setIsPending(true);

        fetch('http://localhost:8080/login', {
            method: 'POST',
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
            .then(response => {
                if (!response.ok) {
                    if (response.status === 403) {
                        throw Error("Username and/or password are incorrect.");
                    }
                    else {
                        throw Error("There was a problem while trying to communicate with our server. Please try again later.")
                    }

                }
                saveToken(response.headers.get('Authorization'));
                dispatch(login());
                setIsPending(false);
                history.push('/')
            })
            .catch((error) => {
                setIsPending(false);
                if (error.name === 'TypeError') {
                    setErrorMessage("There was a problem while trying to communicate with our server. Please try again later.");
                }
                else {
                    setErrorMessage(error.message);
                }
                
            })

    }

    //Used to disable the login button if the other fields are blank
    const allFieldsAreValid = () => {
        return username === '' || password === '';
    }

    return (
        <div className='loginForm'>
            <h1>Login</h1>
            <div data-testid="divError" style={{ backgroundColor: 'red', color: 'white' }} >{errorMessage}</div>
            <Form data-testid="formLogin" onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                        data-testid="inputUsername"
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(input) => setUsername(input.target.value)}
                        required />
                </Form.Group>

                <Form.Group>
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                        data-testid="inputPassword"
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(input) => setPassword(input.target.value)}
                        required />
                </Form.Group>

                {!isPending && <button
                    data-testid="loginButton"
                    className="btn btn-primary"
                    disabled={allFieldsAreValid()}>
                    Login
                            </button>}

                {isPending && <h3 data-testid='processing' >Processing...</h3>}
            </Form>
        </div>

    );
}

export default LoginForm;