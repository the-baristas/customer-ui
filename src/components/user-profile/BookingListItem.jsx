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
import Button from '@material-ui/core/Button';
import CancelBookingModal from './CancelBookingModal';


const BookingListItem = (props) => {

    const [booking, setBooking] = useState(props.booking);
    const [bookingActive, setBookingActive] = useState(props.booking.active)
    const [expanded, setExpanded] = useState(false);

    const [deleteModalOpen, setDeleteModalOpen] = useState(false);

    const handleOpenCancelModal = () => {
        setDeleteModalOpen(true);
    };

    const handleCloseCancelModal = () => {
        setDeleteModalOpen(false);
    }

    const handleCancelComplete = () => {
        handleCloseCancelModal();
        setBookingActive(false);
        console.log(bookingActive);
        alert("Your booking has been cancelled successfully.");
    }

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const passengers = booking.passengers.map((passenger) => (
        <div key={passenger.id} style={{color:'gray'}}>-{passenger.givenName} {passenger.familyName}
            &nbsp;({passenger.seatClass} class)</div>
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
            <Grid data-testid="flightTimes" container spacing={3}>
                <Grid item xs={6}><h5> Total Price: ${booking.totalPrice}</h5></Grid>
                <Grid item xs={6}>
                    {!bookingActive && <h3 style={{float: "right"}}>Cancelled</h3>}
                    {bookingActive && 
                        <Button className="cancel-button"
                        data-testid="cancelButton"
                        variant="contained"
                        onClick={handleOpenCancelModal}
                        color="secondary"
                        style={{ maxWidth: 20 }}>Cancel</Button>
                        }
                    <CancelBookingModal data-testid="deleteModal"
                                        handleClose={() => {handleCloseCancelModal()}}
                                        open={deleteModalOpen} 
                                        handleCancelComplete={() => {handleCancelComplete()}}
                                        booking={booking}></CancelBookingModal>
                </Grid>
            </Grid>

            
            <Grid data-testid="flightTimes" container spacing={3}>
                <Grid item xs={6}><h5>Departure:&nbsp;</h5>{booking.flights[0].departureTime.replace('T', ' ')}</Grid>
                <Grid item xs={6}><h5>Arrival:&nbsp;</h5>{booking.flights[0].arrivalTime.replace('T', ' ')}</Grid>
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
                    <div data-testid="passengersList">
                        {passengers}
                    </div>
                </AccordionDetails>
            </Accordion>
        </Paper>
     );
}
 
export default BookingListItem;