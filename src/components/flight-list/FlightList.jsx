import { faPlane } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Pagination from "@material-ui/lab/Pagination";
import "bootstrap/dist/css/bootstrap.css";
import moment from "moment";
import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SeatClass from "../booking/SeatClass";
import CheckInGroupUpgrade from "./CheckInGroupUpgrade";
import FlightCard from "./FlightCard";
import "./FlightList.css";

const FlightList = (props) => {
    // Constants

    const FlightType = {
        DEPARTING: "DEPARTING",
        RETURNING: "RETURNING"
    };

    // States

    const [departingFlightsPageNumber, setDepartingFlightsPageNumber] =
        useState(1);
    const [returningFlightsPageNumber, setReturningFlightsPageNumber] =
        useState(1);
    const [departingFlightsSort, setDepartingFlightsSort] =
        useState("economyPrice");
    const [returningFlightsSort, setReturningFlightsSort] =
        useState("economyPrice");
    const [departingFlightsFilter, setDepartingFlightsFilter] = useState("all");
    const [returningFlightsFilter, setReturningFlightsFilter] = useState("all");
    const [departingFlightSelected, setDepartingFlightSelected] =
        useState(false);
    const [returningFlightSelected, setReturningFlightSelected] =
        useState(false);
    const [departingFlightCheckInGroup, setDepartingFlightCheckInGroup] =
        useState(3);
    const [returningFlightCheckInGroup, setReturningFlightCheckInGroup] =
        useState(3);
    const [additionalCost, setAdditionalCost] = useState(0);
    const [selectedDepartingFlight, setSelectedDepartingFlight] =
        useState(null);
    const [selectedReturningFlight, setSelectedReturningFlight] =
        useState(null);
    const [departingFlightSeatClass, setDepartingFlightSeatClass] = useState(
        SeatClass.ECONOMY
    );
    const [returningFlightSeatClass, setReturningFlightSeatClass] = useState(
        SeatClass.ECONOMY
    );
    const [departingFlightHours, setDepartingFlightHours] = useState(0);
    const [departingFlightMinutes, setDepartingFlightMinutes] = useState(0);
    const [returningFlightHours, setReturningFlightHours] = useState(0);
    const [returningFlightMinutes, setReturningFlightMinutes] = useState(0);
    const [departingFlightPrice, setDepartingFlightPrice] = useState(0);
    const [returningFlightPrice, setReturningFlightPrice] = useState(0);

    // Callbacks

    const handleContinueButtonClick = (event) => {
        props.onOneWayTripContinue(
            selectedDepartingFlight,
            departingFlightSeatClass,
            departingFlightCheckInGroup,
            additionalCost
        );
    };

    const handleDepartingFlightGroupUpgrade = (amount, group) => {
        setAdditionalCost(amount);
        setDepartingFlightCheckInGroup(group);
    };

    const handleReturningFlightGroupUpgrade = (amount, group) => {
        setAdditionalCost(amount);
        setReturningFlightCheckInGroup(group);
    };

    const handleDepartingFlightsPageChange = (event, pageNumber) => {
        props.onDepartingFlightsPageChange(
            pageNumber,
            departingFlightsSort,
            departingFlightsFilter
        );
        setDepartingFlightsPageNumber(pageNumber);
    };

    const handleDepartingFlightsSortChange = (event) => {
        const sort = event.target.value;
        props.onDepartingFlightsSortChange(
            departingFlightsPageNumber,
            sort,
            departingFlightsFilter
        );
        setDepartingFlightsSort(sort);
    };

    const handleDepartingFlightsFilterChange = (event) => {
        const filter = event.target.value;
        props.onDepartingFlightsFilterChange(
            departingFlightsPageNumber,
            departingFlightsSort,
            filter
        );
        setDepartingFlightsFilter(filter);
    };

    const handleReturningFlightsPageChange = (event, pageNumber) => {
        props.onReturningFlightsPageChange(
            pageNumber,
            returningFlightsSort,
            returningFlightsFilter
        );
        setReturningFlightsPageNumber(pageNumber);
    };

    const handleReturningFlightsSortChange = (event) => {
        const sort = event.target.value;
        props.onReturningFlightsSortChange(
            returningFlightsPageNumber,
            sort,
            returningFlightsFilter
        );
        setReturningFlightsSort(sort);
    };

    const handleReturningFlightsFilterChange = (event) => {
        const filter = event.target.value;
        props.onReturningFlightsFilterChange(
            returningFlightsPageNumber,
            returningFlightsSort,
            filter
        );
        setReturningFlightsFilter(filter);
    };

    const handleClearButtonClick = (event) => {
        setDepartingFlightSelected(false);
        setReturningFlightSelected(false);
        updateCheckInGroup(departingFlightSeatClass, FlightType.DEPARTING);
        updateCheckInGroup(returningFlightSeatClass, FlightType.RETURNING);
    };

    const handleDepartingFlightSelection = (selectedFlight, seatClass) => {
        const duration = moment.duration(
            moment(selectedFlight.arrivalTime).diff(
                selectedFlight.departureTime
            )
        );
        const hours = Math.floor(duration.asHours());
        setDepartingFlightHours(hours);
        const minutes = duration.minutes();
        setDepartingFlightMinutes(minutes);
        setDepartingFlightSelected(true);
        setSelectedDepartingFlight(selectedFlight);
        setDepartingFlightSeatClass(seatClass);
        updateCheckInGroup(seatClass, FlightType.DEPARTING);
        updateFlightPrice(selectedFlight, seatClass, FlightType.DEPARTING);
    };

    const handleReturningFlightSelection = (selectedFlight, seatClass) => {
        const duration = moment.duration(
            moment(selectedFlight.arrivalTime).diff(
                selectedFlight.departureTime
            )
        );
        const hours = Math.floor(duration.asHours());
        setReturningFlightHours(hours);
        const minutes = duration.minutes();
        setReturningFlightMinutes(minutes);
        setReturningFlightSelected(true);
        setSelectedReturningFlight(selectedFlight);
        setReturningFlightSeatClass(seatClass);
        updateCheckInGroup(seatClass, FlightType.RETURNING);
        updateFlightPrice(selectedFlight, seatClass, FlightType.RETURNING);
    };

    const updateCheckInGroup = (seatClass, flightType) => {
        let checkInGroup;
        switch (seatClass) {
            case SeatClass.ECONOMY:
                checkInGroup = 3;
                break;
            case SeatClass.BUSINESS:
                checkInGroup = 2;
                break;
            case SeatClass.FIRST:
                checkInGroup = 1;
                break;
            default:
                // TODO: Go to error page.
                throw new Error(`Invalid seat class: ${seatClass}`);
        }
        if (flightType === FlightType.DEPARTING) {
            setDepartingFlightCheckInGroup(checkInGroup);
        } else {
            setReturningFlightCheckInGroup(checkInGroup);
        }
    };

    const updateFlightPrice = (selectedFlight, seatClass, flightType) => {
        let pricePerPassenger;
        switch (seatClass) {
            case SeatClass.ECONOMY:
                pricePerPassenger = selectedFlight.economyPrice;
                break;
            case SeatClass.BUSINESS:
                pricePerPassenger = selectedFlight.businessPrice;
                break;
            case SeatClass.FIRST:
                pricePerPassenger = selectedFlight.firstPrice;
                break;
            default:
                // TODO: Go to error page.
                throw new Error(`Invalid seat class: ${seatClass}`);
        }
        pricePerPassenger = Math.round(pricePerPassenger * 100) / 100;

        if (flightType === FlightType.DEPARTING) {
            setDepartingFlightPrice(pricePerPassenger);
        } else {
            setReturningFlightPrice(pricePerPassenger);
        }
    };

    const canContinue = () => {
        if (props.isRoundTrip) {
            if (departingFlightSelected && returningFlightSelected) {
                return true;
            }
        } else {
            if (departingFlightSelected) {
                return true;
            }
        }
    };

    // Elements

    const departingFlightCards = props.departingFlights.map((flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            onFlightSelection={handleDepartingFlightSelection}
        />
    ));

    const returningFlightCards = props.returningFlights.map((flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            onFlightSelection={handleReturningFlightSelection}
        />
    ));

    const oneWayList = (
        // renders one way flight list if isRoundTrip is false
        <div className="one-way">
            <Container>
                <center>
                    <h4>Results from Search</h4>
                </center>
                <label htmlFor="sort-by">
                    <b>Sort by:</b>
                </label>
                {"  "}

                <select
                    name="sort-by"
                    id="sort-by"
                    onChange={handleDepartingFlightsSortChange}
                >
                    <option value="economyPrice">Price</option>
                    <option value="departureTime">Departure</option>
                    <option value="arrivalTime">Arrival</option>
                </select>
            </Container>

            <Container>
                <label htmlFor="filter">
                    <b>Filter:</b>
                </label>
                {"  "}

                <select
                    name="filter"
                    id="filter"
                    onChange={handleDepartingFlightsFilterChange}
                >
                    <option value="all">All</option>
                    <option value="morning">Morning Flights Only</option>
                    <option value="afternoon">Afternoon Flights Only</option>
                    <option value="evening">Evening Flights Only</option>
                </select>
            </Container>

            <div className="pagination">
                <Pagination
                    count={props.departingFlightsPagesCount}
                    page={departingFlightsPageNumber}
                    onChange={handleDepartingFlightsPageChange}
                />
            </div>

            {departingFlightCards}
            <br />

            <div className="pagination">
                <Pagination
                    count={props.departingFlightsPagesCount}
                    page={departingFlightsPageNumber}
                    onChange={handleDepartingFlightsPageChange}
                />
            </div>

            {departingFlightSelected && (
                <Container>
                    <Row className="itinerary-title">Itinerary:</Row>
                </Container>
            )}

            {departingFlightSelected && (
                <Container>
                    <Row className="departure-selected">
                        <Col xs={12} lg={3}>
                            <center>
                                <b>Departure Flight Selected:</b>
                            </center>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="origin-airport">
                                {
                                    selectedDepartingFlight.route.originAirport
                                        .city
                                }{" "}
                                (
                                {
                                    selectedDepartingFlight.route.originAirport
                                        .iataId
                                }
                                )
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    selectedDepartingFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    selectedDepartingFlight.departureTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={1}>
                            <Row className="duration">
                                {departingFlightHours} hr{" "}
                                {departingFlightMinutes} min
                            </Row>
                            <Row className="duration-icon">
                                <FontAwesomeIcon icon={faPlane} />
                            </Row>
                        </Col>

                        <Col xs={12} lg={3}>
                            <Row className="dest-airport">
                                {
                                    selectedDepartingFlight.route
                                        .destinationAirport.city
                                }
                            </Row>
                            <Row className="arrival-time">
                                {moment(
                                    selectedDepartingFlight.arrivalTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="arrival-date">
                                {moment(
                                    selectedDepartingFlight.arrivalTime
                                ).format("MMMM Do, YYYY")}
                            </Row>

                            <br />
                        </Col>

                        <Col xs={12} lg={2}>
                            <Row className="arrival-date">
                                <p>
                                    <b>Boarding Group: </b> {"   "}{" "}
                                    {departingFlightCheckInGroup}{" "}
                                </p>
                                <p>
                                    <small>
                                        <b>Class:</b> {departingFlightSeatClass}{" "}
                                        ◦<b> Price:</b> ${departingFlightPrice}
                                    </small>
                                </p>
                            </Row>
                        </Col>

                        {departingFlightCheckInGroup !== 1 && (
                            <Card className="upgrade-dep-bg">
                                <Card.Body>
                                    <Card.Title>
                                        Upgrade Boarding Group?
                                    </Card.Title>
                                    <p>
                                        <small>
                                            Your boarding group is based on your
                                            seat class. Priority boarding is
                                            given to Group 1, which is followed
                                            by Group 2, and then Group 3. By
                                            upgrading your group, you can be
                                            amongst the first to stow your
                                            carry-on baggage and board the
                                            flight.
                                        </small>
                                    </p>
                                    <Card.Link
                                        className="point"
                                        onClick={() =>
                                            handleDepartingFlightGroupUpgrade(
                                                15,
                                                1
                                            )
                                        }
                                    >
                                        Upgrade To Group 1
                                    </Card.Link>
                                    {departingFlightCheckInGroup !== 2 && (
                                        <Card.Link
                                            className="point"
                                            onClick={() =>
                                                handleDepartingFlightGroupUpgrade(
                                                    12,
                                                    2
                                                )
                                            }
                                        >
                                            Upgrade To Group 2
                                        </Card.Link>
                                    )}
                                </Card.Body>
                            </Card>
                        )}
                    </Row>
                    <br />
                </Container>
            )}

            <br />
            <br />
        </div>
    );

    const roundTripList = (
        // renders round trip flight list
        <div className="round-trip">
            <Container id="departure-sort">
                <center>
                    <h4>Departure Flights</h4>
                </center>
                <label htmlFor="sort-by">
                    <b>Sort by:</b>
                </label>
                {"  "}

                <select
                    name="sort-by"
                    id="sort-by"
                    data-testid="search-1"
                    onChange={handleDepartingFlightsSortChange}
                >
                    <option value="economyPrice">Price</option>
                    <option value="departureTime">Departure</option>
                    <option value="arrivalTime">Arrival</option>
                </select>
            </Container>

            <Container id="departure-filter">
                <label htmlFor="filter">
                    <b>Filter:</b>
                </label>
                {"  "}

                <select
                    name="filter"
                    id="filter"
                    onChange={handleDepartingFlightsFilterChange}
                >
                    <option value="all">All</option>
                    <option value="morning">Morning Flights Only</option>
                    <option value="afternoon">Afternoon Flights Only</option>
                    <option value="evening">Evening Flights Only</option>
                </select>
            </Container>

            {props.departingFlightsPagesCount > 1 && (
                <div className="pagination">
                    <Pagination
                        count={props.departingFlightsPagesCount}
                        page={departingFlightsPageNumber}
                        onChange={handleDepartingFlightsPageChange}
                    />
                </div>
            )}

            <div id="depFlightCards">{departingFlightCards}</div>
            <br />

            {props.departingFlightsPagesCount > 1 && (
                <div className="pagination">
                    <Pagination
                        count={props.departingFlightsPagesCount}
                        page={departingFlightsPageNumber}
                        onChange={handleDepartingFlightsPageChange}
                    />
                </div>
            )}

            <br />
            <Container id="return-sort">
                <center>
                    <h4>Return Flights</h4>
                </center>
                <label htmlFor="sort-by">
                    <b>Sort by:</b>
                </label>
                {"  "}

                <select
                    name="sort-by"
                    id="sort-by"
                    onChange={handleReturningFlightsSortChange}
                >
                    <option value="economyPrice">Price</option>
                    <option value="departureTime">Departure</option>
                    <option value="arrivalTime">Arrival</option>
                </select>
            </Container>

            <Container id="return-filter">
                <label htmlFor="filter">
                    <b>Filter:</b>
                </label>
                {"  "}

                <select
                    name="filter"
                    id="filter"
                    onChange={handleReturningFlightsFilterChange}
                >
                    <option value="all">All</option>
                    <option value="morning">Morning Flights Only</option>
                    <option value="afternoon">Afternoon Flights Only</option>
                    <option value="evening">Evening Flights Only</option>
                </select>
            </Container>

            {props.returningFlightsPagesCount > 1 && (
                <div className="pagination">
                    <Pagination
                        count={props.returningFlightsPagesCount}
                        page={returningFlightsPageNumber}
                        onChange={handleReturningFlightsPageChange}
                    />
                </div>
            )}

            <div id="retFlightCards">{returningFlightCards}</div>
            <br />

            {props.returningFlightsPagesCount > 1 && (
                <div className="pagination">
                    <Pagination
                        count={props.returningFlightsPagesCount}
                        page={returningFlightsPageNumber}
                        onChange={handleReturningFlightsPageChange}
                    />
                </div>
            )}

            {/** selected flights here */}

            {(returningFlightSelected || departingFlightSelected) && (
                <Container>
                    <Row className="itinerary-title">Itinerary:</Row>
                </Container>
            )}

            {departingFlightSelected && (
                <Container>
                    <Row className="departure-selected">
                        <Col xs={12} lg={3}>
                            <center>
                                <b>Departure Flight Selected:</b>
                            </center>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="origin-airport">
                                {
                                    selectedDepartingFlight.route.originAirport
                                        .city
                                }{" "}
                                (
                                {
                                    selectedDepartingFlight.route.originAirport
                                        .iataId
                                }
                                )
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    selectedDepartingFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    selectedDepartingFlight.departureTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={1}>
                            <Row className="duration">
                                {departingFlightHours} hr{" "}
                                {departingFlightMinutes} min
                            </Row>
                            <Row className="duration-icon">
                                <FontAwesomeIcon icon={faPlane} />
                            </Row>
                        </Col>

                        <Col xs={12} lg={3}>
                            <Row className="dest-airport">
                                {
                                    selectedDepartingFlight.route
                                        .destinationAirport.city
                                }
                            </Row>
                            <Row className="arrival-time">
                                {moment(
                                    selectedDepartingFlight.arrivalTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="arrival-date">
                                {moment(
                                    selectedDepartingFlight.arrivalTime
                                ).format("MMMM Do, YYYY")}
                            </Row>

                            <br />
                        </Col>

                        <Col xs={12} lg={2}>
                            <Row className="arrival-date">
                                <p>
                                    <b>Boarding Group: </b> {"   "}{" "}
                                    {departingFlightCheckInGroup}{" "}
                                </p>
                                <p>
                                    <small>
                                        <b>Class:</b> {departingFlightSeatClass}{" "}
                                        ◦<b> Price:</b> ${departingFlightPrice}
                                    </small>
                                </p>
                            </Row>
                        </Col>

                        {departingFlightCheckInGroup !== 1 && (
                            <CheckInGroupUpgrade
                                checkInGroup={departingFlightCheckInGroup}
                                onCheckInGroupUpgrade={
                                    handleDepartingFlightGroupUpgrade
                                }
                            />
                        )}
                    </Row>
                    <br />
                </Container>
            )}

            {returningFlightSelected && (
                <Container>
                    <Row className="return-selected">
                        <Col xs={12} lg={3}>
                            <center>
                                <b>Return Flight Selected:</b>
                            </center>
                        </Col>
                        <Col xs={12} lg={3}>
                            <Row className="origin-airport">
                                {
                                    selectedReturningFlight.route.originAirport
                                        .city
                                }{" "}
                                (
                                {
                                    selectedReturningFlight.route.originAirport
                                        .iataId
                                }
                                )
                            </Row>
                            <Row className="departure-time">
                                {moment(
                                    selectedReturningFlight.departureTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="departure-date">
                                {moment(
                                    selectedReturningFlight.departureTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                        </Col>

                        <Col xs={12} lg={1}>
                            <Row className="duration">
                                {returningFlightHours} hr{" "}
                                {returningFlightMinutes} min
                            </Row>
                            <Row className="duration-icon">
                                <FontAwesomeIcon icon={faPlane} />
                            </Row>
                        </Col>

                        <Col xs={12} lg={3}>
                            <Row className="dest-airport">
                                {
                                    selectedReturningFlight.route
                                        .destinationAirport.city
                                }
                            </Row>
                            <Row className="arrival-time">
                                {moment(
                                    selectedReturningFlight.arrivalTime
                                ).format("h:mm a")}
                            </Row>
                            <Row className="arrival-date">
                                {moment(
                                    selectedReturningFlight.arrivalTime
                                ).format("MMMM Do, YYYY")}
                            </Row>
                            <br />
                        </Col>

                        <Col xs={12} lg={2}>
                            <Row className="dest-airport">
                                <p>
                                    <b>Boarding Group: </b>{" "}
                                    {returningFlightCheckInGroup}
                                </p>
                                <p>
                                    <small>
                                        <b>Class:</b> {returningFlightSeatClass}{" "}
                                        ◦<b> Price:</b> ${returningFlightPrice}
                                    </small>
                                </p>
                            </Row>
                        </Col>

                        {returningFlightCheckInGroup !== 1 && (
                            <CheckInGroupUpgrade
                                checkInGroup={returningFlightCheckInGroup}
                                onCheckInGroupUpgrade={
                                    handleReturningFlightGroupUpgrade
                                }
                            />
                        )}
                    </Row>
                </Container>
            )}
            <br />
            <br />
        </div>
    );

    return (
        <div className="search-results">
            <br />
            {props.isRoundTrip ? roundTripList : oneWayList}

            <Row className="book-rc">
                <Button className="rt-button" onClick={handleClearButtonClick}>
                    Clear flight selection
                </Button>
                <Button
                    className="rt-button"
                    onClick={handleContinueButtonClick}
                    disabled={!canContinue()}
                >
                    Continue
                </Button>
            </Row>
            <br />
            <br />
        </div>
    );
};

export default FlightList;
