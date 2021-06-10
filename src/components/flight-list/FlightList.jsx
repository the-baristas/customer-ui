import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FlightCard from './FlightCard';
import './FlightList.css';

const FlightList = (props) => {

    console.log(props.onSortBy);

    return (
            <div className="search-results">
                <br />
                <center><h4>Results from Search</h4></center>
                <label for="sort-by">Sort by: </label> 
                <select name="sort-by" id="sort-by" onChange={props.onSortBy}>
                <option value="economyPrice">Price</option>
                <option value="departureTime">Departure</option>
                <option value="arrivalTime">Arrival</option>
                </select>
                { props.flights.map(flightObj => {
                    return <FlightCard key={flightObj.id} flight={flightObj} />
                    })}
            </div>
        );
}
 
export default FlightList;