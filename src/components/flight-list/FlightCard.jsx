import React from 'react';
import { Card } from 'react-bootstrap';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import './FlightCard.css';
import Pagination from 'react-bootstrap/Pagination';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const FlightCard = (props) => {
    const handleClick = (e, seatClass) => {
        props.onFlightSelection(props.flight, seatClass);
    };

    const duration = moment.duration(
        moment(props.flight.arrivalTime).diff(
            props.flight.departureTime
        )
    );
    const durationHours = Math.floor(duration.asHours());
    const durationMinutes = duration.minutes();

    return(
        <div className="flight-card-component">


<Row className="flight-card">
            <Col xs={12} lg={2}>
            <Row className="origin-airport">
            { props.flight.route.originAirport.city } ({ props.flight.route.originAirport.iataId })
            </Row>
            <Row className="departure-time">
            { moment(props.flight.departureTime).format('h:mm a') }
            </Row>
            <Row className="departure-date">
            { moment(props.flight.departureTime).format('MMMM Do, YYYY') }
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
            { moment(props.flight.arrivalTime).format('h:mm a') }
            </Row>
            <Row className="arrival-date">
            { moment(props.flight.arrivalTime).format('MMMM Do, YYYY') }
            </Row>
            </Col>


            <Col xs={12} lg={2}>
            <Row className="b-e">
            Economy
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, "economy")}>${props.flight.economyPrice}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-b">
            Business
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, "business")}>${props.flight.businessPrice}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-f">
            First
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, "first")}>${props.flight.firstPrice}</Button>
            </Row>
            </Col>
</Row>
            

        </div>
    );
}

export default FlightCard;