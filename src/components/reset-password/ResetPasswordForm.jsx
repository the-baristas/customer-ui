import React, { useState } from 'react';
import { useParams } from "react-router-dom";
import { Form, Container } from 'react-bootstrap';
import { resetPassword } from '../../api/UsersService';
import { checkPasswordIsValid } from '../../utils/Validators';

const ResetPasswordForm = () => {
    const {token} = useParams();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [isPending, setIsPending] = useState(false);

    const [error, setError] = useState('');

    const [passwordIsValid, setPasswordIsValid] = useState(true);
    const [confirmPasswordIsValid, setConfirmPasswordIsValid] = useState(true);

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsPending(true);

        resetPassword(token, password)
        .then(response => {
            if(response.ok){
                setSubmitSuccess(true);
            }
            else{
                return response.json();
            }
        })
        .then((data) => {
            if(data.message)
                throw Error(data.message);
            else
                throw Error("There was a problem. Please try again later")
        })
        .catch((error) => {
            console.log(error);
            setIsPending(false);
            if(error.name === 'TypeError')
                setError('There was a problem on our end. Please try again later.')
            else
                setError(error.message)
        })
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
        return !passwordIsValid || !confirmPasswordIsValid
                || password === ''
                || confirmPassword === '';
    }

    return ( <div>
        {!submitSuccess && <Container>
            <h1>Reset Password</h1>
            <div data-testid="divError" style={{ backgroundColor: 'red', color: 'white' }} >{error}</div>
            <Form data-testid="formResetPassword" onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>New Password</Form.Label>
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
                    data-testid="submitButton"
                    className="btn btn-primary"
                    disabled={allFieldsAreValid()}>
                    Submit
                </button>}

                {isPending && <h3 data-testid='processing' >Processing...</h3>}
            </Form>
        </Container>}
        {submitSuccess &&
        <Container>
            <h4 data-testid='successMessage'>Your password was changed successfully.</h4>
            </Container>}
    </div> );
}
 
export default ResetPasswordForm;