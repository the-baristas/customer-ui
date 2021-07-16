import React from 'react';
import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from '../logoutButton/LogoutButton';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import Button from 'react-bootstrap/Button';
import './Header.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import SettingsMenu from '../user-profile/SettingsMenu';

const Header = () => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn)

    const currentPageIsUserProfile = () => {
        return window.location.href.includes("/profile");
    }

    return ( 

                <Navbar bg="light" expand="lg">
                    <Navbar.Brand id="logo" href="/">UTOPIA</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="mr-auto">
                        </Nav>
                        { !userLoggedIn && <Nav.Link data-testid="loginButton" id="nav-links" href="/login">Login</Nav.Link> } 
                        {!userLoggedIn &&<Nav.Link id="nav-links" href="/register">Register</Nav.Link> }
                        
            {userLoggedIn && !currentPageIsUserProfile() && <Nav.Link id="nav-links" href="/profile">My Account</Nav.Link> }
            {userLoggedIn && currentPageIsUserProfile() && <SettingsMenu className="settings-menu" ></SettingsMenu>}
            { userLoggedIn && <LogoutButton ></LogoutButton>}
                    </Navbar.Collapse>
                    </Navbar>
     );
}
 
export default Header;