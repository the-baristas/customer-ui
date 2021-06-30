import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import { registerUser } from '../../api/UsersService';
import {checkEmailIsValid, checkPhoneIsValid, checkPasswordIsValid} from '../../utils/Validators';


const RegistrationForm = () => {
    //Form Fields

    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isPending, setIsPending] = useState(false);

    const [error, setError] = useState('');

    const history  = useHistory();

    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);
    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(true);

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = {givenName, familyName, username, email, phone, password,
            active: true, role: 'ROLE_CUSTOMER'};

        setIsPending(true);
        let responseOk = true;
        registerUser(user)
        .then(response => {
            responseOk = response.ok;
            return response.json();
        })
        .then((data) => {
            if(!responseOk)
            {
                if(data.message)
                    throw Error(data.message);
                else
                    throw Error("There was a problem while registering. Please try again later")
            }
            setIsPending(false);
            setError(null);
            alert("Thank you for registering.")
            history.push('/login')
        })
        .catch((error) => {
            setIsPending(false);
            if(error.name === 'TypeError')
                setError('There was a problem while registering. Please try again later.')
            else
                setError(error.message)
        })
    }

    const validateEmail = (input) => {
        setEmail(input);
        setEmailIsValid(checkEmailIsValid(input));
    }

    const validatePhone = (input) => {
        setPhone(input);
        setPhoneIsValid(checkPhoneIsValid(input));
    }

    const validatePassword = (input) => {
        setPassword(input);
        setPasswordIsValid(checkPasswordIsValid(input))
    }

    const validateConfirmPassword = (input) => {
        setConfirmPassword(input);
        setConfirmPasswordIsValid(input === password)
    }

    //Used to disable the register button if the email or phone regular expressions don't pass or if the other fields are blank
    const allFieldsAreValid = () => {
        return !emailIsValid || !phoneIsValid || !passwordIsValid || !confirmPasswordIsValid
                || givenName === ''
                || familyName === ''
                || username === ''
                || email === ''
                || phone === ''
                || password === ''
                || confirmPassword === '';
    }

    return ( <div className='registrationForm'>
        <h1>Register</h1>
        <Container>
        <div data-testid="divError" style={{ backgroundColor: 'red', color: 'white' }} >{error}</div>
        <Form data-testid="formRegistration" onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    data-testid="inputGivenName"
                    type="text" 
                    placeholder="First Name"
                    value={givenName}
                    onChange={(input) => setGivenName(input.target.value)}
                    required/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    data-testid="inputFamilyName"
                    type="text" 
                    placeholder="Last Name"
                    value={familyName}
                    onChange={(input) => setFamilyName(input.target.value)}
                    required/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    data-testid="inputUsername"
                    type="text" 
                    placeholder="Username"
                    value={username}
                    onChange={(input) => setUsername(input.target.value)}
                    required/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    data-testid="inputEmail"
                    type="text" 
                    placeholder="Email"
                    value={email}
                    onChange={(input) => validateEmail(input.target.value)}
                    required/>
            </Form.Group>
            {!emailIsValid && 
                        <div data-testid="divEmailInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                            Please enter a valid email.
                        </div>}
             <Form.Group>
                <Form.Label>Phone Number</Form.Label>
                <Form.Control
                    data-testid="inputPhone"
                    type="text"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(input) => validatePhone(input.target.value)}
                    required/>
            </Form.Group>
            {!phoneIsValid && 
                        <div data-testid="divPhoneInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                            Please enter a valid phone number.
                        </div>}

            <Form.Group>
                <Form.Label>Password</Form.Label>
                <Form.Control
                    data-testid="inputPassword"
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(input) => validatePassword(input.target.value)}
                    required/>
            </Form.Group>
            {!passwordIsValid && 
                            <div data-testid="divPasswordInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                                Password must be at least 8 characters and contain at least one upper case character, lower case character, number, and special character.
                            </div>}

            <Form.Group>
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
                data-testid="inputConfirmPassword"
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(input) => validateConfirmPassword(input.target.value)}
                required/>
            </Form.Group>
            {!confirmPasswordIsValid && 
                        <div data-testid="divConfirmPasswordInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                            Passwords do not match.
                        </div>}
            <br></br>

            {!isPending && <button 
                            data-testid="registerButton"
                            className="btn btn-primary" 
                            disabled={allFieldsAreValid()}>
                                Register
                            </button>}

            {isPending && <h3 data-testid='processing' >Processing...</h3>}
        </Form>
        </Container>
    </div>
        
        );
}
 
export default RegistrationForm;