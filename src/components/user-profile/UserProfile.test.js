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
            phone: "8051112222", role: "ROLE_CUSTOMER", active: true }


it("check profile loads", async () => {
    const getUserMock = jest.spyOn(usersService, 'getUserByUsername');
    getUserMock.mockResolvedValue({ok: true, status: 200, json: () => {return Promise.resolve(user)}})

    const {getByTestId} = render(<Provider store={store}><UserProfile></UserProfile></Provider>);
    await waitForElementToBeRemoved( () => getByTestId('loadingProfile') );
    expect(getUserMock).toHaveBeenCalled();
    
    expect(getByTestId('givenName').innerHTML).toContain(user.givenName);

    expect(getByTestId('phoneNumber').innerHTML).toContain("(805) 111-2222")

    getUserMock.mockRestore();
})

it("check user info failing shows error message", async () => {
    window.alert = jest.fn();
    
    const getUserMock = jest.spyOn(usersService, 'getUserByUsername');
    getUserMock.mockResolvedValue({ok: false, status: 404})

    const {getByTestId} = render(<Provider store={store}><UserProfile></UserProfile></Provider>);
    await waitForElementToBeRemoved( () => getByTestId('loadingProfile') );
    
    expect(getUserMock).toHaveBeenCalled();
    expect(window.alert).toHaveBeenCalled();

    getUserMock.mockRestore();
})