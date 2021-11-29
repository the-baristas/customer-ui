import moment from 'moment';
import React from 'react';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import SeatClass from "../booking/SeatClass";
import './FlightCard.css';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as airportTimezone from 'airport-timezone'

const FlightCard = (props) => {
    const handleClick = (e, seatClass) => {
        props.onFlightSelection(props.flight, seatClass);
    };

    const originAirportTimezoneInfo = airportTimezone.default.filter((airport) => {return airport.code === props.flight.route.originAirport.iataId})[0];
    const destinationAirportTimezoneInfo = airportTimezone.default.filter((airport) => {return airport.code === props.flight.route.destinationAirport.iataId})[0];

    const departureTimeTimezone = moment(props.flight.departureTime)
                                    .utcOffset(originAirportTimezoneInfo.offset.gmt);
    const arrivalTimeTimezone = moment(props.flight.arrivalTime)
                                    .utcOffset(destinationAirportTimezoneInfo.offset.gmt);


    const duration = moment.duration(
        moment(props.flight.arrivalTime).diff(
            props.flight.departureTime
        )
    );
    const durationHours = Math.floor(duration.asHours());
    const durationMinutes = duration.minutes();

    return(
        <div className="flight-card-component" id={"fc" + props.flight.id}>


    <Row className="flight-card">
            <Col xs={12} lg={2}>
            <Row className="origin-airport">
            { props.flight.route.originAirport.city } ({ props.flight.route.originAirport.iataId })
            </Row>
            <Row className="departure-time">
            { departureTimeTimezone.format('h:mm a') }
            </Row>
            <Row className="departure-date">
            { departureTimeTimezone.format('MMMM Do, YYYY') }
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="duration">
            {durationHours} hr {durationMinutes} min 
            </Row>
            <Row className="duration-icon">
            <FontAwesomeIcon icon={faPlane} />
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="dest-airport">
            { props.flight.route.destinationAirport.city }
            </Row>
            <Row className="arrival-time">
            { arrivalTimeTimezone.format('h:mm a') }
            </Row>
            <Row className="arrival-date">
            { arrivalTimeTimezone.format('MMMM Do, YYYY') }
            </Row>
            </Col>


            <Col xs={12} lg={2}>
            <Row className="b-e">
            Economy
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.ECONOMY)}>${props.flight.economyPrice}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-b">
            Business
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.BUSINESS)}>${props.flight.businessPrice}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-f">
            First
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.FIRST)}>${props.flight.firstPrice}</Button>
            </Row>
            </Col>
           
</Row>
            

        </div>
    );
}

export default FlightCard;