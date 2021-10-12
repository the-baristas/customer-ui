import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import React from "react";
import TripCard from "../flight-list/FlightCard";
import SeatClass from "../booking/SeatClass";

xit("calls #onTripSelection when Economy Class is clicked", async () => {
    const handleTripSelection = jest.fn();
    const trip = [{
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
                iataId: "SFO",
                city: "San Francisco",
                isActive: true
            },
                isActive: true
            }
    },
    {
        id: 2,
        airplane: {
            id: 17,
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
            id:22,
            originAirport: {
                iataId: "SFO",
                city: "San Francisco",
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
]

    render(
        <TripCard trip={trip} onTripSelection={handleTripSelection} />
    );

    const economyPrice = SeatClass.ECONOMY;
    userEvent.click(screen.getByText("$90"));

    expect(handleTripSelection).toHaveBeenCalledWith(
        trip,
        SeatClass.ECONOMY
    );
});

xit("calls #onTripSelection when Business Class is clicked", async () => {
    const handleTripSelection = jest.fn();
    const trip = [{
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
        firstPrice: 100.00,
        businessReserved: 0,
        businessPrice: 100.00,
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
                iataId: "SFO",
                city: "San Francisco",
                isActive: true
            },
                isActive: true
            }
    },
    {
        id: 2,
        airplane: {
            id: 17,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 100.00,
        businessReserved: 0,
        businessPrice: 100.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:22,
            originAirport: {
                iataId: "SFO",
                city: "San Francisco",
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
]

    render(
        <TripCard trip={trip} onTripSelection={handleTripSelection} />
    );

    const businessPrice = SeatClass.BUSINESS;
    userEvent.click(screen.getByText("$90"));

    expect(handleTripSelection).toHaveBeenCalledWith(
        trip,
        SeatClass.BUSINESS
    );
});

xit("calls #onTripSelection when First Class is clicked", async () => {
    const handleTripSelection = jest.fn();
    const trip = [{
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
        firstPrice: 100.00,
        businessReserved: 0,
        businessPrice: 100.00,
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
                iataId: "SFO",
                city: "San Francisco",
                isActive: true
            },
                isActive: true
            }
    },
    {
        id: 2,
        airplane: {
            id: 17,
            firstClassSeatsMax: 20,
            businessClassSeatsMax: 50,
            economyClassSeatsMax: 280,
            model: "Airbus A220"
        },
        departureTime: "2021-08-07T16:15:00.000+00:00",
        arrivalTime: "2021-08-07T17:33:00.000+00:00",
        firstReserved: 0,
        firstPrice: 100.00,
        businessReserved: 0,
        businessPrice: 100.00,
        economyReserved: 0,
        economyPrice: 100.00,
        isActive: true,
        route: {
            id:22,
            originAirport: {
                iataId: "SFO",
                city: "San Francisco",
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
]

    render(
        <TripCard trip={trip} onTripSelection={handleTripSelection} />
    );

    const firstPrice = SeatClass.FIRST;
    userEvent.click(screen.getByText("$90"));

    expect(handleTripSelection).toHaveBeenCalledWith(
        trip,
        SeatClass.FIRST
    );
});