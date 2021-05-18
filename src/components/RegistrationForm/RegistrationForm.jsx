import React, { useState, useEffect } from 'react';
import { Form } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';

const RegistrationForm = () => {
    //Form Fields
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');

    const [isPending, setIsPending] = useState(false);

    const [error, setError] = useState('');

    const history  = useHistory();

    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const phoneValidator = new RegExp('1?\W*([2-9][0-8][0-9])\W*([2-9][0-9]{2})\W*([0-9]{4})(\se?x?t?(\d*))?');
    const [emailIsValid, setEmailIsValid] = useState(true);
    const emailValidator = new RegExp('^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+[.][a-zA-Z]{2,4}$');

    const handleSubmit = (event) => {
        event.preventDefault();
        const user = {givenName, familyName, username, email, phone, password,
            isActive: true, role: 'ROLE_CUSTOMER'};

        let postResponse = null;

        setIsPending(true);

        fetch('http://localhost:8080/users', {
            method: 'POST',
            headers: { "Content-Type": "application/json"},
            body: JSON.stringify(user)    
        })
        .then(response => {
            postResponse = response
            return response.json();
        })
        .then((data) => {
            if(!postResponse.ok)
            {
                if(data.message)
                    throw Error(data.message);
                else
                    throw Error("There was a problem while registering. Please try again later")
            }
            setIsPending(false);
            setError(null);
            alert("Thank you for registering.")
            history.push('/')
        })
        .catch((error) => {
            setIsPending(false);
            setError(error.message)
        })
    }

    const validateEmail = (input) => {
        setEmail(input);
        setEmailIsValid(emailValidator.test(input));
    }

    const validatePhone = (input) => {
        setPhone(input);
        setPhoneIsValid(phoneValidator.test(input));
    }

    const allFieldsAreValid = (input) => {
        return !emailIsValid || !phoneIsValid
                || givenName === ''
                || familyName === ''
                || username === ''
                || password === '';
    }

    return ( <div className='registrationForm'>
        <h1>Register</h1>
        {error && <div style={{ backgroundColor: 'red', color: 'white' }} >{error}</div>}
        <Form onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text" 
                    placeholder="First Name"
                    value={givenName}
                    onChange={(input) => setGivenName(input.target.value)}
                    required/>
            </Form.Group>
            
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text" 
                    placeholder="Last Name"
                    value={familyName}
                    onChange={(input) => setFamilyName(input.target.value)}
                    required/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Username</Form.Label>
                <Form.Control
                    type="text" 
                    placeholder="username"
                    value={username}
                    onChange={(input) => setUsername(input.target.value)}
                    required/>
            </Form.Group>

            <Form.Group>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type="text" 
                    placeholder="Email"
                    value={email}
                    onChange={(input) => validateEmail(input.target.value)}
                    required/>
            </Form.Group>
            {!emailIsValid && 
                        <div style={{ backgroundColor: 'red', color: 'white' }} >
                            Please enter a valid email
                        </div>}

            <label>Phone Number</label>
            <input
                type="text"
                placeholder="Phone Number"
                value={phone}
                onChange={(input) => validatePhone(input.target.value)}
                required/>
            {!phoneIsValid && 
                        <div style={{ backgroundColor: 'red', color: 'white' }} >
                            Please enter a valid phone number
                        </div>}


            <label>Password</label>
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(input) => setPassword(input.target.value)}
                required/>

            {!isPending && <button 
                            title="registerButton"
                            className="btn btn-primary" 
                            disabled={allFieldsAreValid()}>
                                Register
                            </button>}

            {isPending && <h3>Processing</h3>}
        </Form>
    </div>
        
        );
}
 
export default RegistrationForm;