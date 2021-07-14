import moment from "moment";
import { Col, Container, Row, Button } from "react-bootstrap";
import SeatClass from "./SeatClass";
import Card from 'react-bootstrap/Card';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import "./FlightTable.css";
import React, { useState } from "react";

const FlightTable = (props) => {
    let seatClassDisplayName;
    let f1ClassDisplayName;
    let f2ClassDisplayName;


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

    switch (props.departureClass) {
        case SeatClass.ECONOMY:
            f1ClassDisplayName = "Economy Class";
            break;
        case SeatClass.BUSINESS:
            f1ClassDisplayName = "Business Class";
            break;
        case SeatClass.FIRST:
            f1ClassDisplayName = "First Class";
            break;
        default:
            // TODO: Go to error page.
            break;
    }

    switch (props.returnClass) {
        case SeatClass.ECONOMY:
            f2ClassDisplayName = "Economy Class";
            break;
        case SeatClass.BUSINESS:
            f2ClassDisplayName = "Business Class";
            break;
        case SeatClass.FIRST:
            f2ClassDisplayName = "First Class";
            break;
        default:
            // TODO: Go to error page.
            break;
    }

    const totalPerPassenger = props.pricePerPassenger + props.taxesPerPassenger;
    const departurePerPassengerTtl = props.departurePricePP + + props.desUpgradesPP + props.departureTaxesPP;
    const returnPerPassengerTtl = props.returnPricePP + + props.retUpgradesPP + props.returnTaxesPP;
    const rtTotalPerPassenger = props.rtPricePerPassenger + props.departureTaxesPP + props.returnTaxesPP;
    // TODO: Allow creation of more than 1 passenger at a time.
    const passengerCount = props.passengerCount;
    const departureTotal = departurePerPassengerTtl * passengerCount;
    const returnTotal = returnPerPassengerTtl * passengerCount;
    const totalPrice = totalPerPassenger * passengerCount;
    const rtTotal = rtTotalPerPassenger * passengerCount;

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

    // RT values
    const f1DepartureTime = moment(props.departureFlight.departureTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const f1ArrivalTime = moment(props.departureFlight.arrivalTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const f2DepartureTime = moment(props.returnFlight.departureTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const f2ArrivalTime = moment(props.returnFlight.arrivalTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const f1Duration = moment.duration(
        moment(props.departureFlight.arrivalTime).diff(
            props.departureFlight.departureTime
        )
    );
    const f2Duration = moment.duration(
        moment(props.returnFlight.arrivalTime).diff(
            props.returnFlight.departureTime
        )
    );
    const f1DurationHours = Math.floor(f1Duration.asHours());
    const f1DurationMinutes = f1Duration.minutes();
    const f2DurationHours = Math.floor(f2Duration.asHours());
    const f2DurationMinutes = f2Duration.minutes();

    return (
        <Container fluid>
            {props.isRoundTrip === false && 
            <>
            <Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Flight Details</h5>
                </Col>
            </Row>
            <Row>
                <Col xs={12} sm={5} className="border-bottom border-dark p-3">
                    <Row>
                        <Col
                            xs={6}
                            sm={6}
                            id="origin-airport-code"
                            className="text-center p-2"
                        >
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
                            ${props.pricePerPassenger.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Taxes per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${props.taxesPerPassenger.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Total per Passenger
                        </Col>
                        <Col
                            xs={5}
                            sm={5}
                            className="text-right"
                            aria-label="total per passenger"
                        >
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
            </>
            }

            {props.isRoundTrip === true && 
            <Container>
                <br />
<Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Departure Flight Details</h5>
                </Col>
            </Row>
            <Container>
             <Row className="return-selected">
            <Col xs={12} lg={3}>
                 <Row className="origin-airport">
                { props.departureFlight.route.originAirport.city } ({ props.departureFlight.route.originAirport.iataId })
                </Row>
                <Row className="departure-time">
                { moment(props.departureFlight.departureTime).format('h:mm a') }
                </Row>
                <Row className="departure-date">
                 { moment(props.departureFlight.departureTime).format('MMMM Do, YYYY') }
                </Row>
                </Col>

                <Col xs={12} lg={1}>
                <Row className="duration">
                {f2DurationHours} hr {f2DurationMinutes} min
                </Row>
                <Row className="duration-icon">
                <FontAwesomeIcon icon={faPlane} />
                </Row>
                </Col>

                <Col xs={12} lg={3}>
             <Row className="dest-airport">
                { props.departureFlight.route.destinationAirport.city }
                </Row>
             <Row className="arrival-time">
                { moment(props.departureFlight.arrivalTime).format('h:mm a') }
                </Row>
             <Row className="arrival-date">
                { moment(props.departureFlight.arrivalTime).format('MMMM Do, YYYY') }
                </Row>
             </Col> 

             <Col xs={12} lg={2}>
                <Row className="dest-airport">
                <p><b>Boarding Group: </b> { props.depCheckInGroup }<br />
                         <b>Class:</b> {props.departureClass}
                             </p>
                </Row>
                </Col>
                <Col xs={12} lg={3}>
                    <Row className="totals">
                    Price Per Passenger: ${props.departurePricePP}<br />
                    Upgrade(s) Per Passenger: ${props.desUpgradesPP}<br />
                    Taxes Per Passenger: ${props.departureTaxesPP.toFixed(2)}<br />
                    Total Per Passenger: ${departurePerPassengerTtl.toFixed(2)}<br />
                    Passenger(s) x {passengerCount}<br /><br />
                    
                    Flight Total: ${departureTotal.toFixed(2)}
                    </Row>
                </Col>
             </Row>
             </Container>
            <br />

            <br />

            <Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Return Flight Details</h5>
                </Col>
            </Row>
            <Container>
             <Row className="return-selected">
            <Col xs={12} lg={3}>
                 <Row className="origin-airport">
                { props.returnFlight.route.originAirport.city } ({ props.returnFlight.route.originAirport.iataId })
                </Row>
                <Row className="departure-time">
                { moment(props.returnFlight.departureTime).format('h:mm a') }
                </Row>
                <Row className="departure-date">
                 { moment(props.returnFlight.departureTime).format('MMMM Do, YYYY') }
                </Row>
                </Col>

                <Col xs={12} lg={1}>
                <Row className="duration">
                {f1DurationHours} hr {f1DurationMinutes} min
                </Row>
                <Row className="duration-icon">
                <FontAwesomeIcon icon={faPlane} />
                </Row>
                </Col>

                <Col xs={12} lg={3}>
             <Row className="dest-airport">
                { props.returnFlight.route.destinationAirport.city }
                </Row>
             <Row className="arrival-time">
                { moment(props.returnFlight.arrivalTime).format('h:mm a') }
                </Row>
             <Row className="arrival-date">
                { moment(props.returnFlight.arrivalTime).format('MMMM Do, YYYY') }
                </Row>
             </Col> 

             <Col xs={12} lg={2}>
                <Row className="dest-airport">
                <p><b>Boarding Group: </b> { props.retCheckInGroup }<br />
                         <b>Class:</b> {props.returnClass}
                             </p>
                </Row>
                </Col>
                <Col xs={12} lg={3}>
                    <Row className="totals">
                    Price Per Passenger: ${props.returnPricePP}<br />
                    Upgrade(s) Per Passenger: ${props.retUpgradesPP}<br />
                    Taxes Per Passenger: ${props.returnTaxesPP.toFixed(2)}<br />
                    Total Per Passenger: ${returnPerPassengerTtl.toFixed(2)}<br />
                    Passenger(s) x {passengerCount}<br /><br />
                    
                    Flight Total: ${returnTotal.toFixed(2)}
                    </Row>
                </Col>
             </Row>
             <br />

             </Container>
            <br />

            <Row className="flights-total">
                <h2><b>FLIGHTS TOTAL:</b> ${rtTotal.toFixed(2)}</h2>
            </Row>
            <br />

            </Container>
            }
        </Container>
    );
};

export default FlightTable;
