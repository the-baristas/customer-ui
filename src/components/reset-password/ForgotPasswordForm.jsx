import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { createResetPasswordRequest } from '../../api/UsersService';
import { checkEmailIsValid } from '../../utils/Validators';

const ForgotPasswordForm = () => {

    const [email, setEmail] = useState('');
    const [emailIsValid, setEmailIsValid] = useState(true);

    const [isPending, setIsPending] = useState(false);

    const [error, setError] = useState('');

    const [submitSuccess, setSubmitSuccess] = useState(false);

    const validateEmail = (input) => {
        setEmail(input);
        setEmailIsValid(checkEmailIsValid(input));
    }

    const handleSubmit = (event) => {
        event.preventDefault();

        setIsPending(true);
        

        createResetPasswordRequest(email)
            .then((response) => {
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
                setIsPending(false);
                if(error.name === 'TypeError')
                    setError('There was a problem. Please try again later.')
                else
                    setError(error.message)
            })

    }

    return (<div>
        {!submitSuccess && <Container>
            <h1>Forgot My Password</h1>
            <div data-testid="divError" style={{ backgroundColor: 'red', color: 'white' }} >{error}</div>
            <Form data-testid="formForgotPassword" onSubmit={handleSubmit}>
                <Form.Group>
                    <Form.Control
                        data-testid="inputEmail"
                        type="text"
                        placeholder="Email"
                        value={email}
                        onChange={(input) => validateEmail(input.target.value)}
                        required />
                </Form.Group>
                {!emailIsValid &&
                    <div data-testid="divEmailInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                        Please enter a valid email.
                    </div>}
                <br></br>
                {!isPending && <button
                    data-testid="submitButton"
                    className="btn btn-primary"
                    disabled={!emailIsValid || email === ''}>
                    Submit
                </button>}

                {isPending && <h3 data-testid='processing' >Processing...</h3>}
            </Form>
        </Container>}
        {submitSuccess &&
        <Container>
            <h4 data-testid='successMessage'>An email has been sent to {email}. Please follow the link in the email to change your password.</h4>
            </Container>}
    </div>
    );
}

export default ForgotPasswordForm;