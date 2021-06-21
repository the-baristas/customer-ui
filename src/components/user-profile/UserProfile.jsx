import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getUserByUsername } from '../../services/usersService/UsersService';
import "./UserProfile.css"
import UserProfileBookingsList from './UserProfileBookingsList';
import Paper from '@material-ui/core/Paper';


const UserProfile = () => {

    const userStatus = useSelector((state) => state.userStatus);

    const [user, setUser] = useState({});
    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] = useState(false);

    useEffect(() => {
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
            })
            .catch((error) => {
                alert(
                    "We are unable to load your information at this time. Please try again later."
                );
                setIsPending(false);
                setInfoRetrievalSuccessful(false);
            });
    })

    const formatPhoneNumber = (phoneNumber) => {

        let formattedPhone = '';
        formattedPhone += "(" + phoneNumber.substring(0, 3) + ") ";
        formattedPhone += phoneNumber.substring(3, 6) + "-" + phoneNumber.substring(6, phoneNumber.length);
        return formattedPhone;
    }

    return ( 
        
        <div>
            {isPending && <h3 data-testid='loadingProfile'>Loading...</h3>}
            
            {!isPending && infoRetrievalSuccessful && <div className='user-profile-component'>
                <Paper>
                <div className="user-profile-title">
                    <h3>Your Profile</h3>
                </div>
                
                <div className="user-profile-item" data-testid='givenName'>
                    <b>First Name: </b> {user.givenName}
                </div>
                <div className="user-profile-item">
                    <b>Last Name: </b>{user.familyName}
                </div>
                <div className="user-profile-item">
                    <b>Username: </b>{user.username}
                </div>
                <div className="user-profile-item">
                    <b>Email: </b>{user.email}
                </div>
                <div className="user-profile-item" data-testid='phoneNumber'>
                    <b>Phone Number: </b>{formatPhoneNumber(user.phone)}
                </div>
                <div className="user-profile-item">
                    <b>Address: </b>(Coming soon)
                </div>
                <div className="user-profile-item">
                    <b>Date of Birth: </b>(Coming soon)
                </div>
                </Paper>

            </div>}
            <UserProfileBookingsList/>
        </div>
     );
}
 
export default UserProfile;