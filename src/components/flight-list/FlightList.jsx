import React, { useState } from 'react';
import { Form, Container, Row, Col } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FlightCard from './FlightCard';
import './FlightList.css';

const FlightList = (props) => {

    return (
            <div className="search-results">
                <br />
                <center><h4>Results from Search</h4></center>
                <div className="sort-by-container">
                <label id="filter-label" for="sort-by">Sort by: </label> <br />
                <select name="sort-by" id="sort-by" onChange={props.onSortBy}>
                <option value="economyPrice">Price</option>
                <option value="departureTime">Departure</option>
                <option value="arrivalTime">Arrival</option>
                </select>
                </div>
                <div className="filter-container">
                <Row>
                    <Col id="filter-col">
                <label id="filter-label" for="morning-filter">Morning Flights: </label> <br />
                <input type="checkbox" id="morning" name="morning" value="morning" disabled />
                    </Col>
                    <Col id="filter-col">
                <label id="filter-label" for="afternoon-filter">Afternoon Flights: </label> <br />
                <input type="checkbox" id="afternoon" name="afternoon" value="evening" disabled />
                    </Col>
                    <Col id="filter-col">
                <label id="filter-label" for="evening-filter">Evening Flights: </label> <br />
                <input type="checkbox" id="evening" name="evening" value="evening" disabled />
                    </Col>
                </Row>
                </div>
                { props.flights.map(flightObj => {
                    return <FlightCard key={flightObj.id} flight={flightObj} />
                    })}
            </div>
        );
}
 
export default FlightList;