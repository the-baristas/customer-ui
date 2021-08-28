import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import moment from "moment";
import React, { useState } from "react";
import { Col, Container, Row, Button, Image } from "react-bootstrap";
import Card from "react-bootstrap/Card";
import "./FlightTable.css";
import SeatClass from "./SeatClass";
import flightplan1 from "./flightplan01.jpg";

import { getTakenSeats } from "../../api/PassengerApi";

const FlightTable = (props) => {
    let seatClassDisplayName;
    let f1ClassDisplayName;
    let f2ClassDisplayName;

    const [seatChoiceMade, setSeatChoiceMade] = useState(true);
    const [retSeatChoiceMade, setRetSeatChoiceMade] = useState(true);
    const [depSeatChoiceMade, setDepSeatChoiceMade] = useState(true);

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

   // one way option returns for seat choice

        const seatSelect = () => {
            return (props.takenSeats.map((seat) => (
        <option key={seat} value={seat}>{seat}</option>
            )));
        }

        const handleSeatChoice = (event) => {
            setSeatChoiceMade(false);
            props.setSeatChoice(event.target.value);
        }

        const submitSeatChoice = (event) => {
            props.setHasSeatChoiceUpgrade(true);
            props.setSCUPricePP(25);

        }

    const seatSelectDep = () => {
        return (props.depSeats.map((seat) => (
            <option value={seat}>{seat}</option>
                )));
            };

    const handleDepSeatChoice = (event) => {
        setDepSeatChoiceMade(false);
        props.setDepartureSeatChoice(event.target.value);
    }

    const submitDepSeatChoice = (event) => {
        props.setHasDepSeatChoiceUpgrade(true);
        props.setDepSCUPricePP(25);

    }

        const seatSelectRet = () => {
            return (props.retSeats.map((seat) => (
                <option value={seat}>{seat}</option>
                    )));
        };

        const handleRetSeatChoice = (event) => {
            setRetSeatChoiceMade(false);
            props.setReturnSeatChoice(event.target.value);
        }
    
        const submitRetSeatChoice = (event) => {
            props.setHasRetSeatChoiceUpgrade(true);
            props.setRetSCUPricePP(25);
    
        }

        const handleRemoveSeatChoice = () => {
            setSeatChoiceMade(true);
            props.setSeatChoice(null);
            props.setHasSeatChoiceUpgrade(false);
            props.setSCUPricePP(0);
        }

        const handleDepRemoveSeatChoice = () => {
            setDepSeatChoiceMade(true);
            props.setDepartureSeatChoice(null);
            props.setHasDepSeatChoiceUpgrade(false);
            props.setDepSCUPricePP(0);
        }

        const handleRetRemoveSeatChoice = () => {
            setRetSeatChoiceMade(true);
            props.setReturnSeatChoice(null);
            props.setHasRetSeatChoiceUpgrade(false);
            props.setRetSCUPricePP(0);
        }


    const USA_TAX_RATE = 0.075;
    const upgradesPricePP = props.CIUPricePP + props.SCUPricePP;
    const returnUpgradesPricePP = props.retUpgradesPricePP + props.retSCUPricePP;
    const departUpgradesPricePP = props.desUpgradesPricePP + props.depSCUPricePP;
    const taxesPP = Math.round((props.pricePerPassenger + upgradesPricePP) * USA_TAX_RATE * 100) / 100;
    const returnTaxesPP = Math.round((props.returnPricePP + returnUpgradesPricePP) * USA_TAX_RATE * 100) / 100;
    const departTaxesPP = Math.round((props.departurePricePP + departUpgradesPricePP) * USA_TAX_RATE * 100) / 100;
    const totalPerPassenger = props.pricePerPassenger + props.taxesPerPassenger + upgradesPricePP + (Math.round(upgradesPricePP * USA_TAX_RATE * 100)/100);
    const departurePerPassengerTtl =
        props.departurePricePP +
        departUpgradesPricePP +
        (Math.round(departUpgradesPricePP * USA_TAX_RATE * 100)/100) +
        props.departureTaxesPP;
    const returnPerPassengerTtl =
        props.returnPricePP + 
        props.returnTaxesPP
        + returnUpgradesPricePP
        + (Math.round(returnUpgradesPricePP * USA_TAX_RATE * 100)/100);
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

    const handleCheckInUpgrade = (amount, group) => {
        props.setCIUPricePP(amount);
        props.setCheckInGroup(group);
    };


    // Elements

    let flightTable;
    if (props.isRoundTrip) {
        flightTable = (
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
                                {f2DurationHours} hr {f2DurationMinutes} min
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
                                    <b>Boarding Group: </b>{" "}
                                    {props.depCheckInGroup}
                                    <br />
                                    <b>Class:</b> {props.departureClass}
                                    <br />
                                    <b>Seat Number:</b> {props.hasDepSeatChoiceUpgrade && props.departureSeatChoice}
                                </p>
                            </Row>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="totals">
                            Price Per Passenger: ${props.departurePricePP.toFixed(2)}
                                <br /> <br />
                                - Boarding Group Upgrade: ${props.desUpgradesPricePP.toFixed(2)}<br />
                                - Seat Choice Upgrade: ${props.depSCUPricePP.toFixed(2)}<br />
                                Total Upgrade(s) Per Passenger: $
                                {departUpgradesPricePP.toFixed(2)}
                                <br /><br />
                                Taxes Per Passenger: $
                                {departTaxesPP.toFixed(2)}
                                <br />
                                Total Per Passenger: $
                                {departurePerPassengerTtl.toFixed(2)}
                                <br />
                                Passenger(s) x {passengerCount}
                                <br />
                                <br />
                                Flight Total: ${departureTotal.toFixed(2)}
                            </Row>
                        </Col>
                    </Row>
                </Container>
                <br />
                <Card className="upgrade-dep-bg">
                            <Card.Body>
                                <Card.Title>Choose Seat?</Card.Title>
                                    <small>
                                        { !props.hasDepSeatChoiceUpgrade && <>Your seat number is randomly assigned when you book your ticket. If you have a seating preference, you can make a selection below for an additional $25 fee.</>}
                                        { props.hasDepSeatChoiceUpgrade && <>Your seat choice has been made and the upgrade is reflected above. You may still change your seat below for no additional fee.</>}
                                    </small><br /><br />
                                    <center>
                                    <select style={{ "width": "300px", "height": "40px" }} onChange={handleDepSeatChoice}>
                                    <option>Open this select menu</option>
                                    {seatSelectDep()}
                                    </select><br />
                                    { !props.hasDepSeatChoiceUpgrade && <Button style={{ "width": "300px" }} variant="primary" disabled={depSeatChoiceMade} onClick={submitDepSeatChoice}>Submit Seat Choice Add-On</Button> }
                                    <br />
                                    <Button variant="link" onClick={() => handleDepRemoveSeatChoice()}>Remove Seat Choice Upgrade</Button><br />
                                    </center>
                            </Card.Body>
                        </Card>

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
                                {props.returnFlight.route.originAirport.city} (
                                {props.returnFlight.route.originAirport.iataId})
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    props.returnFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    props.returnFlight.departureTime
                                ).format("MMMM Do, YYYY")}
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
                                {
                                    props.returnFlight.route.destinationAirport
                                        .city
                                }
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
                                    <b>Boarding Group: </b>{" "}
                                    {props.retCheckInGroup}
                                    <br />
                                    <b>Class:</b> {props.returnClass}
                                    <br />
                                    <b>Seat Number:</b> {props.hasRetSeatChoiceUpgrade && props.returnSeatChoice}
                                </p>
                            </Row>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="totals">
                                Price Per Passenger: ${props.returnPricePP.toFixed(2)}
                                <br /><br />
                                - Boarding Group Upgrade: ${props.retUpgradesPricePP.toFixed(2)}<br />
                                - Seat Choice Upgrade: ${props.retSCUPricePP.toFixed(2)}<br />
                                Total Upgrade(s) Per Passenger: $
                                {returnUpgradesPricePP.toFixed(2)}
                                <br /><br />
                                Taxes Per Passenger: $
                                {returnTaxesPP.toFixed(2)}
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
                    <Card className="upgrade-dep-bg">
                            <Card.Body>
                                <Card.Title>Choose Seat?</Card.Title>
                                    <small>
                                        { !props.hasRetSeatChoiceUpgrade && <>Your seat number is randomly assigned when you book your ticket. If you have a seating preference, you can make a selection below for an additional $25 fee.</>}
                                        { props.hasRetSeatChoiceUpgrade && <>Your seat choice has been made and the upgrade is reflected above. You may still change your seat below for no additional fee.</>}
                                    </small><br /><br />
                                    <center>
                                    <select style={{ "width": "300px", "height": "40px" }} onChange={handleRetSeatChoice}>
                                    <option>Open this select menu</option>
                                    {seatSelectRet()}
                                    </select><br />
                                    { !props.hasRetSeatChoiceUpgrade && <Button style={{ "width": "300px" }} variant="primary" disabled={retSeatChoiceMade} onClick={submitRetSeatChoice}>Submit Seat Choice Add-On</Button> }
                                    <br />
                                    <Button variant="link" onClick={() => handleRetRemoveSeatChoice()}>Remove Seat Choice Upgrade</Button><br />
                                    </center>
                            </Card.Body>
                        </Card>
                    <br />
                </Container>
                <br />

                <Row className="flights-total">
                    <h2>
                        <b>FLIGHTS TOTAL:</b> ${rtTotal.toFixed(2)}
                    </h2>
                </Row>
                <br />
            </Container>
        );
    } else {
        flightTable = (
            <Container fluid>
                <Row className="border border-dark">
                    <Col xs={12} sm={12} className="p-2">
                        <h5>Flight Details</h5>
                    </Col>
                </Row>
                    <Row className="return-selected">
                        <Col xs={12} lg={3}>
                            <Row className="origin-airport">
                                {props.selectedFlight.route.originAirport.city}{" "}
                                (
                                {
                                    props.selectedFlight.route.originAirport
                                        .iataId
                                }
                                )
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    props.selectedFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    props.selectedFlight.departureTime
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
                                    props.selectedFlight.route
                                        .destinationAirport.city
                                }
                            </Row>
                            <Row className="arrival-time">
                                {moment(
                                    props.selectedFlight.arrivalTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="arrival-date">
                                {moment(
                                    props.selectedFlight.arrivalTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={2}>
                            <Row className="dest-airport">
                                <div>
                                    <b>Boarding Group: </b> {props.checkInGroup}
                                    <br />
                                    <div><b>Class:</b> {props.seatClass}</div><br />
                                    { props.hasSeatChoiceUpgrade && (
                                        <><b>Seat Number:</b> { props.seatChoice }
                                    </>)
                                    }
                                </div>
                            </Row>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="totals">
                                Price Per Passenger: ${props.pricePerPassenger.toFixed(2)}
                                <br /><br />
                                - Boarding Group Upgrade: ${props.CIUPricePP.toFixed(2)}<br />
                                - Seat Choice Upgrade: ${props.SCUPricePP.toFixed(2)}<br />
                                Total Upgrade(s) Per Passenger: $
                                {upgradesPricePP.toFixed(2)}
                                <br /><br />
                                Taxes Per Passenger: $
                                {taxesPP.toFixed(2)}
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

                    <Card className="upgrade-dep-bg">
                            <Card.Body>
                                <Card.Title>Choose Seat?</Card.Title>
                                    <small>
                                        { !props.hasSeatChoiceUpgrade && <>Your seat number is randomly assigned when you book your ticket. If you have a seating preference, you can make a selection below for an additional $25 fee.</>}
                                        { props.hasSeatChoiceUpgrade && <>Your seat choice has been made and the upgrade is reflected above. You may still change your seat below for no additional fee.</>}
                                    </small><br /><br />
                                    <center>
                                    { props.selectedFlight.airplane.model === "Airbus A220" && <><Image src={flightplan1} style={{"width": "90%"}} /><br /><br /></> }
                                    <select style={{ "width": "300px", "height": "40px" }} onChange={handleSeatChoice}>
                                    <option>Open this select menu</option>
                                    {seatSelect()}
                                    </select><br />
                                    { !props.hasSeatChoiceUpgrade && <Button style={{ "width": "300px" }} variant="primary" disabled={seatChoiceMade} onClick={submitSeatChoice}>Submit Seat Choice Add-On</Button> }
                                    <br />
                                    <Button variant="link" onClick={() => handleRemoveSeatChoice()}>Remove Seat Choice Upgrade</Button><br />
                                    </center>
                            </Card.Body>
                        </Card>

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
                                    onClick={() => handleCheckInUpgrade(15, 1)}
                                >Upgrade To Group 1</Card.Link>
                                {props.checkInGroup !== 2 && (
                                    <Card.Link
                                        className="point"
                                        onClick={() => handleCheckInUpgrade(12, 2)}
                                    >
                                        Upgrade To Group 2
                                    </Card.Link>
                                )}
                            </Card.Body>
                        </Card>
                    )}
            </Container>
        );
    }

    return flightTable;
};

export default FlightTable;
