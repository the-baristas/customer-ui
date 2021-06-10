import { useSelector, createStore } from 'react-redux';
import { Form, Row, Col, InputGroup, Button } from 'react-bootstrap';
import './FlightSearch.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import React, { useState, createContext } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useHistory } from 'react-router-dom';


const FlightSearch = (props) => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);

    return(
        <div className="search-container">
            <div className="flight-search">
                <Form onSubmit={props.handleSubmit} >

                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt" id="from-prepend">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleOriginChange} />
                    </InputGroup>
    
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleDestChange} />
                    </InputGroup>
                   
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt"><FontAwesomeIcon icon={faCalendarDay} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker className="date-picker" selected={props.date} onChange={props.onDateChange} />
                    </InputGroup>
                    
                    <Button id="search-submit" type="submit">
                    Search Flights
                    </Button>
                  
                </Form>
                </div>
            </div>
        );
}
 
export default FlightSearch;