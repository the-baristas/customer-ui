import React, { useState } from "react";
import "./FlightList.css";
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';

const FlightList = (props) => {

    // helper function
    function handleClick(event, newPage) {
        setCurrentPage(newPage-1);
        props.handlePageChange(newPage-1);
    }


    // state
    const [currentPage, setCurrentPage] = useState(props.flightPage.number);


    let active = props.flightPage.number;

    let items = [];

    return (
            <div className="search-results">
                <br />

                <Container>
                <center><h4>Results from Search</h4></center>
                <label htmlFor="sort-by"><b>Sort by:</b></label> 
                {'  '}

                <select name="sort-by" id="sort-by" onChange={props.onSortBy}>
                <option value="economyPrice">Price</option>
                <option value="departureTime">Departure</option>
                <option value="arrivalTime">Arrival</option>
                </select>
                </Container>

                <Container>
                <label htmlFor="filter"><b>Filter:</b></label> 
                {'  '}

                <select name="filter" id="filter" onChange={props.handleFilterChange}>
                <option value="all">All</option>
                <option value="morning">Morning Flights Only</option>
                <option value="afternoon">Afternoon Flights Only</option>
                <option value="evening">Evening Flights Only</option>
                </select>
                </Container>

                <div className='pagination'>
                    <Typography data-testid='page'>Page: {currentPage + 1}</Typography>
                    <Pagination count={props.flightPage.totalPages} page={currentPage + 1} onChange={handleClick} />
                </div>

                {props.flightCards}
                <br />

                <div className='pagination'>
                    <Typography data-testid='page'>Page: {currentPage + 1}</Typography>
                    <Pagination count={props.flightPage.totalPages} page={currentPage + 1} onChange={handleClick} />
                </div>

            </div>
        );
}
 
export default FlightList;