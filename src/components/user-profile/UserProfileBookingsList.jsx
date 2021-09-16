import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBookingsByUsername } from '../../api/BookingApi';
import Typography from '@material-ui/core/Typography';
import Switch from '@material-ui/core/Switch';
import Pagination from '@material-ui/lab/Pagination';
import BookingListItem from './BookingListItem';
import './UserProfileBookingsList.css';

const UserProfileBookingsList = () => {
    const userStatus = useSelector((state) => state.userStatus);

    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] = useState(false);
    const [currentPage, setCurrentPage] = useState({});
    const [bookingList, setBookingList] = useState([]);

    const [pendingFlightsOnly, setPendingFlightsOnly] = useState(true);

    const [page, setPage] = useState(1);

    const handlePageChange = (event, value) => {
      setPage(value);
      getBookings(pendingFlightsOnly, value-1,10);
    };

    const handleSwitchPendingOnly = (checked) => {
        setPendingFlightsOnly(checked);
        getBookings(checked, 0, 10);
    };

    const [expanded, setExpanded] = useState(false);

    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const bookingComponents = bookingList.map((booking) => (
        <BookingListItem key={booking.id} booking={booking}></BookingListItem>
    ));

    useEffect(() => {
        getBookings(pendingFlightsOnly, 0, 10);
    }, [])

    const getBookings = async (pendingOnly, index, size) => {
        setIsPending(true);
        return getBookingsByUsername(userStatus.username, pendingOnly, index, size)
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
            <b style={{fontSize: 15}}>Pending Only<Switch color="primary" checked={pendingFlightsOnly} onChange={(event) => {handleSwitchPendingOnly(event.target.checked)}} /></b>
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