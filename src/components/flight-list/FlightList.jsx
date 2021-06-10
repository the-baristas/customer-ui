import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FlightCard from './FlightCard';
import './FlightList.css';

const FlightList = (props) => {

    return (
            <div className="search-results">
                <br />
                <center><h4>Results from Search</h4></center>
                <label for="sort-by">Sort by: </label> 
                <select name="sort-by" id="sort-by">
                <option value="Price">Price</option>
                <option value="Duration">Duration</option>
                <option value="Departure">Departure</option>
                <option value="Arrival">Arrival</option>
                </select>
                { props.flights.map(flightObj => {
                    return <FlightCard key={flightObj.id} flight={flightObj} />
                    })}
            </div>
        );
}
 
export default FlightList;