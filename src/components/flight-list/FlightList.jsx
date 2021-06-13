import React from "react";
import "./FlightList.css";

const FlightList = (props) => {

    console.log(props.onSortBy);

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
                {props.flightCards}
            </div>
        );
}
 
export default FlightList;
