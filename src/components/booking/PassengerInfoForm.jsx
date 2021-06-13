import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import PropTypes from "prop-types";
import "./PassengerInfoForm.css";

const PassengerInfoForm = (props) => {
    const [givenName, setGivenName] = useState();
    const [familyName, setFamilyName] = useState();
    const [dateOfBirth, setDateOfBirth] = useState();
    const [gender, setGender] = useState("");
    const [streetAddress, setStreetAddress] = useState();
    const [city, setCity] = useState();
    const [state, setState] = useState();
    const [zipCode, setZipCode] = useState();
    const genderSelectElement = React.useRef(null);

    const handleSubmit = (e) => {
        e.preventDefault();
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
        setState(event.target.value);
    };

    const handleZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };

    return (
        <Form className="passenger-info-form" onSubmit={handleSubmit}>
            <Form.Group>
                <Form.Label>First Name</Form.Label>
                <Form.Control onChange={handleGivenNameChange}></Form.Control>

                <Form.Label>Last Name</Form.Label>
                <Form.Control onChange={handleFamilyNameChange}></Form.Control>

                <Form.Label>Date of Birth</Form.Label>
                <Form.Control
                    type="date"
                    onChange={handleDateOfBirthChange}
                ></Form.Control>

                <Form.Label>Gender</Form.Label>
                <Form.Control as="select" onChange={handleGenderChange}>
                    <option value="">Select One</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                </Form.Control>

                <Form.Label>Street Address</Form.Label>
                <Form.Control
                    onChange={handleStreetAddressChange}
                ></Form.Control>

                <Form.Label>City</Form.Label>
                <Form.Control onChange={handleCityChange}></Form.Control>

                <Form.Label>State</Form.Label>
                <Form.Control onChange={handleStateChange}></Form.Control>

                <Form.Label>ZIP Code</Form.Label>
                <Form.Control onChange={handleZipCodeChange}></Form.Control>
                <Button variant="primary" type="submit">
                    Continue
                </Button>
            </Form.Group>
        </Form>
    );
};

PassengerInfoForm.propTypes = {
    givenName: PropTypes.string,
    familyName: PropTypes.string
};

export default PassengerInfoForm;
