import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from "react";
import { Button, Form, InputGroup, Row, Container } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './FlightSearch.css';

const FlightSearch = (props) => {

    return(
            <Container className="search-container">
                <Form className="search-form" onSubmit={props.handleSubmit} >

                    <Row>
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt" id="from-prepend">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleOriginChange} />
                    </InputGroup>
                    </Row>

                    <Row>
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={props.handleDestChange} />
                    </InputGroup>
                    </Row>

                    <Row className="mb-2">
                    <InputGroup>
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt"><FontAwesomeIcon className="font-awesome" icon={faCalendarDay} /></InputGroup.Text>
                    </InputGroup.Prepend><DatePicker className="date-picker" selected={props.date} onChange={props.onDateChange} />
                    </InputGroup>
                    </Row>

                    <Row>
                    <Button id="search-submit" type="submit">
                    Search Flights
                    </Button>
                    
                  </Row>
                </Form>
                </Container>
    );
};

export default FlightSearch;
