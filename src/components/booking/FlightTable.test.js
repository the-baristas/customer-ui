import { render, screen } from "@testing-library/react";
import React from "react";
import FlightTable from "./FlightTable";
import SeatClass from "./SeatClass";

it("renders info for flight with economy seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.ECONOMY;
    const pricePerPassenger = 1;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("ABC")).toBeInTheDocument();
    expect(screen.getByText("BCD")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 01:00")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 02:00")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("Economy Class")).toBeInTheDocument();
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("$0.10")).toBeInTheDocument();
    expect(screen.getAllByText("$1.10")).toHaveLength(2);
    expect(screen.getByText("x 1")).toBeInTheDocument();
});

it("renders info for flight with business seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.BUSINESS;
    const pricePerPassenger = 1;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("ABC")).toBeInTheDocument();
    expect(screen.getByText("BCD")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 01:00")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 02:00")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("Business Class")).toBeInTheDocument();
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("$0.10")).toBeInTheDocument();
    expect(screen.getAllByText("$1.10")).toHaveLength(2);
    expect(screen.getByText("x 1")).toBeInTheDocument();
});

it("renders info for flight with first seat class", async () => {
    const selectedFlight = {
        id: 1,
        airplane: {
            model: ""
        },
        departureTime: "06/24/2021 01:00",
        arrivalTime: "06/24/2021 02:00",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: true,
        route: {
            originAirport: {
                iataId: "ABC"
            },
            destinationAirport: {
                iataId: "BCD"
            }
        }
    };
    const seatClass = SeatClass.FIRST;
    const pricePerPassenger = 1;
    const taxesPerPassenger = 0.1;
    const passengerCount = 1;
    render(
        <FlightTable
            selectedFlight={selectedFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassenger}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
    );

    expect(screen.getByText("ABC")).toBeInTheDocument();
    expect(screen.getByText("BCD")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 01:00")).toBeInTheDocument();
    expect(screen.getByText("06/24/2021 02:00")).toBeInTheDocument();
    expect(screen.getByText("1 hr 0 min")).toBeInTheDocument();
    expect(screen.getByText("First Class")).toBeInTheDocument();
    expect(screen.getByText("$1.00")).toBeInTheDocument();
    expect(screen.getByText("$0.10")).toBeInTheDocument();
    expect(screen.getAllByText("$1.10")).toHaveLength(2);
    expect(screen.getByText("x 1")).toBeInTheDocument();
});
