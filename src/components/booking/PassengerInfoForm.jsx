import moment from "moment";
import PropTypes from "prop-types";
import React, { useEffect, useState } from "react";
import { Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { STATE_REGEX, ZIPCODE_REGEX } from "../../utils/Validators";
import "./PassengerInfoForm.css";
import { useSelector } from "react-redux";
import { getUserByUsername } from "../../api/UsersService";

const PassengerInfoForm = (props) => {
    const userStatus = useSelector((state) => state.userStatus);

    const [validated, setValidated] = useState(false);
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [dateOfBirth, setDateOfBirth] = useState("");
    const [gender, setGender] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zipCode, setZipCode] = useState("");

    useEffect(() => {
        getUserProfileInfo();
    }, []);

    const getUserProfileInfo = () => {
        getUserByUsername(userStatus.username)
            .then((res) => {
                if (!res.ok) {
                    throw Error(res.status);
                }
                return res.json();
            })
            .then((data) => {
                setGivenName(data.givenName);
                setFamilyName(data.familyName);
                setDateOfBirth(data.dob);
                setStreetAddress(data.streetAddress);
                setCity(data.city);
                setState(data.state);
                setZipCode(data.zip);
                console.log(data)
            })
            .catch((error) => {
                if(error.message === "403"){
                    return;
                }
                else{
                    alert(
                        "We are unable to load your information at this time. Please try again later."
                    );
                }
            });
    };

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
        setState(event.target.value.toUpperCase());
    };

    const handleZipCodeChange = (event) => {
        setZipCode(event.target.value);
    };

    return (
        <div>
            <Form
                noValidate
                validated={validated}
                onSubmit={handleSubmit}
                className="passenger-info-form"
            >
                <Form.Row>
                    <Form.Group as={Col} sm={6} controlId="firstNameForm">
                        <Form.Label>First Name*</Form.Label>
                        <Form.Control
                            type="text"
                            value={givenName}
                            onChange={handleGivenNameChange}
                            required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid first name.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm={6} controlId="lastNameForm">
                        <Form.Label>Last Name*</Form.Label>
                        <Form.Control
                            type="text"
                            value={familyName}
                            onChange={handleFamilyNameChange}
                            required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid last name.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} sm={6} controlId="dateOfBirthForm">
                        <Form.Label>Date of Birth*</Form.Label>
                        <Form.Control
                            type="date"
                            value={dateOfBirth}
                            onChange={handleDateOfBirthChange}
                            max={moment(new Date()).format("YYYY-MM-DD")}
                            required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a valid date of birth.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm={6} controlId="genderForm">
                        <Form.Label>Gender*</Form.Label>
                        <Form.Control
                            as="select"
                            value={gender}
                            onChange={handleGenderChange}
                            required
                        >
                            <option value="">Select One</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a gender.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} sm={12} controlId="streetAddressForm">
                        <Form.Label>Street Address*</Form.Label>
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
                </Form.Row>
                <Form.Row>
                    <Form.Group as={Col} sm={5} controlId="cityForm">
                        <Form.Label>
                            City<span className="asterisk">*</span>
                        </Form.Label>
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
                    <Form.Group as={Col} sm={2} controlId="stateForm">
                        <Form.Label>State*</Form.Label>
                        <Form.Control
                            type="text"
                            value={state}
                            onChange={handleStateChange}
                            pattern={STATE_REGEX}
                            maxLength="2"
                            required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a state.
                        </Form.Control.Feedback>
                    </Form.Group>
                    <Form.Group as={Col} sm={5} controlId="zipCodeForm">
                        <Form.Label>ZIP Code*</Form.Label>
                        <Form.Control
                            type="text"
                            value={zipCode}
                            onChange={handleZipCodeChange}
                            pattern={ZIPCODE_REGEX}
                            maxLength="5"
                            required
                        ></Form.Control>
                        <Form.Control.Feedback type="invalid">
                            Please provide a ZIP code.
                        </Form.Control.Feedback>
                    </Form.Group>
                </Form.Row>
                <Button className="submit" variant="primary" type="submit">
                    Continue
                </Button>
            </Form>
        </div>
    );
};

PassengerInfoForm.propTypes = {
    givenName: PropTypes.string,
    familyName: PropTypes.string,
    validated: PropTypes.bool
};

export default PassengerInfoForm;
