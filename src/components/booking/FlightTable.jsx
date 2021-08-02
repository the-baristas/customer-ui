import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import "./FlightTable.css";
import SeatClass from "./SeatClass";

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
        // TODO: Uncomment
        // throw new Error(`Invalid seat class: ${props.seatClass}`);
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
        // TODO: Uncomment
        // throw new Error(`Invalid seat class: ${props.departureClass}`);
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
        // TODO: Uncomment
        // throw new Error(`Invalid seat class: ${props.returnClass}`);
    }

    const totalPerPassenger = props.pricePerPassenger + props.taxesPerPassenger;
    const departurePerPassengerTtl =
        props.departurePricePP +
        props.desUpgradesPricePP +
        props.departureTaxesPP;
    const returnPerPassengerTtl =
        props.returnPricePP + +props.retUpgradesPricePP + props.returnTaxesPP;
    const rtTotalPerPassenger =
        props.rtPricePerPassenger +
        props.departureTaxesPP +
        props.returnTaxesPP;
    // TODO: Allow creation of more than 1 passenger at a time.
    const passengerCount = props.passengerCount;
    const departureTotal = departurePerPassengerTtl * passengerCount;
    const returnTotal = returnPerPassengerTtl * passengerCount;
    const totalPrice = totalPerPassenger * passengerCount;
    const rtTotal = rtTotalPerPassenger * passengerCount;

    const departureTime = moment(props.departureFlight.departureTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const arrivalTime = moment(props.departureFlight.arrivalTime).format(
        "MM/DD/YYYY hh:mm"
    );
    const duration = moment.duration(
        moment(props.departureFlight.arrivalTime).diff(
            props.departureFlight.departureTime
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

    const handleUpgrade = (amount, group) => {
        props.setUpgradesPricePP(amount);
        props.setCheckInGroup(group);
    };

    // Elements

    const oneWayTable = (
        <div>
            <Container fluid>
                <Row className="border border-dark">
                    <Col xs={12} sm={12} className="p-2">
                        <h5>Flight Details</h5>
                    </Col>
                </Row>
                <Row>
                    <Row className="return-selected">
                        <Col xs={12} lg={3}>
                            <Row className="origin-airport">
                                {props.departureFlight.route.originAirport.city}{" "}
                                (
                                {
                                    props.departureFlight.route.originAirport
                                        .iataId
                                }
                                )
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    props.departureFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    props.departureFlight.departureTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={1}>
                            <Row className="duration">
                                {durationHours} hr {durationMinutes} min
                            </Row>
                            <Row className="duration-icon">
                                <FontAwesomeIcon icon={faPlane} />
                            </Row>
                        </Col>

                        <Col xs={12} lg={3}>
                            <Row className="dest-airport">
                                {
                                    props.departureFlight.route
                                        .destinationAirport.city
                                }
                            </Row>
                            <Row className="arrival-time">
                                {moment(
                                    props.departureFlight.arrivalTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="arrival-date">
                                {moment(
                                    props.departureFlight.arrivalTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={2}>
                            <Row className="dest-airport">
                                <p>
                                    <b>Boarding Group: </b> {props.checkInGroup}
                                    <br />
                                    <b>Class:</b> {props.seatClass}
                                </p>
                            </Row>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="totals">
                                Price Per Passenger: ${props.pricePerPassenger}
                                <br />
                                Upgrade(s) Per Passenger: $
                                {props.upgradesPricePP}
                                <br />
                                Taxes Per Passenger: $
                                {props.taxesPerPassenger.toFixed(2)}
                                <br />
                                Total Per Passenger: $
                                {totalPerPassenger.toFixed(2)}
                                <br />
                                Passenger(s) x {passengerCount}
                                <br />
                                <br />
                                Flight Total: ${totalPrice.toFixed(2)}
                            </Row>
                        </Col>
                    </Row>

                    <br />

                    {props.checkInGroup !== 1 && (
                        <Card className="upgrade-dep-bg">
                            <Card.Body>
                                <Card.Title>Upgrade Boarding Group?</Card.Title>
                                <p>
                                    <small>
                                        Your boarding group is based on your
                                        seat class. Priority boarding is given
                                        to Group 1, which is followed by Group
                                        2, and then Group 3. By upgrading your
                                        group, you can be amongst the first to
                                        stow your carry-on baggage and board the
                                        flight.
                                    </small>
                                </p>
                                <Card.Link
                                    className="point"
                                    onClick={() => handleUpgrade(15, 1)}
                                >
                                    Upgrade To Group 1
                                </Card.Link>
                                {props.checkInGroup !== 2 && (
                                    <Card.Link
                                        className="point"
                                        onClick={() => handleUpgrade(12, 2)}
                                    >
                                        Upgrade To Group 2
                                    </Card.Link>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </Row>
            </Container>
        </div>
    );

    const roundTripTable = (
        <div>
            <Row className="border border-dark">
                <Col xs={12} sm={12} className="p-2">
                    <h5>Return Flight Details</h5>
                </Col>
            </Row>
            <Container>
                <Row className="return-selected">
                    <Col xs={12} lg={3}>
                        <Row className="origin-airport">
                            {props.returnFlight.route.originAirport.city} (
                            {props.returnFlight.route.originAirport.iataId})
                        </Row>
                        <Row className="departure-time">
                            {moment(props.returnFlight.departureTime).format(
                                "h:mm a"
                            )}
                        </Row>
                        <Row className="departure-date">
                            {moment(props.returnFlight.departureTime).format(
                                "MMMM Do, YYYY"
                            )}
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
                            {props.returnFlight.route.destinationAirport.city}
                        </Row>
                        <Row className="arrival-time">
                            {moment(props.returnFlight.arrivalTime).format(
                                "h:mm a"
                            )}
                        </Row>
                        <Row className="arrival-date">
                            {moment(props.returnFlight.arrivalTime).format(
                                "MMMM Do, YYYY"
                            )}
                        </Row>
                    </Col>

                    <Col xs={12} lg={2}>
                        <Row className="dest-airport">
                            <p>
                                <b>Boarding Group: </b> {props.retCheckInGroup}
                                <br />
                                <b>Class:</b> {props.returnClass}
                            </p>
                        </Row>
                    </Col>
                    <Col xs={12} lg={3}>
                        <Row className="totals">
                            Price Per Passenger: ${props.returnPricePP}
                            <br />
                            Upgrade(s) Per Passenger: $
                            {props.retUpgradesPricePP}
                            <br />
                            Taxes Per Passenger: $
                            {props.returnTaxesPP.toFixed(2)}
                            <br />
                            Total Per Passenger: $
                            {returnPerPassengerTtl.toFixed(2)}
                            <br />
                            Passenger(s) x {passengerCount}
                            <br />
                            <br />
                            Flight Total: ${returnTotal.toFixed(2)}
                        </Row>
                    </Col>
                </Row>
                <br />
            </Container>
            <br />

            <Row className="flights-total">
                <h2>
                    <b>FLIGHTS TOTAL:</b> ${rtTotal.toFixed(2)}
                </h2>
            </Row>
            <br />
        </div>
    );

    return (
        <div>
            {oneWayTable}
            {props.isRoundTrip && roundTripTable}
        </div>
    );
};

export default FlightTable;
