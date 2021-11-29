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
import Datetime from 'react-datetime';
import "react-datetime/css/react-datetime.css";

const FlightList = (props) => {

    const [value, onChange] = useState(new Date());

    const [filter, setFilter] = useState("");

    const [timeRangeLowerBound, setTimeRangeLowerBound] = useState(props.selectedDate)
    const [timeRangeUpperBound, setTimeRangeUpperBound] = useState(props.selectedDate)

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

    function handleFilterChange(e){
        setFilter(e.target.value);

        //When searching with a time range, then the search will happen once the fields are filled and the Search button is clicked
        if(e.target.value === "departureRange"){
            return;
        }
        props.handleFilterChange(e);
    }

    function handleSearchTimeRangeClick(e){
        console.log("search")
        props.handleTimeRangeSearch(timeRangeLowerBound, timeRangeUpperBound);
    }

    const depDuration = moment.duration(
        moment(props.selectedDepTrip[props.selectedDepTrip?.length - 1]?.arrivalTime).diff(
            props.selectedDepTrip[0]?.departureTime
        )
    );
    const depDurationHours = Math.floor(depDuration.asHours());
    const depDurationMinutes = depDuration.minutes();

    const retDuration = moment.duration(
        moment(props.selectedRetTrip[props.selectedRetTrip?.length - 1]?.arrivalTime).diff(
            props.selectedRetTrip[0]?.departureTime
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
                            onChange={handleFilterChange}
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
                            <option value="departureRange">Custom Range</option>
                        </select>

                        {filter === "departureRange" &&
                        <div className="datetime-picker">
                            <Datetime value={timeRangeLowerBound} onChange={setTimeRangeLowerBound}></Datetime>
                            <h5>to</h5>
                            <Datetime value={timeRangeUpperBound} onChange={setTimeRangeUpperBound}></Datetime>
                            <Button onClick={handleSearchTimeRangeClick}>Search</Button>
                        </div>}  
                    </Container>

                    <div className="pagination">
                        <Pagination
                            count={props.flightPage.totalPages}
                            page={currentPage + 1}
                            onChange={handleClick}
                        />
                    </div>

                    {props.tripCards}
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
                            data-testid="search-1"
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

                    <div id="depFlightCards">{props.departureTripCards}</div>
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

                    <div id="retFlightCards">{props.returnTripCards}</div>
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
                                        <b>Departure Trip Selected:</b>
                                    </center>
                                </Col>
                                <Col xs={12} lg={3}>
                                    <Row className="origin-airport">
                                        {
                                            props.selectedDepTrip[0].route
                                                .originAirport.city
                                        }{" "}
                                        (
                                        {
                                            props.selectedDepTrip[0].route
                                                .originAirport.iataId
                                        }
                                        )
                                    </Row>
                                    <Row className="departure-time">
                                        {moment(
                                            props.selectedDepTrip[0].departureTime
                                        ).format("h:mm a")}
                                    </Row>
                                    <Row className="departure-date">
                                        {moment(
                                            props.selectedDepTrip[0].departureTime
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
                                            props.selectedDepTrip[props.selectedDepTrip.length-1].route
                                                .destinationAirport.city
                                        }
                                    </Row>
                                    <Row className="arrival-time">
                                        {moment(
                                            props.selectedDepTrip[props.selectedDepTrip.length-1].arrivalTime
                                        ).format("h:mm a")}
                                    </Row>
                                    <Row className="arrival-date">
                                        {moment(
                                            props.selectedDepTrip[props.selectedDepTrip.length-1].arrivalTime
                                        ).format("MMMM Do, YYYY")}
                                    </Row>

                                    <br />
                                </Col>

                                <Col xs={12} lg={2}>
                                    <Row className="arrival-date">
                                        <p>
                                            <b>Boarding Group: </b> {"   "}{" "}
                                            {props.depCheckInGroup}{" "}
                                        <br />
                                            <small>
                                                <b>Class:</b>{" "}
                                                {props.departureClass.toUpperCase()} ◦
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
                                            props.selectedRetTrip[0].route
                                                .originAirport.city
                                        }{" "}
                                        (
                                        {
                                            props.selectedRetTrip[0].route
                                                .originAirport.iataId
                                        }
                                        )
                                    </Row>
                                    <Row className="departure-time">
                                        {moment(
                                            props.selectedRetTrip[0].departureTime
                                        ).format("h:mm a")}
                                    </Row>
                                    <Row className="departure-date">
                                        {moment(
                                            props.selectedRetTrip[0].departureTime
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
                                            props.selectedRetTrip[props.selectedRetTrip.length-1].route
                                                .destinationAirport.city
                                        }
                                    </Row>
                                    <Row className="arrival-time">
                                        {moment(
                                            props.selectedRetTrip[props.selectedRetTrip.length-1].arrivalTime
                                        ).format("h:mm a")}
                                    </Row>
                                    <Row className="arrival-date">
                                        {moment(
                                            props.selectedRetTrip[props.selectedRetTrip.length-1].arrivalTime
                                        ).format("MMMM Do, YYYY")}
                                    </Row>
                                    <br />
                                </Col>

                                <Col xs={12} lg={2}>
                                    <Row className="dest-airport">
                                        <p>
                                            <b>Boarding Group: </b>{" "}
                                            {props.retCheckInGroup}
                                            <br />
                                            <small>
                                                <b>Class:</b>{" "}
                                                {props.returnClass.toUpperCase()} ◦
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
