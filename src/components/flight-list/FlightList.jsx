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
import "./FlightList.css";

const FlightList = (props) => {
    // helper function
    function handleClick(event, newPage) {
        setCurrentPage(newPage - 1);
        props.handlePageChange(newPage - 1);
    }

    function handleReturnClick(event, newPage) {
        setCurrentReturnsPage(newPage - 1);
        props.handlePageChangeReturns(newPage - 1);
    }

    function handleDepartureClick(event, newPage) {
        setCurrentDeparturesPage(newPage - 1);
        props.handlePageChangeDepartures(newPage - 1);
    }

    function handleRTFlightSelection(e) {
        props.onRTFlightSelection(e);
    }

    const depDuration = moment.duration(
        moment(props.departureFlight.arrivalTime).diff(
            props.departureFlight.departureTime
        )
    );
    const depDurationHours = Math.floor(depDuration.asHours());
    const depDurationMinutes = depDuration.minutes();

    const retDuration = moment.duration(
        moment(props.returnFlight.arrivalTime).diff(
            props.returnFlight.departureTime
        )
    );
    const retDurationHours = Math.floor(retDuration.asHours());
    const retDurationMinutes = retDuration.minutes();

    const handleRetUpgrade = (amount, group) => {
        props.setRetUpgradesPricePP(amount);
        props.setRetCheckInGroup(group);
    };

    const handleDesUpgrade = (amount, group) => {
        props.setDesUpgradesPricePP(amount);
        props.setDepCheckInGroup(group);
    };

    // state
    const [currentPage, setCurrentPage] = useState(props.flightPage.number);
    const [currentReturnsPage, setCurrentReturnsPage] = useState(
        props.departureFlightPage.number
    );
    const [currentDeparturesPage, setCurrentDeparturesPage] = useState(
        props.returnFlightPage.number
    );

    return (
        <div className="search-results">
            <br />

            {props.isRoundTrip === false ? (
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
                            onChange={props.onSortBy}
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
                            onChange={props.handleFilterChange}
                        >
                            <option value="all">All</option>
                            <option value="morning">
                                Morning Flights Only
                            </option>
                            <option value="afternoon">
                                Afternoon Flights Only
                            </option>
                            <option value="evening">
                                Evening Flights Only
                            </option>
                        </select>
                    </Container>

                    <div className="pagination">
                        <Pagination
                            count={props.flightPage.totalPages}
                            page={currentPage + 1}
                            onChange={handleClick}
                        />
                    </div>

                    {props.flightCards}
                    <br />

                    <div className="pagination">
                        <Pagination
                            count={props.flightPage.totalPages}
                            page={currentPage + 1}
                            onChange={handleClick}
                        />
                    </div>
                </div>
            ) : (
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
                            onChange={props.onDeparturesSortBy}
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
                            onChange={props.handleFilterChangeDepartures}
                        >
                            <option value="all">All</option>
                            <option value="morning">
                                Morning Flights Only
                            </option>
                            <option value="afternoon">
                                Afternoon Flights Only
                            </option>
                            <option value="evening">
                                Evening Flights Only
                            </option>
                        </select>
                    </Container>

                    {props.departureFlightPage.totalPages > 1 && (
                        <div className="pagination">
                            <Pagination
                                count={props.departureFlightPage.totalPages}
                                page={currentPage + 1}
                                onChange={handleDepartureClick}
                            />
                        </div>
                    )}

                    <div id="depFlightCards">{props.departureFlightCards}</div>
                    <br />

                    {props.departureFlightPage.totalPages > 1 && (
                        <div className="pagination">
                            <Pagination
                                count={props.departureFlightPage.totalPages}
                                page={currentPage + 1}
                                onChange={handleDepartureClick}
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
                            onChange={props.onReturnsSortBy}
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
                            onChange={props.handleFilterChangeReturns}
                        >
                            <option value="all">All</option>
                            <option value="morning">
                                Morning Flights Only
                            </option>
                            <option value="afternoon">
                                Afternoon Flights Only
                            </option>
                            <option value="evening">
                                Evening Flights Only
                            </option>
                        </select>
                    </Container>

                    {props.returnFlightPage.totalPages > 1 && (
                        <div className="pagination">
                            <Pagination
                                count={props.returnFlightPage.totalPages}
                                page={currentReturnsPage + 1}
                                onChange={handleReturnClick}
                            />
                        </div>
                    )}

                    <div id="retFlightCards">{props.returnFlightCards}</div>
                    <br />

                    {props.returnFlightPage.totalPages > 1 && (
                        <div className="pagination">
                            <Pagination
                                count={props.returnFlightPage.totalPages}
                                page={currentReturnsPage + 1}
                                onChange={handleReturnClick}
                            />
                        </div>
                    )}

                    {/** selected flights here */}

                    {(props.returnSelectionMade ||
                        props.departureSelectionMade) && (
                        <Container>
                            <Row className="itinerary-title">Itinerary:</Row>
                        </Container>
                    )}

                    {props.departureSelectionMade && (
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
                                            props.departureFlight.route
                                                .originAirport.city
                                        }{" "}
                                        (
                                        {
                                            props.departureFlight.route
                                                .originAirport.iataId
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
                                        {depDurationHours} hr{" "}
                                        {depDurationMinutes} min
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

                                    <br />
                                </Col>

                                <Col xs={12} lg={2}>
                                    <Row className="arrival-date">
                                        <p>
                                            <b>Boarding Group: </b> {"   "}{" "}
                                            {props.depCheckInGroup}{" "}
                                        </p>
                                        <p>
                                            <small>
                                                <b>Class:</b>{" "}
                                                {props.departureClass} ◦
                                                <b> Price:</b> $
                                                {props.departurePricePP}
                                            </small>
                                        </p>
                                    </Row>
                                </Col>

                                {props.depCheckInGroup !== 1 && (
                                    <Card className="upgrade-dep-bg">
                                        <Card.Body>
                                            <Card.Title>
                                                Upgrade Boarding Group?
                                            </Card.Title>
                                            <p>
                                                <small>
                                                    Your boarding group is based
                                                    on your seat class. Priority
                                                    boarding is given to Group
                                                    1, which is followed by
                                                    Group 2, and then Group 3.
                                                    By upgrading your group, you
                                                    can be amongst the first to
                                                    stow your carry-on baggage
                                                    and board the flight.
                                                </small>
                                            </p>
                                            <Card.Link
                                                className="point"
                                                onClick={() =>
                                                    handleDesUpgrade(15, 1)
                                                }
                                            >
                                                Upgrade To Group 1
                                            </Card.Link>
                                            {props.depCheckInGroup !== 2 && (
                                                <Card.Link
                                                    className="point"
                                                    onClick={() =>
                                                        handleDesUpgrade(12, 2)
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

                    {props.returnSelectionMade && (
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
                                            props.returnFlight.route
                                                .originAirport.city
                                        }{" "}
                                        (
                                        {
                                            props.returnFlight.route
                                                .originAirport.iataId
                                        }
                                        )
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
                                        {retDurationHours} hr{" "}
                                        {retDurationMinutes} min
                                    </Row>
                                    <Row className="duration-icon">
                                        <FontAwesomeIcon icon={faPlane} />
                                    </Row>
                                </Col>

                                <Col xs={12} lg={3}>
                                    <Row className="dest-airport">
                                        {
                                            props.returnFlight.route
                                                .destinationAirport.city
                                        }
                                    </Row>
                                    <Row className="arrival-time">
                                        {moment(
                                            props.returnFlight.arrivalTime
                                        ).format("h:mm a")}
                                    </Row>
                                    <Row className="arrival-date">
                                        {moment(
                                            props.returnFlight.arrivalTime
                                        ).format("MMMM Do, YYYY")}
                                    </Row>
                                    <br />
                                </Col>

                                <Col xs={12} lg={2}>
                                    <Row className="dest-airport">
                                        <p>
                                            <b>Boarding Group: </b>{" "}
                                            {props.retCheckInGroup}
                                        </p>
                                        <p>
                                            <small>
                                                <b>Class:</b>{" "}
                                                {props.returnClass} ◦
                                                <b> Price:</b> $
                                                {props.returnPricePP}
                                            </small>
                                        </p>
                                    </Row>
                                </Col>

                                {props.retCheckInGroup !== 1 && (
                                    <Card className="upgrade-dep-bg">
                                        <Card.Body>
                                            <Card.Title>
                                                Upgrade Boarding Group?
                                            </Card.Title>
                                            <p>
                                                <small>
                                                    Your boarding group is based
                                                    on your seat class. Priority
                                                    boarding is given to Group
                                                    1, which is followed by
                                                    Group 2, and then Group 3.
                                                    By upgrading your group, you
                                                    can be amongst the first to
                                                    stow your carry-on baggage
                                                    and board the flight.
                                                </small>
                                            </p>
                                            <Card.Link
                                                className="point"
                                                onClick={() =>
                                                    handleRetUpgrade(15, 1)
                                                }
                                            >
                                                Upgrade To Group 1
                                            </Card.Link>
                                            {props.retCheckInGroup !== 2 && (
                                                <Card.Link
                                                    className="point"
                                                    onClick={() =>
                                                        handleRetUpgrade(12, 2)
                                                    }
                                                >
                                                    Upgrade To Group 2
                                                </Card.Link>
                                            )}
                                        </Card.Body>
                                    </Card>
                                )}
                            </Row>
                        </Container>
                    )}
                    <br />
                    <br />

                    <Row className="book-rc">
                        <Button className="rt-button" href="/">
                            Go Back
                        </Button>
                        <Button
                            className="rt-button"
                            onClick={(e) => handleRTFlightSelection(e)}
                            disabled={
                                !props.returnSelectionMade ||
                                !props.departureSelectionMade
                            }
                        >
                            Book Round Trip
                        </Button>
                    </Row>
                    <br />
                    <br />
                </div>
            )}
        </div>
    );
};

export default FlightList;
