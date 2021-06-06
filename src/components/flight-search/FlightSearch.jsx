import { useSelector } from 'react-redux';
import { Form, Row, Col, InputGroup } from 'react-bootstrap';
import './FlightSearch.css';

import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const FlightSearch = () => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);
    const [date, setDate] = useState(new Date());

    function onChange(date) {
        setDate(date);
      }

    return(
        <div className="search-container">
            <div className="flight-search">
                <Form>
                <Row>
                    <Col>
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="Airport or City" />
                    </InputGroup>
                    </Col>
                    <Col>
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="Airport or City" />
                    </InputGroup>
                    </Col>
                    <Col>
                    <DatePicker className="date-picker" selected={date} onChange={onChange} />
                    </Col>
                </Row>
                </Form>
                </div>
            </div>
        );
}
 
export default FlightSearch;