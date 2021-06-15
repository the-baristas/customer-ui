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
    pricePerPassenger = (Math.round(pricePerPassenger * 100) / 100);
    const taxesPerPassenger = (
        Math.round(pricePerPassenger * 0.07 * 100) / 100
    );
    const totalPerPassenger = pricePerPassenger + taxesPerPassenger;
    // TODO: Allow creation of more than 1 passenger at a time.
    const passengerCount = 1;
    const totalPrice = totalPerPassenger * passengerCount;
    const departureTime = moment(props.selectedFlight.departureTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const arrivalTime = moment(props.selectedFlight.arrivalTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const duration = moment.duration(
        moment(props.selectedFlight.arrivalTime, "YYYY-MM-DDThh:mm:ss").diff(
            props.selectedFlight.departureTime,
            "YYYY-MM-DDThh:mm:ss"
        )
    );
    const durationHours = Math.floor(duration.asHours());
    const durationMinutes = duration.minutes();

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
                    <td>{props.selectedFlight.route.originAirport.iataId}</td>
                    <td>
                        {props.selectedFlight.route.destinationAirport.iataId}
                    </td>
                    <td rowSpan="1">Duration</td>
                    <td rowSpan="5">{seatClassDisplayName}</td>
                    <td rowSpan="1">Price per Passenger</td>
                    <td>{pricePerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td rowSpan="4">{departureTime}</td>
                    <td rowSpan="4">{arrivalTime}</td>
                    <td rowSpan="4">
                        {durationHours} hr {durationMinutes} min
                    </td>
                    <td>Taxes per Passenger</td>
                    <td>{taxesPerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total per Passenger</td>
                    <td>{totalPerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Passenger(s)</td>
                    <td>x {passengerCount}</td>
                </tr>
                <tr>
                    <td>Flight total</td>
                    <td>{totalPrice.toFixed(2)}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default FlightTable;
