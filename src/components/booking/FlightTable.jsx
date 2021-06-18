import moment from "moment";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
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
            // TODO: Go to error page.
            break;
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
        <Container fluid>
            <Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Flight Details</h5>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={5} className="border-bottom border-dark p-3">
                    <Row>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {props.selectedFlight.route.originAirport.iataId}
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {
                                props.selectedFlight.route.destinationAirport
                                    .iataId
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col xs sm={6} className="text-center">
                            {departureTime}
                        </Col>
                        <Col xs sm={6} className="text-center">
                            {arrivalTime}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={3} className="border-bottom border-dark p-3">
                    <Row>
                        <Col xs={6} sm={6} className="text-center p-2">
                            Duration
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {seatClassDisplayName}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} className="text-center">
                            {durationHours} hr {durationMinutes} min
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={4} className="border-bottom border-dark p-3">
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Price per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${pricePerPassenger.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Taxes per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${taxesPerPassenger.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Total per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${totalPerPassenger.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Passenger(s)
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            x {passengerCount}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Flight total
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${totalPrice.toFixed(2)}
                        </Col>
                    </Row>
                </Col>
            </Row>
        </Container>
    );
};

export default FlightTable;
