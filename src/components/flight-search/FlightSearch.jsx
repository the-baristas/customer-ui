import { faCalendarDay } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col, Container } from "react-bootstrap";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./FlightSearch.css";
import moment from "moment";

const FlightSearch = (props) => {
    // States

    const [bookingType, setBookingType] = useState("One Way");
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(Date.now() + 6.048e8);

    // Callbacks

    const handleSubmit = (event) => {
        event.preventDefault();

        let roundTrip;
        switch (bookingType) {
            case "One Way":
                roundTrip = false;
                break;
            case "Round Trip":
                roundTrip = true;
                break;
            default:
                // TODO
                throw new Error();
        }
        props.onFlightSearchSubmit({
            roundTrip,
            origin,
            destination,
            startDate,
            endDate
        });
    };

    const handleBookingTypeChange = (event) => {
        setBookingType(event.target.value);
    };

    const handleOriginChange = (event) => {
        setOrigin(event.target.value);
    };

    const handleDestinationChange = (event) => {
        setDestination(event.target.value);
    };

    /**
     * @param {Date | [Date, Date]} date
     */
    const handleDateChange = (date) => {
        if (Array.isArray(date)) {
            setStartDate(date[0]);
            setEndDate(date[1]);
        } else {
            setStartDate(date);
        }
    };

    // Elements

    let datePicker;
    if (bookingType === "One Way") {
        datePicker = (
            <DatePicker
                className="date-picker"
                selected={startDate}
                onChange={handleDateChange}
                minDate={new Date()}
                shouldCloseOnSelect={false}
            />
        );
    } else {
        datePicker = (
            <DatePicker
                className="date-picker"
                selectsRange
                selected={startDate}
                value={
                    endDate === null
                        ? moment(startDate).format("MM/DD/YYYY")
                        : moment(startDate).format("MM/DD/YYYY") +
                          " - " +
                          moment(endDate).format("MM/DD/YYYY")
                }
                closeOnScroll={true}
                startDate={startDate}
                endDate={endDate}
                minDate={new Date()}
                shouldCloseOnSelect={false}
                onChange={handleDateChange}
            />
        );
    }

    return (
        <Container className="search-container">
            <Form className="search-form" onSubmit={handleSubmit}>
                <form id="booking-type" onChange={handleBookingTypeChange}>
                    <Row>
                        <Col lg={true}>
                            <label for="one-way" id="cbs">
                                One Way
                            </label>
                            <input
                                type="radio"
                                id="one-way"
                                name="booking-type"
                                value="One Way"
                                checked={bookingType === "One Way"}
                            />
                        </Col>
                        <Col lg={true}>
                            <label for="round-trip" id="cbs">
                                Round Trip
                            </label>
                            <input
                                type="radio"
                                id="round-trip"
                                name="booking-type"
                                value="Round Trip"
                                checked={bookingType === "Round Trip"}
                            />
                        </Col>
                    </Row>
                    <br />
                </form>

                <Row>
                    <Col lg={true}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text
                                    className="prepend-txt"
                                    id="from-prepend"
                                >
                                    FROM
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="City or Airport Code"
                                onChange={handleOriginChange}
                            />
                        </InputGroup>
                    </Col>

                    <Col lg={true}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text className="prepend-txt">
                                    TO
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            <Form.Control
                                placeholder="City or Airport Code"
                                onChange={handleDestinationChange}
                            />
                        </InputGroup>
                    </Col>
                </Row>

                <Row>
                    <Col lg={true}>
                        <InputGroup>
                            <InputGroup.Prepend>
                                <InputGroup.Text className="prepend-txt">
                                    <FontAwesomeIcon
                                        className="font-awesome"
                                        icon={faCalendarDay}
                                    />
                                </InputGroup.Text>
                            </InputGroup.Prepend>
                            {datePicker}
                        </InputGroup>
                    </Col>
                    <Col lg={true}>
                        <InputGroup>
                            <Button id="search-submit" type="submit">
                                Search Flights
                            </Button>
                        </InputGroup>
                    </Col>
                </Row>
            </Form>
        </Container>
    );
};

export default FlightSearch;
