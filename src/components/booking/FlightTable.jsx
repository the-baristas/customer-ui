import moment from "moment";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import SeatClass from "./SeatClass";
import "./FlightTable.css"

const FlightTable = (props) => {
    let seatClassDisplayName;
    let f1ClassDisplayName;
    let f2ClassDisplayName;

    console.log(props.departureFlight);
    console.log(props.arrivalFlight);


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
    const departurePerPassengerTtl = props.departurePricePP + props.departureTaxesPP;
    const returnPerPassengerTtl = props.returnPricePP + props.returnTaxesPP;
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
            <Row>
                <Col xs={12} sm={5} className="border-bottom border-dark p-3">
                    <Row>
                        <Col
                            xs={6}
                            sm={6}
                            id="origin-airport-code"
                            className="text-center p-2"
                        >
                            {props.departureFlight.route.originAirport.iataId}
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {
                                props.departureFlight.route.destinationAirport
                                    .iataId
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col xs sm={6} className="text-center">
                            {f1DepartureTime}
                        </Col>
                        <Col xs sm={6} className="text-center">
                            {f1ArrivalTime}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={3} className="border-bottom border-dark p-3">
                    <Row>
                        <Col xs={6} sm={6} className="text-center p-2">
                            Duration
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {f1ClassDisplayName}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} className="text-center">
                            {f1DurationHours} hr {f1DurationMinutes} min
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={4} className="border-bottom border-dark p-3">
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Price per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${props.departurePricePP.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Taxes per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${props.departureTaxesPP.toFixed(2)}
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
                            ${departurePerPassengerTtl.toFixed(2)}
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
                            ${departureTotal.toFixed(2)}
                        </Col>
                    </Row>
                </Col>
            </Row>
            <br />
            <Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Return Flight Details</h5>
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
                            {props.returnFlight.route.originAirport.iataId}
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {
                                props.returnFlight.route.destinationAirport
                                    .iataId
                            }
                        </Col>
                    </Row>
                    <Row>
                        <Col xs sm={6} className="text-center">
                            {f2DepartureTime}
                        </Col>
                        <Col xs sm={6} className="text-center">
                            {f2ArrivalTime}
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={3} className="border-bottom border-dark p-3">
                    <Row>
                        <Col xs={6} sm={6} className="text-center p-2">
                            Duration
                        </Col>
                        <Col xs={6} sm={6} className="text-center p-2">
                            {f2ClassDisplayName}
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={6} sm={6} className="text-center">
                            {f2DurationHours} hr {f2DurationMinutes} min
                        </Col>
                    </Row>
                </Col>
                <Col xs={12} sm={4} className="border-bottom border-dark p-3">
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Price per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${props.returnPricePP.toFixed(2)}
                        </Col>
                    </Row>
                    <Row className="p-2">
                        <Col xs={6} sm={7}>
                            Taxes per Passenger
                        </Col>
                        <Col xs={5} sm={5} className="text-right">
                            ${props.returnTaxesPP.toFixed(2)}
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
                            ${returnPerPassengerTtl.toFixed(2)}
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
                            ${returnTotal.toFixed(2)}
                        </Col>
                    </Row>
                </Col>
            </Row>
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
