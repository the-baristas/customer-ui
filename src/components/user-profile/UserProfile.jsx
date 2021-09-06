import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUserByUsername, updateUser } from "../../api/UsersService";
import {
    EMAIL_REGEX,
    PHONE_REGEX,
    STATE_REGEX,
    ZIPCODE_REGEX
} from "../../utils/Validators";
import "./UserProfile.css";
import UserProfileBookingsList from "./UserProfileBookingsList";
import Paper from "@material-ui/core/Paper";
import { Form } from "react-bootstrap";
import EditButton from "./EditButton";
import { userLogin } from "../../api/LoginService";
import { saveToken } from "../../utils/Login";
import { login } from "../../redux/userStatus/UserStatusActions";
import moment from "moment";

const UserProfile = () => {
    const userStatus = useSelector((state) => state.userStatus);
    const dispatch = useDispatch();

    const [user, setUser] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] =
        useState(false);
    const [error, setError] = useState("");

    const [updateFormDisabled, setUpdateFormDisabled] = useState(true);
    const [updateIsPending, setUpdateIsPending] = useState(false);
    const [givenName, setGivenName] = useState("");
    const [familyName, setFamilyName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [dob, setDob] = useState("");
    const [streetAddress, setStreetAddress] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");
    const [zip, setZip] = useState("");

    const [isValidated, setIsValidated] = useState(false);

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
                setUser(data);
                setIsPending(false);
                setInfoRetrievalSuccessful(true);
                setInitialFormValues(data);
            })
            .catch((error) => {
                if(error.message === "403"){
                    return;
                }
                else{
                    alert(
                        "We are unable to load your information at this time. Please try again later."
                    );
                    setIsPending(false);
                    setInfoRetrievalSuccessful(false);
                }
            });
    };

    const handleSubmitUpdateProfile = (event) => {
        event.preventDefault();
        let form = event.currentTarget;
        if (form.checkValidity() === false) {
            event.stopPropagation();
            setIsValidated(true);
            return;
        }
        const updatedUser = {
            givenName,
            familyName,
            username,
            email,
            phone,
            active: true,
            role: "ROLE_CUSTOMER",
            dob,
            streetAddress,
            city,
            state,
            zip
        };

        setUpdateIsPending(true);
        userLogin(userStatus.username, password)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw Error("Password is incorrect.");
                    } else {
                        throw Error(
                            "There was a problem while trying to communicate with our server. Please try again later."
                        );
                    }
                }
                return;
            })
            .then(() => {
                updateUserInfo(updatedUser).then(() => {
                    logUserBackIn();
                    return;
                });
                return;
            })
            .then(() => {
                setIsPending(false);
                setUser({ username, givenName, familyName, email, phone, dob, streetAddress, city, state, zip });
                alert("Information updated successfully");
            })
            .catch((error) => {
                setUpdateIsPending(false);

                if (error.name === "TypeError")
                    setError(
                        "There was a problem while updating. Please try again later."
                    );
                else setError(error.message);
            });
    };

    const logUserBackIn = () => {
        userLogin(username, password)
            .then((response) => {
                if (!response.ok) {
                    if (response.status === 401) {
                        throw Error("Username and/or password are incorrect.");
                    } else {
                        throw Error(
                            "There was a problem while trying to communicate with our server. Please try again later."
                        );
                    }
                }
                saveToken(response.headers.get("Authorization"));
                dispatch(login(username));
            })
            .catch((error) => {
                setUpdateIsPending(false);

                if (error.name === "TypeError")
                    setError(
                        "There was a problem while updating. Please try again later."
                    );
                else setError(error.message);
            });
    };

    const updateUserInfo = (updatedUser) => {
        let responseOk = true;
        return updateUser(user.userId, updatedUser)
            .then((response) => {
                responseOk = response.ok;
                if (responseOk) {
                    setError(null);
                    return;
                } else return response.json();
            })
            .then((data) => {
                if (!responseOk) {
                    if (data.message) throw Error(data.message);
                    else
                        throw Error(
                            "There was a problem while updating. Please try again later"
                        );
                }
                setUpdateIsPending(false);
            })
            .catch((error) => {
                setUpdateIsPending(false);

                if (error.name === "TypeError")
                    setError(
                        "There was a problem while updating. Please try again later."
                    );
                else setError(error.message);
            });
    };

    const setInitialFormValues = (user) => {
        setFamilyName(user.familyName);
        setGivenName(user.givenName);
        setEmail(user.email);
        setPhone(user.phone);
        setUsername(user.username);
        setDob(user.dob);
        setStreetAddress(user.streetAddress);
        setCity(user.city);
        setState(user.state);
        setZip(user.zip);
    };

    const handleEdit = () => {
        setUpdateFormDisabled(false);
    };

    const handleCancel = () => {
        setUpdateFormDisabled(true);
        setInitialFormValues(user);
        setError("");
    };

    const getFullAddress = () => {
        return `${streetAddress} ${city}, ${state} ${zip}`;
    };

    return (
        <div>
            {isPending && <h3 data-testid="loadingProfile">Loading...</h3>}

            {!isPending && infoRetrievalSuccessful && (
                <div className="user-profile-component">
                    <Paper>
                        <div className="user-profile-title">
                            <h3>Your Profile &nbsp;</h3>
                            <EditButton
                                data-testid="editButton"
                                onClickEdit={() => {
                                    handleEdit();
                                }}
                                onClickCancel={() => {
                                    handleCancel();
                                }}
                            />
                        </div>
                        <div
                            data-testid="divError"
                            style={{ backgroundColor: "red", color: "white" }}
                        >
                            {error}
                        </div>
                        <Form
                            noValidate
                            validated={isValidated}
                            data-testid="formRegistration"
                            onSubmit={handleSubmitUpdateProfile}
                            className="user-profile-form"
                        >
                            <fieldset disabled={updateFormDisabled}>
                                <Form.Group className="user-profile-item">
                                    <Form.Label>First Name</Form.Label>
                                    <Form.Control
                                        data-testid="inputGivenName"
                                        className="user-profile-form-field"
                                        type="text"
                                        value={givenName}
                                        onChange={(input) =>
                                            setGivenName(input.target.value)
                                        }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a first name.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="user-profile-item">
                                    <Form.Label>Last Name</Form.Label>
                                    <Form.Control
                                        data-testid="inputFamilyName"
                                        className="user-profile-form-field"
                                        type="text"
                                        value={familyName}
                                        onChange={(input) =>
                                            setFamilyName(input.target.value)
                                        }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a last name.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="user-profile-item">
                                    <Form.Label>Username</Form.Label>
                                    <Form.Control
                                        data-testid="inputUsername"
                                        className="user-profile-form-field"
                                        type="text"
                                        value={username}
                                        onChange={(input) =>
                                            setUsername(input.target.value)
                                        }
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a username.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="user-profile-item">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        data-testid="inputEmail"
                                        className="user-profile-form-field"
                                        type="text"
                                        value={email}
                                        onChange={(input) =>
                                            setEmail(input.target.value)
                                        }
                                        pattern={EMAIL_REGEX}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid email.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="user-profile-item">
                                    <Form.Label>Phone Number</Form.Label>
                                    <Form.Control
                                        data-testid="inputPhone"
                                        className="user-profile-form-field"
                                        type="text"
                                        placeholder="Phone Number"
                                        value={phone}
                                        onChange={(input) =>
                                            setPhone(input.target.value)
                                        }
                                        pattern={PHONE_REGEX}
                                        required
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Please enter a valid phone number.
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group className="user-profile-item">
                                <Form.Label>Date of Birth</Form.Label>
                                    <Form.Control
                                        type="date"
                                        data-testid="inputDob"
                                        className="user-profile-form-field"
                                        value={dob}
                                        onChange={(input) =>
                                            setDob(input.target.value)
                                        }
                                        max={moment(
                                            new Date(Date.now())
                                        ).format("YYYY-MM-DD")}
                                        required
                                    ></Form.Control>
                                </Form.Group>

                                <div className="user-profile-item">
                                    <b>Address: </b>{" "}
                                    {updateFormDisabled && (
                                        <p data-testId="fullAddress">{getFullAddress()}</p>
                                    )}
                                </div>

                                {!updateFormDisabled && (
                                    <div className="user-profile-item">
                                        <Form.Row className="user-profile-item">
                                            <Form.Group
                                                sm={12}
                                                controlId="streetAddressForm"
                                                className="user-profile-item"
                                            >
                                                <Form.Label>
                                                    Street Address
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    data-testid="inputStreetAddress"
                                                    value={streetAddress}
                                                    onChange={(input) =>
                                                        setStreetAddress(
                                                            input.target.value
                                                        )
                                                    }
                                                    required
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid street
                                                    address.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                sm={5}
                                                controlId="cityForm"
                                                className="user-profile-item"
                                            >
                                                <Form.Label>City</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    data-testid="inputCity"
                                                    value={city}
                                                    onChange={(input) =>
                                                        setCity(
                                                            input.target.value
                                                        )
                                                    }
                                                    required
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid city.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                        <Form.Row className="user-profile-item">
                                            <Form.Group
                                                sm={2}
                                                controlId="stateForm"
                                                className="user-profile-item"
                                            >
                                                <Form.Label>State</Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    data-testid="inputState"
                                                    value={state}
                                                    onChange={(input) =>
                                                        setState(
                                                            input.target.value
                                                        )
                                                    }
                                                    pattern={STATE_REGEX}
                                                    maxLength="2"
                                                    required
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid state.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                            <Form.Group
                                                sm={5}
                                                controlId="zipCodeForm"
                                                className="user-profile-item"
                                            >
                                                <Form.Label>
                                                    ZIP Code
                                                </Form.Label>
                                                <Form.Control
                                                    type="text"
                                                    data-testid="inputZip"
                                                    value={zip}
                                                    onChange={(input) =>
                                                        setZip(
                                                            input.target.value
                                                        )
                                                    }
                                                    pattern={ZIPCODE_REGEX}
                                                    maxLength="5"
                                                    required
                                                ></Form.Control>
                                                <Form.Control.Feedback type="invalid">
                                                    Please enter a valid ZIP
                                                    code.
                                                </Form.Control.Feedback>
                                            </Form.Group>
                                        </Form.Row>
                                    </div>
                                )}

                                {!updateFormDisabled && (
                                    <div>
                                        <Form.Group className="user-profile-item">
                                            <Form.Label>
                                                <b>
                                                    Please re-enter your
                                                    password to confirm changes:
                                                </b>
                                            </Form.Label>
                                            <Form.Control
                                                data-testid="inputPassword"
                                                className="user-profile-form-field"
                                                placeholder="Password"
                                                type="password"
                                                onChange={(input) =>
                                                    setPassword(
                                                        input.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </Form.Group>

                                        {!updateIsPending && (
                                            <button
                                                data-testid="updateButton"
                                                className="btn btn-primary"
                                            >
                                                Update
                                            </button>
                                        )}
                                        {updateIsPending && (
                                            <h3 data-testid="loadingUpdate">
                                                Loading...
                                            </h3>
                                        )}
                                    </div>
                                )}
                            </fieldset>
                        </Form>
                    </Paper>
                </div>
            )}
            <UserProfileBookingsList />
        </div>
    );
};

export default UserProfile;
