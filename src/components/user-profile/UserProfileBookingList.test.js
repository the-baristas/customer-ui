import { render, fireEvent, waitForElementToBeRemoved } from "@testing-library/react";
import React from 'react';
import { Provider } from "react-redux";
import * as bookingApi from '../../api/BookingApi';
import store from "../../redux/store";
import UserProfileBookingsList from './UserProfileBookingsList';
import * as loginUtils from '../../utils/Login'
import { ROLE_AGENT } from "../../utils/Roles";
import userEvent from "@testing-library/user-event";

const booking = {
    flights: [
        {
            originAirportCity: "X City",
            originAirportCode: "XXX",
            destinationAirportCity: "Y City",
            destinationAirportCode: "YYY",
            departureTime: "10/10/1010T00:00:00",
            arrivalTime: "11/11/1110T00:00:00"
        }
    ],
    passengers: [
        {
        givenName: "First",
        familyName: "Last",
        seatClass: "economy"
    },
    {
        givenName: "First2",
        familyName: "Last2",
        seatClass: "business"
    },    
    ]
}

const bookingsPage = {totalElements: 2, totalPages: 1, content: [booking]};

describe("UserProfileBookingList component", () => {
    
    it("should at first display Loading...", () => {
        const {getByTestId} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        const loading = getByTestId('loading');
        expect(loading.innerHTML).toContain('Loading');
    })

    it("check booking list loads", async () => {
        const getBookingsMock = jest.spyOn(bookingApi, 'getBookingsByUsername');
        getBookingsMock.mockResolvedValue(bookingsPage);
    
        const {getByTestId} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        await waitForElementToBeRemoved( () => getByTestId('loading') );
        
        expect(getBookingsMock).toHaveBeenCalled();
        expect(getByTestId('page').innerHTML).toBe('Page: 1')
    
        getBookingsMock.mockRestore();
    })

    it("check booking list loads error", async () => {
        window.alert = jest.fn();
        const getBookingsMock = jest.spyOn(bookingApi, 'getBookingsByUsername');
        getBookingsMock.mockResolvedValue(new Error("no"));
    
        const {getByTestId} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        await waitForElementToBeRemoved( () => getByTestId('loading') );

        expect(getBookingsMock).toHaveBeenCalled();
       
        getBookingsMock.mockRestore();
    })

    it("check search field for agents loads", async () => {
        const getBookingsMock = jest.spyOn(bookingApi, 'getBookingsByUsername');
        getBookingsMock.mockResolvedValue(bookingsPage);

        const getRoleMock = jest.spyOn(loginUtils, "getRole");
        getRoleMock.mockReturnValue(ROLE_AGENT);
    
        const {getByTestId} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        await waitForElementToBeRemoved( () => getByTestId('loading') );
        
        expect(getBookingsMock).toHaveBeenCalled();
        expect(getByTestId('page').innerHTML).toBe('Page: 1')
        expect(getByTestId('searchField')).toBeEnabled();
    
        getBookingsMock.mockRestore();
        getRoleMock.mockRestore();
    })

    it("check typing in search field triggers bookingApi calls", async () => {
        const getBookingsMock = jest.spyOn(bookingApi, 'getBookingsByUsername');
        getBookingsMock.mockResolvedValue(bookingsPage);

        const getRoleMock = jest.spyOn(loginUtils, "getRole");
        getRoleMock.mockReturnValue(ROLE_AGENT);
    
        const {getByTestId, findByPlaceholderText} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        await waitForElementToBeRemoved( () => getByTestId('loading') );
        
        let searchField = getByTestId('searchField');

        //typing less than three characters should not call
        fireEvent.change(searchField, {target: {value: 'no'}})
        //userEvent.type(searchField, "no");
        //typing three or more should call
        //userEvent.type(searchField, "name");
        fireEvent.change(searchField, {target: {value: 'name'}})
        //clearing search should call
        //userEvent.type(searchField, "");
        fireEvent.change(searchField, {target: {value: ''}})
        //getBookingsMock should be called a total of three times
        //once when the page loads and two more times from the above user events
        expect(getBookingsMock).toBeCalledTimes(3);
    
        getBookingsMock.mockRestore();
        getRoleMock.mockRestore();
    })

})


