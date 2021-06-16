import React from 'react';
import { Card } from 'react-bootstrap';
import moment from 'moment';
import Button from 'react-bootstrap/Button';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import './FlightCard.css';
import Pagination from 'react-bootstrap/Pagination'

const FlightCard = (props) => {
    const handleClick = (e, seatClass) => {
        props.onFlightSelection(props.flight, seatClass);
    };

    return(
        <div className="flight-card-component">
            <Card className="flight-card">
            <p id="logo">UTOPIA</p>
            <Card.Body>
            <Card.Title>{ props.flight.route.originAirport.city } ({ props.flight.route.originAirport.iataId }) - { props.flight.route.destinationAirport.city } ({ props.flight.route.destinationAirport.iataId }) 
            </Card.Title>
            <Card.Subtitle className="mb-2 text-muted">Departing: { moment(props.flight.departureTime).format('MMMM Do, YYYY @ h:mm a') }</Card.Subtitle>
            <br />
            <ListGroup id="price-list" horizontal={'lg'}>
            <ListGroupItem><b>Economy</b><br /> ${ props.flight.economyPrice } <br /><Button className="book-button" onClick={(e) => handleClick(e, "economy")}>Book Flight</Button></ListGroupItem>
            <ListGroupItem><b>Business</b><br /> ${ props.flight.businessPrice } <br /><Button className="book-button" onClick={(e) => handleClick(e, "business")}>Book Flight</Button></ListGroupItem>
            <ListGroupItem><b>First</b><br /> ${ props.flight.firstPrice } <br /><Button className="book-button" onClick={(e) => handleClick(e, "first")}>Book Flight</Button></ListGroupItem>
            </ListGroup>
            </Card.Body>
            </Card>

        </div>
    );
}

export default FlightCard;