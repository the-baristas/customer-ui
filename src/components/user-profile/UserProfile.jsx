import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserByUsername, updateUser } from '../../services/usersService/UsersService';
import {checkEmailIsValid, checkPhoneIsValid} from '../../utils/Validators';
import "./UserProfile.css"
import UserProfileBookingsList from './UserProfileBookingsList';
import Paper from '@material-ui/core/Paper';
import { Form, Container } from 'react-bootstrap';
import EditIcon from '@material-ui/icons/Edit';
import Button from '@material-ui/core/Button';
import EditButton from './EditButton';


const UserProfile = () => {

    const userStatus = useSelector((state) => state.userStatus);

    const [user, setUser] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] = useState(false);
    const [error, setError] = useState('');

    const [updateFormDisabled, setUpdateFormDisabled] = useState(true);
    const [updateIsPending, setUpdateIsPending] = useState(false);
    const [givenName, setGivenName] = useState('');
    const [familyName, setFamilyName] = useState('');
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const [phoneIsValid, setPhoneIsValid] = useState(true);
    const [emailIsValid, setEmailIsValid] = useState(true);

    useEffect(() => {
        getUserProfileInfo();
    }, [])


    const getUserProfileInfo = () => {
        getUserByUsername(userStatus.username)
        .then((res) => {
            if (!res.ok) {
                throw Error();
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
            alert(
                "We are unable to load your information at this time. Please try again later."
            );
            setIsPending(false);
            setInfoRetrievalSuccessful(false);
        });
    }

    const handleSubmitUpdateProfile = (event) => {
        event.preventDefault();
        const updatedUser = {givenName, familyName, username, email, phone,
            active: true, role: 'ROLE_CUSTOMER'};

        setUpdateIsPending(true);
        let responseOk = true;
        updateUser(user.userId, updatedUser)
        .then(response => {
            responseOk = response.ok;
            if(responseOk){
                setUpdateIsPending(false);
                setError(null);
                alert("Information updated successfully");
                getUserProfileInfo();
                return;
            }
            else
                return response.json();
        })
        .then((data) => {
            if(!responseOk)
            {
                if(data.message)
                    throw Error(data.message);
                else
                    throw Error("There was a problem while updating. Please try again later")
            }
            setUpdateIsPending(false);
        })
        .catch((error) => {
            setUpdateIsPending(false);

            if(error.name === 'TypeError')
                setError('There was a problem while updating. Please try again later.')
            else
                setError(error.message)
        })
    }

    const setInitialFormValues = (user) => {
        setFamilyName(user.familyName);
        setGivenName(user.givenName);
        setEmail(user.email);
        setPhone(user.phone);
        setUsername(user.username);
    }

    const handleEdit = () => {
        setUpdateFormDisabled(false);
    }

    const handleCancel = () => {
        setUpdateFormDisabled(true);
        setInitialFormValues(user);
    }



    const validateEmail = (input) => {
        setEmail(input);
        setEmailIsValid(checkEmailIsValid(input));
    }

    const validatePhone = (input) => {
        setPhone(input);
        setPhoneIsValid(checkPhoneIsValid(input));
    }

    const formatPhoneNumber = (phoneNumber) => {

        let formattedPhone = '';
        formattedPhone += "(" + phoneNumber.substring(0, 3) + ") ";
        formattedPhone += phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, phoneNumber.length);
        return formattedPhone;
    }

        //Used to disable the register button if the email or phone regular expressions don't pass or if the other fields are blank
        const allFieldsAreValid = () => {
            return !emailIsValid || !phoneIsValid
                    || givenName === ''
                    || familyName === ''
                    || username === ''
                    || email === ''
                    || phone === ''
        }

    return ( 
        
        <div>
            {isPending && <h3 data-testid='loadingProfile'>Loading...</h3>}
            
            {!isPending && infoRetrievalSuccessful && <div className='user-profile-component'>
                <Paper>
                    <div className="user-profile-title">
                        <h3>Your Profile &nbsp;</h3>
                        <EditButton data-testid='editButton' onClickEdit={() => {handleEdit()}} onClickCancel={() => {handleCancel()}} />                        
                    </div>  
                    <div data-testid="divError" style={{ backgroundColor: 'red', color: 'white' }} >{error}</div>
                    <Form data-testid="formRegistration" onSubmit={handleSubmitUpdateProfile} className='user-profile-form'>
                        <fieldset disabled={updateFormDisabled}>
                            <Form.Group className='user-profile-item'>
                                <Form.Label>First Name</Form.Label>
                                <Form.Control
                                    data-testid="inputGivenName"
                                    type="text" 
                                    value={givenName}
                                    onChange={(input) => setGivenName(input.target.value)}
                                    required/>
                            </Form.Group>
                            
                            <Form.Group className='user-profile-item'>
                                <Form.Label>Last Name</Form.Label>
                                <Form.Control
                                    data-testid="inputFamilyName"
                                    type="text" 
                                    value={familyName}
                                    onChange={(input) => setFamilyName(input.target.value)}
                                    required/>
                            </Form.Group>

                            <Form.Group className='user-profile-item'>
                                <Form.Label>Username</Form.Label>
                                <Form.Control
                                    data-testid="inputUsername"
                                    type="text" 
                                    value={username}
                                    onChange={(input) => setUsername(input.target.value)}
                                    required/>
                            </Form.Group>

                            <Form.Group className='user-profile-item'>
                                <Form.Label>Email</Form.Label>
                                <Form.Control
                                    data-testid="inputEmail"
                                    type="text" 
                                    value={email}
                                    onChange={(input) => validateEmail(input.target.value)}
                                    required/>
                            </Form.Group>
                            {!emailIsValid && 
                                        <div data-testid="divEmailInvalid" style={{ backgroundColor: 'red', color: 'white' }} >
                                            Please enter a valid email.
                                        </div>}
                            <Form.Group className='user-profile-item'>
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

                            <div className="user-profile-item">
                                <b>Address: </b>(Coming soon)
                            </div>
                            <div className="user-profile-item">
                                <b>Date of Birth: </b>(Coming soon)
                            </div>
                            {!updateFormDisabled && <div>
                                {!updateIsPending && <button 
                                data-testid="updateButton"
                                className="btn btn-primary" 
                                disabled={allFieldsAreValid()}>
                                    Update
                                </button>}
                                {updateIsPending && <h3 data-testid='loadingUpdate'>Loading...</h3>}
                            </div>}
                        </fieldset>
                        </Form>
                </Paper>

            </div>}
            <UserProfileBookingsList/>
        </div>
     );
}
 
export default UserProfile;