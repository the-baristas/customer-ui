import React, { useState } from "react";
import "./FlightList.css";
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';

const FlightList = (props) => {

    // helper function
    function handleClick(event, newPage) {
        props.handlePageChange(newPage);
    }


    // state
    const [currentPage, setCurrentPage] = useState(props.flightPage.number);


    let active = props.flightPage.number;

    let items = [];

        for (let number = 0; number <= props.flightPage.totalPages; number++) {
        items.push(
            <Pagination.Item
                        onClick={(e) => handleClick(e, number)}
                        key={number} 
                        active={number === active}>
            {number + 1}
            </Pagination.Item>,
        );
        }

    let prevPage = items[currentPage].key - 1;
    let nextPage = items[currentPage].key + 1;

    return (
            <div className="search-results">
                <br />
                <center><h4>Results from Search</h4></center>
                <label htmlFor="sort-by">Sort by: </label> 


                <select name="sort-by" id="sort-by" onChange={props.onSortBy}>
                <option value="economyPrice">Price</option>
                <option value="departureTime">Departure</option>
                <option value="arrivalTime">Arrival</option>
                </select>


                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                <Pagination.Ellipsis />
                {items[props.flightPage.totalPages - 3]}
                {items[props.flightPage.totalPages - 2]}
                {items[props.flightPage.totalPages -1 ]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>



                {props.flightCards}
                <br />

                <Container className="pagination-container">
                <Pagination>
                <Pagination.First />
                <Pagination.Prev onClick={(e) => setCurrentPage(currentPage - 1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                <Pagination.Ellipsis />
                {items[props.flightPage.totalPages - 3]}
                {items[props.flightPage.totalPages - 2]}
                {items[props.flightPage.totalPages -1 ]}
                <Pagination.Next onClick={(e) => setCurrentPage(currentPage + 1)} />
                <Pagination.Last />
                </Pagination>
                </Container>

            </div>
        );
}
 
export default FlightList;