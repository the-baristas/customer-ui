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
                { props.flights.map(flightObj => {
                    return <FlightCard flight={flightObj} />
                    })}
            </div>
        );
}
 
export default FlightList;