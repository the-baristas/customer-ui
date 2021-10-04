import React, { useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import Button from "@material-ui/core/Button";
import { Form } from "react-bootstrap";
import { refundBooking, updateBooking } from "../../api/BookingApi";
import BookingListItem from "./BookingListItem";


const useStyles = makeStyles((theme) => ({
    modal: {
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    },
    paper: {
        backgroundColor: theme.palette.background.paper,
        border: "2px solid red",
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3)
    }
}));

const CancelBookingModal = (props) => {
    const classes = useStyles();

    const booking = props.booking;
    const cancellationFee = process.env.REACT_APP_CANCELLATION_FEE;
    const refundAmount = booking.totalPrice - cancellationFee;

    //Refunds aren't allowed if the price of the booking was less than the cancellationFee
    const refundIsAllowed = refundAmount > 0;

    const [isPending, setIsPending] = useState(false);


    const cancelBooking = async (booking) => {
        setIsPending(true);
        refundBooking(booking.id, refundAmount.toFixed(2))
        .then((data) => {
            setIsPending(false);
            props.handleCancelComplete();
        })
        .catch((error) => {
            setIsPending(false);
            alert(
                "There was a problem on our end. Please try again later."
            );
        });
    }

    return ( 
        <div>
        <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            className={classes.modal}
            open={props.open}
            onClose={props.handleClose}
            closeAfterTransition
            BackdropComponent={Backdrop}
            BackdropProps={{
                timeout: 500
            }}
        >
            <Fade in={props.open}>
                <div className={classes.paper}>
                    <p id="transition-modal-description">
                        This booking is <b>${booking.totalPrice}</b>.
                        <p>Our <b>cancellation fee is ${cancellationFee}</b>.</p>
                        {refundIsAllowed && <p>If you cancel this booking, <b>you will be refunded ${refundAmount.toFixed(2)}</b></p>}
                        {!refundIsAllowed && <p>As a result, you are not allowed to cancel this booking.</p>}
                    </p>

                    {!isPending && refundIsAllowed &&
                        <Button
                        data-testid="cancelButton"
                        variant="contained" onClick={() => {cancelBooking(booking)} } color="secondary" >Confirm</Button>
                    }
                    {isPending && <h4 data-testid="loading">Loading...</h4>}

                </div>
            </Fade>
        </Modal>
    </div>
     );
}
 
export default CancelBookingModal;