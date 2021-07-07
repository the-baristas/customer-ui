import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { Button, Form, InputGroup, Row, Col, Container } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './FlightSearch.css';
import moment from 'moment';

const FlightSearch = (props) => {

    const [bookingType, setBookingType] = useState("One Way");

    const handleBookingType = (event) => {
        setBookingType(event.target.value);
    }

    return(
            <Container className="search-container">
                {bookingType === "One Way" &&
                <Form className="search-form" onSubmit={props.handleSubmit} >

                <form id="booking-type" onChange={handleBookingType}>
                <Row>
                <Col lg={true}>
                <label for="one-way" id="cbs">One Way</label><input type="radio" id="one-way" name="booking-type" value="One Way" checked={bookingType === 'One Way'} />
                </Col>
                <Col lg={true}>
                <label for="round-trip" id="cbs">Round Trip</label><input type="radio" id="round-trip" name="booking-type" value="Round Trip" checked={bookingType === 'Round Trip'} />
                </Col>
                </Row><br />
                </form>

                    <Row>
                        <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt" id="from-prepend">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleOriginChange} />
                    </InputGroup>
                    </Col>
                    
                    <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleDestChange} />
                    </InputGroup>
                    </Col>
                    </Row>

                    <Row>
                    <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt"><FontAwesomeIcon className="font-awesome" icon={faCalendarDay} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker className="date-picker" 
                                selected={props.date} 
                                onChange={props.onDateChange} 
                                minDate={new Date()} 
                                shouldCloseOnSelect={false} />
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
                </Form> }


                {bookingType === "Round Trip" &&
                
                <Form className="search-form" onSubmit={props.handleRTSubmit} >
                <form id="booking-type" onChange={handleBookingType}>
                <Row>
                <Col lg={true}>
                <label for="one-way" id="cbs">One Way</label><input type="radio" id="one-way" name="booking-type" value="One Way" checked={bookingType === 'One Way'} />
                </Col>
                <Col lg={true}>
                <label for="round-trip" id="cbs">Round Trip</label><input type="radio" id="round-trip" name="booking-type" value="Round Trip" checked={bookingType === 'Round Trip'} />
                </Col>
                </Row><br />
                </form>

                    <Row>
                        <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt" id="from-prepend">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleOriginChange} />
                    </InputGroup>
                    </Col>
                    
                    <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleDestChange} />
                    </InputGroup>
                    </Col>
                    </Row>

                    <Row>
                    <Col lg={true}>
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt"><FontAwesomeIcon className="font-awesome" icon={faCalendarDay} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker className="date-picker" 
                                selectsRange
                                selected={props.startDate}
                                value={props.endDate===null ? moment(props.startDate).format('MM/DD/YYYY') : moment(props.startDate).format('MM/DD/YYYY') + ' - ' + moment(props.endDate).format('MM/DD/YYYY') }
                                closeOnScroll={true}
                                startDate={props.startDate} 
                                endDate={props.endDate} 
                                minDate={new Date()}
                                shouldCloseOnSelect={false}
                                onChange={(update) => { props.setDateRange(update) }} 
                                />
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
                
                
                
                }
                </Container>

    );
};

export default FlightSearch;
