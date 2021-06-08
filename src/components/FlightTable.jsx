import React from "react";
import Table from "react-bootstrap/Table";

const FlightTable = (props) => {
    // const selectedFlight = props.selectedFlight;

    // Populate with dummy data for now.
    const selectedFlight = {
        id: 1,
        departureTime: new Date(),
        arrivalTime: new Date(),
        routeId: 1,
        originAirportCode: "MCO",
        originAirportCity: "Orlando",
        destinationAirportCode: "JFK",
        destinationAirportCity: "New York",
        airplaneModel: "Boeing 737",
        reservedFirstClassSeatsCount: 1,
        reservedBusinessClassSeatsCount: 1,
        reservedEconomyClassSeatsCount: 1,
        firstClassPrice: 3,
        businessClassPrice: 2,
        economyClassPrice: 1
    };

    return (
        <Table striped bordered hover>
            <thead>
                <tr>
                    <th>Departure Time</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>1</td>
                </tr>
                <tr>
                    <td>2</td>
                </tr>
                <tr>
                    <td>3</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default FlightTable;
