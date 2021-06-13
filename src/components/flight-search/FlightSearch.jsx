import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button, Form, InputGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './FlightSearch.css';

const FlightSearch = (props) => {

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
};

export default FlightSearch;
