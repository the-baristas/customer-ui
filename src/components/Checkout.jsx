import React from 'react';

const Checkout = (props) => {
    console.log("checkout");
    return (
        <div>
            {props.flightTable}
            {props.passengerInfoForm}
            {props.paymentForm}
        </div>
    );
};

export default Checkout;
