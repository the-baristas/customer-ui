import React, { useState } from "react";
import "./FlightList.css";
import Pagination from 'react-bootstrap/Pagination';
import Container from 'react-bootstrap/Container';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';

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

                { /* pagination */}
                {props.flightPage.totalPages > 5 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                <Pagination.Ellipsis />
                {items[props.flightPage.totalPages - 2]}
                {items[props.flightPage.totalPages -1 ]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }

                {props.flightPage.totalPages === 5 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                {items[currentPage + 3]}
                {items[currentPage + 4]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }       

                {props.flightPage.totalPages === 4 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                {items[currentPage + 3]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }  

                {props.flightPage.totalPages === 3 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 

                {props.flightPage.totalPages === 2 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 

                {props.flightPage.totalPages === 1 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 

                { /* flights */}
                {props.flightCards}
                <br />

                {props.flightPage.totalPages > 5 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                <Pagination.Ellipsis />
                {items[props.flightPage.totalPages - 2]}
                {items[props.flightPage.totalPages -1 ]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }

                {props.flightPage.totalPages === 5 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                {items[currentPage + 3]}
                {items[currentPage + 4]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }       

                {props.flightPage.totalPages === 4 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                {items[currentPage + 3]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                }  

                {props.flightPage.totalPages === 3 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                {items[currentPage + 2]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 

                {props.flightPage.totalPages === 2 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                {items[currentPage + 1]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 

                {props.flightPage.totalPages === 1 &&
                <Container className="pagination-container">
                <Pagination>
                <Pagination.First onClick={(e) => handleClick(e, 0)} />
                <Pagination.Prev onClick={(e) => handleClick(e, active-1)} />
                {items[currentPage]}
                <Pagination.Next onClick={(e) => handleClick(e, active+1)} />
                <Pagination.Last onClick={(e) => handleClick(e, props.flightPage.totalPages-1)} />
                </Pagination>
                </Container>
                } 


            </div>
        );
}
 
export default FlightList;