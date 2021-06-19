import React, { useEffect, useState } from 'react';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import Accordion from '@material-ui/core/Accordion';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import './BookingListItem.css';


const BookingListItem = (props) => {

    const booking = props.booking;
    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const passengers = booking.passengers.map((passenger) => (
        <p key={passenger.id} style={{color:'gray'}}>-{passenger.givenName} {passenger.familyName}
            &nbsp;({passenger.seatClass} class)</p>
    ));

    if(booking.flights.length === 0){
        return (<div></div>)
    }

    return ( 
        <Paper className='booking-list-item-component'>
            <div data-testid="headerFlight" style={{display:'inline-flex'}}>
            <h4>{booking.flights[0].originAirportCity} ({booking.flights[0].originAirportCode})</h4>
                    <h5>&nbsp; ⟶&nbsp; </h5> <h4>{booking.flights[0].destinationAirportCity} ({booking.flights[0].destinationAirportCode})</h4>  
            </div>
            <h5> Total Price: ${booking.totalPrice}</h5>
            
            <Grid data-testid="flightTimes" container spacing={3}>
                <Grid item xs={6}><h5>Depart:&nbsp;</h5><p>{booking.flights[0].departureTime.replace('T', ' ')}</p></Grid>
                <Grid item xs={6}><h5>Arrival:&nbsp;</h5><p>{booking.flights[0].arrivalTime.replace('T', ' ')}</p></Grid>
            </Grid>
            
            <Accordion expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
                <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1bh-content"
                id="panel1bh-header"
                >
                <Typography className='heading'>All Passengers</Typography>
                </AccordionSummary>
                <AccordionDetails>
                    <Typography data-testid="passengersList">
                        {passengers}
                    </Typography>
                </AccordionDetails>
            </Accordion>
        </Paper>
     );
}
 
export default BookingListItem;