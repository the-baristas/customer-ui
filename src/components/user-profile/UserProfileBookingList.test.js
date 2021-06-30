import { render, waitForElementToBeRemoved } from "@testing-library/react";
import React from 'react';
import { Provider } from "react-redux";
import * as bookingApi from '../../api/BookingApi';
import store from "../../redux/store";
import UserProfileBookingsList from './UserProfileBookingsList';

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

    it("check booking list loads", async () => {
        window.alert = jest.fn();
        const getBookingsMock = jest.spyOn(bookingApi, 'getBookingsByUsername');
        getBookingsMock.mockResolvedValue(new Error("no"));
    
        const {getByTestId} = render(<Provider store={store}><UserProfileBookingsList></UserProfileBookingsList></Provider>);
        await waitForElementToBeRemoved( () => getByTestId('loading') );

        expect(getBookingsMock).toHaveBeenCalled();
        expect(window.alert).toHaveBeenCalled();
       
        getBookingsMock.mockRestore();
    })

})


