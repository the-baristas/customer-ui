import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBookingsByUsername } from '../../api/BookingApi';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Pagination from '@material-ui/lab/Pagination';
import BookingListItem from './BookingListItem';
import './UserProfileBookingsList.css';
import { getRole } from '../../utils/Login';
import { ROLE_AGENT } from '../../utils/Roles';
import Grid from '@material-ui/core/Grid';
import { TextField } from '@material-ui/core';


const UserProfileBookingsList = () => {
    const userStatus = useSelector((state) => state.userStatus);

    const pageLength = 10;

    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] = useState(false);
    const [currentPage, setCurrentPage] = useState({});
    const [bookingList, setBookingList] = useState([]);

    const [searchField, setSearchField] = useState("");

    const [pendingFlightsOnly, setPendingFlightsOnly] = useState(true);

    const [page, setPage] = useState(1);

    const handlePageChange = (event, value) => {
      setPage(value);
      getBookings(pendingFlightsOnly, value-1,10);
    };

    const handleSwitchPendingOnly = (checked) => {
        setPendingFlightsOnly(checked);
        getBookings(checked, 0, pageLength);
    };

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const handleSetSearchField = (value) => {
        console.log("------------------------------------------------------------" + value)
        setSearchField(value);

        if(value.length === 0)
            getBookings(pendingFlightsOnly, 0, pageLength, value)
        else if(value.length < 3)
            return;
        else{
            getBookings(pendingFlightsOnly, 0, pageLength, value);
        }
            

    }

    const bookingComponents = bookingList.map((booking) => (
        <BookingListItem key={booking.id} booking={booking}></BookingListItem>
    ));

    useEffect(() => {
        getBookings(pendingFlightsOnly, 0, pageLength);
    }, [])

    const getBookings = async (pendingOnly, index, size, searchTerm="") => {
        setIsPending(true);
        return getBookingsByUsername(userStatus.username, pendingOnly, index, size, searchTerm)
            .then((data) => {
                setCurrentPage(data);
                setBookingList(data.content);
                setIsPending(false);
                setInfoRetrievalSuccessful(true);
            })
            .catch((error) => {
                setIsPending(false);
                setInfoRetrievalSuccessful(false);
            });
    }

    return ( <div>
        <h2 className="booking-list-title">
            <p>Your Bookings</p>
            <Grid className="booking-list-tooldbar" container spacing={3}>
                <Grid item xs={6}>
                    {getRole() === ROLE_AGENT && <TextField className="booking-list-search-field"
                                                            inputProps={{ "data-testid": "searchField" }}
                                                            label="Search Name"
                                                            variant="filled" onChange={(input) => {handleSetSearchField(input.target.value)}} /> }
                </Grid>
                <Grid item xs={6}>
                    <b style={{fontSize: 15}}>Pending Only<Switch color="primary" checked={pendingFlightsOnly} onChange={(event) => {handleSwitchPendingOnly(event.target.checked)}} /></b>
                </Grid>
            </Grid>     
        </h2>
        {isPending && <h3 data-testid='loading'>Loading...</h3>}

        {!isPending && infoRetrievalSuccessful && <div>
                {bookingComponents}
                <div className='pagination'>
                    <Typography data-testid='page'>Page: {page}</Typography>
                    <Pagination count={currentPage.totalPages} page={page} onChange={handlePageChange} />
                </div>
            </div>}
        {infoRetrievalSuccessful && bookingList.length===0 && <h4>You have not booked any flights.</h4>}
    </div> );
}
 
export default UserProfileBookingsList;