import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import { Card } from 'react-bootstrap';
import moment from 'moment';
import Button from 'react-bootstrap/Button';

const FlightCard = (props) => {

return(
    <div>
        <Card style={{ width: '30%', margin: '20px' }}>
        <Card.Img variant="left" src="https://www.gannett-cdn.com/presto/2019/06/23/USAT/c3a9f051-bd6c-4b39-b5b9-38244deec783-GettyImages-932651818.jpg?auto=webp&crop=667,375,x0,y80&format=pjpg&width=1200" />
        <Card.Body>
        <Card.Title>{ props.flight.route.originAirport.city } ({ props.flight.route.originAirport.iataId }) - { props.flight.route.destinationAirport.city } ({ props.flight.route.destinationAirport.iataId }) 
        </Card.Title>
        <Card.Text> <b>Trip Time:</b> { moment(props.flight.deperatureTime).format('h:mm a') } - { moment(props.flight.arrivalTime).format('h:mm a') }
        <br />
        <b>Economy Class:</b> ${ props.flight.economyPrice }<br />
        <b>Business Class:</b> ${ props.flight.businessPrice }<br />
        <b>First Class:</b> ${ props.flight.firstPrice }
        </Card.Text>
        <Button variant="primary">Book Flight</Button>
        </Card.Body>
        </Card>
    </div>
);
}

export default FlightCard;