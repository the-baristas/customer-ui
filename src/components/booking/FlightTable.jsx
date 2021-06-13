import moment from "moment";
import React from "react";
import Table from "react-bootstrap/Table";

const FlightTable = (props) => {
    let seatClassDisplayName;
    let pricePerPassenger;
    switch (props.seatClass) {
        case "economy":
            seatClassDisplayName = "Economy Class";
            pricePerPassenger = props.selectedFlight.economyPrice;
            break;
        case "business":
            seatClassDisplayName = "Business Class";
            pricePerPassenger = props.selectedFlight.businessPrice;
            break;
        case "first":
            seatClassDisplayName = "First Class";
            pricePerPassenger = props.selectedFlight.firstPrice;
            break;
        default:
            throw new Error(`Invalid seatClass: ${props.seatClass}`);
    }
    const taxesPerPassenger = pricePerPassenger * 0.07;
    const totalPerPassenger = pricePerPassenger + taxesPerPassenger;
    // TODO: Allow creation of more than 1 passenger at a time.
    const passengerCount = 1;
    const totalPrice = totalPerPassenger * passengerCount;

    return (
        <Table bordered borderless>
            <thead>
                <tr>
                    <th scope="col" colSpan="5">
                        Flight Details
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>JFK</td>
                    <td>LAX</td>
                    <td rowSpan="1">Duration</td>
                    <td rowSpan="5">{seatClassDisplayName} class</td>
                    <td rowSpan="1">Price per Passenger</td>
                    <td>{pricePerPassenger}</td>
                </tr>
                <tr>
                    <td rowSpan="4">{props.selectedFlight.departureTime}</td>
                    <td rowSpan="4">
                        {moment(props.selectedFlight.arrivalTime).toISOString()}
                    </td>
                    <td rowSpan="4">x hr x min</td>
                    <td>Taxes per Passenger</td>
                    <td>{taxesPerPassenger}</td>
                </tr>
                <tr>
                    <td>Total per Passenger</td>
                    <td>{totalPerPassenger}</td>
                </tr>
                <tr>
                    <td>Passenger(s)</td>
                    <td>{passengerCount}</td>
                </tr>
                <tr>
                    <td>Flight total</td>
                    <td>{totalPrice}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default FlightTable;
