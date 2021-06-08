import React, { useState } from 'react';
import { Form, Container } from 'react-bootstrap';
import { useHistory } from 'react-router-dom';
import FlightCard from './FlightCard';
import './FlightList.css';

const FlightList = (props) => {

    return (
            <div className="search-results">
                <h2>Results from Search</h2><br />
                { props.flights.map(flightObj => {
                    return <FlightCard flight={flightObj} />
                    })}
            </div>
        );
}
 
export default FlightList;