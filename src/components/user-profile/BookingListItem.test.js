import { render } from "@testing-library/react";
import React from 'react';
import BookingListItem from "./BookingListItem";

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

describe("BookingListItem component", () => {
    
    it("should display airport information for booked flight", () => {
        const {getByTestId} = render(<BookingListItem booking={booking}></BookingListItem>);
        const logoutButton = getByTestId('headerFlight');
        expect(logoutButton.innerHTML).toContain('X City');
        expect(logoutButton.innerHTML).toContain('YYY');
    })

    xit("should display arrival and departure times", () => {
        const {getByTestId} = render(<BookingListItem booking={booking}></BookingListItem>);
        const arrivalTime = getByTestId('flightTimes');
        expect(arrivalTime.innerHTML).toContain('10/10/1010 00:00:00');
        const departureTime = getByTestId('flightTimes');
        expect(departureTime.innerHTML).toContain('11/11/1110 00:00:00');
    })

    it("should display passengers", () => {
        const {getByTestId} = render(<BookingListItem booking={booking}></BookingListItem>);
        const logoutButton = getByTestId('passengersList');
        expect(logoutButton.innerHTML).toContain('First');
        expect(logoutButton.innerHTML).toContain('Last2');
        expect(logoutButton.innerHTML).toContain('economy');
        expect(logoutButton.innerHTML).toContain('business');
    })

})


