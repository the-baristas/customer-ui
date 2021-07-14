import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import FlightCard from "../flight-list/FlightCard";
import SeatClass from "../booking/SeatClass";

it("calls #onFlightSelection when Economy Class is clicked", async () => {
    const handleFlightSelection = jest.fn();
    const flight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    }

    render(
        <FlightCard flight={flight} onFlightSelection={handleFlightSelection} />
    );

    const economyPrice = SeatClass.ECONOMY;
    userEvent.click(screen.getByText("$100"));

    expect(handleFlightSelection).toHaveBeenCalledWith(
        flight,
        SeatClass.BUSINESS
    );
});

it("doesn't call #onFlightSelection with Business when Economy Class is clicked", async () => {
    const handleFlightSelection = jest.fn();
    const flight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    }

    render(
        <FlightCard flight={flight} onFlightSelection={handleFlightSelection} />
    );

    const economyPrice = SeatClass.ECONOMY;
    userEvent.click(screen.getByText("$100"));

    expect(handleFlightSelection).toHaveBeenCalledWith(
        flight,
        SeatClass.BUSINESS
    );
})

it("calls #onFlightSelection when flight button is clicked", async () => {
    const handleFlightSelection = jest.fn();
    const flight = {
        id: 1,
        airplane: {
            id: 16,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 300.00,
        businessReserved: 0,
        businessPrice: 200.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:21,
            originAirport: {
                iataId: "JFK",
                city: "New York City",
                isActive:true
            },
            destinationAirport: {
                iataId: "LAX",
                city: "Los Angeles",
                isActive: true
            },
                isActive: true
            }
    }

    render(
        <FlightCard flight={flight} onFlightSelection={handleFlightSelection} />
    );

    const firstPrice = SeatClass.FIRST;
    userEvent.click(screen.getByText("$300"));

    expect(handleFlightSelection).toHaveBeenCalledWith(
        flight,
        SeatClass.FIRST
    );
})