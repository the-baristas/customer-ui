import { faCalendarDay } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useState } from "react";
import { Button, Form, InputGroup } from 'react-bootstrap';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useSelector } from 'react-redux';
import { useHistory, useRouteMatch } from 'react-router-dom';
import './FlightSearch.css';

const FlightSearch = (props) => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);

    const [date, setDate] = useState(new Date());
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [results, setResults] = useState([]);

    const history = useHistory();
    const { path } = useRouteMatch();

    function onDateChange(date) {
        setDate(date);
    }

    function handleOriginChange(event) {
        setOrigin(event.target.value);
    }

    function handleDestChange(event) {
        setDest(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (origin === '' || dest === '' || date === '') {
            alert ('Please make sure all search fields are completed.');
        } else {
            
            let theMonth = date.getMonth() + 1;
            let theDate = date.getDate();
            let theYear = date.getFullYear();
            
            const url = `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=economyPrice`;
            fetch(url, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem('utopiaCustomerKey') },
                body: JSON.stringify({month: theMonth, date: theDate, year: theYear})
            })
            .then(resp => resp.json())
            .then(data => {
                props.onFlightSearch(data.content);
                history.push(`${path}/search-results`);
            })
            .catch(error => {
                console.log(error);
            })
        }
    }

    return(
        <div className="search-container">
            <div className="flight-search">
                <Form onSubmit={handleSubmit} >

                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">FROM</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={handleOriginChange} />
                    </InputGroup>
    
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt">TO</InputGroup.Text>
                    </InputGroup.Prepend>
                    <Form.Control placeholder="City or Airport Code" onChange={handleDestChange} />
                    </InputGroup>
                   
                    <InputGroup className="mb-2">
                    <InputGroup.Prepend>
                    <InputGroup.Text className="prepend-txt"><FontAwesomeIcon icon={faCalendarDay} /></InputGroup.Text>
                    </InputGroup.Prepend>
                    <DatePicker className="date-picker" selected={date} onChange={onDateChange} />
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
