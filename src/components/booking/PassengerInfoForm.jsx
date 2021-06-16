import moment from "moment";
import PropTypes from "prop-types";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./PassengerInfoForm.css";

const PassengerInfoForm = (props) => {
    const [validated, setValidated] = useState(false);
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");

    const handleSubmit = (e) => {
        const form = e.currentTarget;
        if (form.checkValidity() === true) {
            props.onPassengerInfoSubmit({
                givenName,
                familyName,
                dateOfBirth,
                gender,
                streetAddress,
                city,
                state,
                zipCode
            });
        } else {
            e.preventDefault();
            e.stopPropagation();
            setValidated(true);
        }
    };

    const handleGivenNameChange = (event) => {
        setGivenName(event.target.value);
    };

    const handleFamilyNameChange = (event) => {
        setFamilyName(event.target.value);
    };

    const handleDateOfBirthChange = (event) => {
        setDateOfBirth(event.target.value);
    };

    const handleGenderChange = (event) => {
        setGender(event.target.value);
    };

    const handleStreetAddressChange = (event) => {
        setStreetAddress(event.target.value);
    };

    const handleCityChange = (event) => {
        setCity(event.target.value);
    };

    const handleStateChange = (event) => {
        console.log(event.target.value.toUpperCase());
        setState(event.target.value.toUpperCase());
    };

    const handleZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };

    return (
        <Form
            noValidate
            validated={validated}
            className="passenger-info-form"
            onSubmit={handleSubmit}
        >
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control
                    type="text"
                    value={givenName}
                    onChange={handleGivenNameChange}
                    placeholder="First Name"
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid first name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Last Name</Form.Label>
                <Form.Control
                    type="text"
                    value={familyName}
                    onChange={handleFamilyNameChange}
                    placeholder="Last Name"
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid last name.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                    type="date"
                    value={dateOfBirth}
                    onChange={handleDateOfBirthChange}
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a valid date of birth.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Gender</Form.Label>
                <Form.Control
                    as="select"
                    value={gender}
                    onChange={handleGenderChange}
                    required
                >
                    <option value="">Select One</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a gender.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>Street Address</Form.Label>
                <Form.Control
                    type="text"
                    value={streetAddress}
                    onChange={handleStreetAddressChange}
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a street address.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>City</Form.Label>
                <Form.Control
                    type="text"
                    value={city}
                    onChange={handleCityChange}
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a city.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>State</Form.Label>
                <Form.Control
                    type="text"
                    value={state}
                    onChange={handleStateChange}
                    pattern="(A[LKSZR])|(C[AOT])|(D[EC])|(F[ML])|(G[AU])|(HI)|(I[DLNA])|(K[SY])|(LA)|(M[EHDAINSOT])|(N[EVHJMYCD])|(MP)|(O[HKR])|(P[WAR])|(RI)|(S[CD])|(T[NX])|(UT)|(V[TIA])|(W[AVIY])"
                    maxLength="2"
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a state.
                </Form.Control.Feedback>
            </Form.Group>
            <Form.Group>
                <Form.Label>ZIP Code</Form.Label>
                <Form.Control
                    type="text"
                    value={zipCode}
                    onChange={handleZipCodeChange}
                    pattern="^[0-9]{5}(?:-[0-9]{4})?$"
                    maxLength="5"
                    required
                ></Form.Control>
                <Form.Control.Feedback type="invalid">
                    Please provide a ZIP code.
                </Form.Control.Feedback>
            </Form.Group>
            <Button variant="primary" type="submit">
                Continue
            </Button>
        </Form>
    );
};

PassengerInfoForm.propTypes = {
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    validated: PropTypes.bool
};

export default PassengerInfoForm;
