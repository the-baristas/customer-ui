import React, { useState, useEffect } from "react";
import SeatClass from "./SeatClass";
import { getTakenSeats } from "../../api/PassengerApi";

import Card from "react-bootstrap/Card";
import { Col, Container, Row, Button, Image } from "react-bootstrap";
import { setSyntheticLeadingComments } from "typescript";


const SeatChoice = (props) => {

    const {flight} = props;
    const [seats, setSeats] = useState([]);

    useEffect(() => {
        setTakenSeats();
    }, []);

    const setTakenSeats = async () => {
        switch(props.seatClass) {
            case SeatClass.ECONOMY:
                let economySeats = Array.from(Array(flight.airplane.economyClassSeatsMax), (x, index) => (index + flight.airplane.businessClassSeatsMax + flight.airplane.firstClassSeatsMax) + 1);
                await getTakenSeats(flight.id)?.then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        economySeats.splice(economySeats.indexOf(result[i]), 1);
                    } 
                });
                    setSeats(economySeats);
                break;
            case SeatClass.BUSINESS:
                let businessSeats = Array.from(Array(flight.airplane.businessClassSeatsMax), (x, index) => (index + flight.airplane.firstClassSeatsMax) + 1);
                await getTakenSeats(flight.id)?.then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        businessSeats.splice(businessSeats.indexOf(result[i]), 1);
                    } 
                });
                    setSeats(businessSeats);
                break;
            case SeatClass.FIRST:
                let firstSeats = Array.from(Array(flight.airplane.firstClassSeatsMax), (x, index) => index + 1);
                await getTakenSeats(flight.id)?.then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        firstSeats.splice(firstSeats.indexOf(result[i]), 1);
                    } 
                });
                    setSeats(firstSeats);
                break;
            default:
                ///
                break;
        }
            };

    const seatSelect = seats.map((seat) => (
            <option value={seat}>{seat}</option>
    ));

    return (
        <Card className="upgrade-dep-bg">
                            <Card.Body>
                                <Card.Title>Choose Seat?</Card.Title>
                                    <small>
                                        { !props.hasSeatChoiceUpgrade && <>Your seat number is randomly assigned when you book your ticket. If you have a seating preference, you can make a selection below for an additional $25 fee.</>}
                                        { props.hasSeatChoiceUpgrade && <>Your seat choice has been made and the upgrade is reflected above. You may still change your seat below for no additional fee.</>}
                                    </small><br /><br />
                                    <center>
                                    <select style={{ "width": "300px", "height": "40px" }}>
                                    <option>Open this select menu</option>
                                    {seatSelect}
                                    </select><br />
                                    { !props.hasSeatChoiceUpgrade && <Button style={{ "width": "300px" }} variant="primary">Submit Seat Choice Add-On</Button> }
                                    <br />
                                    {/* <Button variant="link" onClick={() => handleDepRemoveSeatChoice()}>Remove Seat Choice Upgrade</Button><br /> */}
                                    </center>
            </Card.Body>
    </Card>
    )
}

export default SeatChoice;