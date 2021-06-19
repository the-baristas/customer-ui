import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { getBookingsByUsername } from '../../api/BookingApi';
import Typography from '@material-ui/core/Typography';
import Pagination from '@material-ui/lab/Pagination';
import BookingListItem from './BookingListItem';
import './UserProfileBookingsList.css';

const UserProfileBookingsList = () => {
    const userStatus = useSelector((state) => state.userStatus);

    const [isPending, setIsPending] = useState(true);
    const [infoRetrievalSuccessful, setInfoRetrievalSuccessful] = useState(false);
    const [currentPage, setCurrentPage] = useState({});
    const [bookingList, setBookingList] = useState([]);

    const [page, setPage] = useState(1);

    const handlePageChange = (event, value) => {
      setPage(value);
      getBookings(value-1,10);
    };

    const [expanded, setExpanded] = useState(false);
    const handleChange = (panel) => (event, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    }

    const bookingComponents = bookingList.map((booking) => (
        <BookingListItem key={booking.id} booking={booking}></BookingListItem>
    ));

    useEffect(() => {
        getBookings(0, 10);
    }, [])

    const getBookings = async (index, size) => {
        setIsPending(true);
        return getBookingsByUsername(userStatus.username, index, size)
            .then((data) => {
                setCurrentPage(data);
                setBookingList(data.content);
                setIsPending(false);
                setInfoRetrievalSuccessful(true);
            })
            .catch((error) => {
                setIsPending(false);
                setInfoRetrievalSuccessful(false);
                alert(
                    "We are unable to load your information at this time. Please try again later."
                );
            });
    }

    return ( <div>
        <h2 className="booking-list-title">Past Bookings</h2>
        {isPending && <h3 data-testid='loading'>Loading...</h3>}

        {!isPending && infoRetrievalSuccessful && <div>
                {bookingComponents}
                <div className='pagination'>
                    <Typography data-testid='page'>Page: {page}</Typography>
                    <Pagination count={currentPage.totalPages} page={page} onChange={handlePageChange} />
                </div>
            </div>}
    </div> );
}
 
export default UserProfileBookingsList;