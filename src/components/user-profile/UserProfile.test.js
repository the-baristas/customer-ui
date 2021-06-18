import React from 'react';
import {render, fireEvent, screen, waitForElementToBeRemoved} from "@testing-library/react";
import userEvent from "@testing-library/user-event"
import UserProfile from './UserProfile';
import { Provider } from 'react-redux';
import store from "../../redux/store";
import * as usersService from '../../services/usersService/UsersService';
import { faAlignJustify } from '@fortawesome/free-solid-svg-icons';


let user = { userId: 1, givenName: "First", familyName: "Last", 
            username: "username", email: "email@email.com", 
            phone: "8056744000", role: "ROLE_CUSTOMER", active: true }

// jest.mock('../../services/usersService/UsersService');
// mockService.getUserByUsername.mockImplementation( () => 
//             Promise.resolve(user));
// const mockService = jest.mock('../../services/usersService/UsersService', () => ({
//     getUserByUsername: (username) => Promise.resolve({json: () => Promise.resolve({
//         user
//     })})
// }));

//jest.spyOn(usersService, 'getUserByUsername').mockReturnValue(  )
usersService.getUserByUsername.mockImplementation( () => {Promise.resolve({json: Promise.resolve({user})})} )

xit("check profile loads", async () => {
    const {getByTestId} = render(<Provider store={store}><UserProfile></UserProfile></Provider>);
    await waitForElementToBeRemoved( () => screen.getByTestId('loading') );
    expect(getUserByUsername).toHaveBeenCalled();
    
    const givenNameField = screen.getByTestId('givenName');
    expect(givenNameField.innerHTML).toContain(user.givenName);
})