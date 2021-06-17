import moment from "moment";
import React from "react";
import Table from "react-bootstrap/Table";
import SeatClass from "./SeatClass";

const FlightTable = (props) => {
    let seatClassDisplayName;
    switch (props.seatClass) {
        case SeatClass.ECONOMY:
            seatClassDisplayName = "Economy Class";
            break;
        case SeatClass.BUSINESS:
            seatClassDisplayName = "Business Class";
            break;
        case SeatClass.FIRST:
            seatClassDisplayName = "First Class";
            break;
        default:
            throw new Error(`Invalid seatClass: ${props.seatClass}`);
    }
    const pricePerPassenger = Math.round(props.pricePerPassenger * 100) / 100;
    const taxesPerPassenger = Math.round(props.taxesPerPassenger * 100) / 100;
    const totalPerPassenger = props.totalPerPassenger;
    // TODO: Allow creation of more than 1 passenger at a time.
    const passengerCount = props.passengerCount;
    const totalPrice = props.totalPrice;

    const departureTime = moment(props.selectedFlight.departureTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const arrivalTime = moment(props.selectedFlight.arrivalTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const duration = moment.duration(
        moment(props.selectedFlight.arrivalTime).diff(
            props.selectedFlight.departureTime
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
                    <td>${pricePerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td rowSpan="4">{departureTime}</td>
                    <td rowSpan="4">{arrivalTime}</td>
                    <td rowSpan="4">
                        {durationHours} hr {durationMinutes} min
                    </td>
                    <td>Taxes per Passenger</td>
                    <td>${taxesPerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Total per Passenger</td>
                    <td>${totalPerPassenger.toFixed(2)}</td>
                </tr>
                <tr>
                    <td>Passenger(s)</td>
                    <td>x {passengerCount}</td>
                </tr>
                <tr>
                    <td>Flight total</td>
                    <td>${totalPrice.toFixed(2)}</td>
                </tr>
            </tbody>
        </Table>
    );
};

export default FlightTable;
