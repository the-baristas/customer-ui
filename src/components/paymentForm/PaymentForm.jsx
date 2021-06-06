import React, { useState, useEffect, useDebugValue } from "react";
import {CardElement, useStripe, useElements} from "@stripe/react-stripe-js";
import './PaymentForm.css';
import { Redirect, useHistory } from "react-router";
import { propTypes } from "react-bootstrap/esm/Image";
import { useSelector } from "react-redux";
import { createPayment } from "../../services/paymentService/PaymentService";

const PaymentForm = () => {
  const [succeeded, setSucceeded] = useState(false);
  const [error, setError] = useState(null);
  const [processing, setProcessing] = useState('');
  const [disabled, setDisabled] = useState(true);
  const [clientSecret, setClientSecret] = useState('');
  const stripe = useStripe();
  const elements = useElements();

  const history = useHistory();
  const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn)

  //TODO: WIll be dynamic based on the booking the user is purchasing
  const bookingId = 1;
  const amount = 9001;
  const currency = "usd";
  

  useEffect(() => {

    if(!userLoggedIn){
      console.log('no')
      //history.push('/');
      //return;
    }

    // Create PaymentIntent as soon as the page loads
    window
      .fetch(process.env.REACT_APP_BOOKING_SERVICE_URL + "/payments/payment-intent", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body:  JSON.stringify({amount, currency})
      })
      .then(res => {
        if(!res.ok){
          throw Error();
        }
        return res.json();
      })
      .then(data => {
        setClientSecret(data.clientSecret);
      })
      .catch((error) => {
        alert("We are unable to process payments at this time. Please try again later.")
        history.push('/');
      })
  }, []);

  const cardStyle = {
    style: {
      base: {
        color: "#32325d",
        fontFamily: 'Arial, sans-serif',
        fontSmoothing: "antialiased",
        fontSize: "16px",
        "::placeholder": {
          color: "#32325d"
        }
      },
      invalid: {
        color: "#fa755a",
        iconColor: "#fa755a"
      }
    }
  };

  const handleChange = async (event) => {
    // Listen for changes in the CardElement
    // and display any errors as the customer types their card details
    setDisabled(event.empty);
    setError(event.error ? event.error.message : "");
  };

  const handleSubmit = async ev => {
    ev.preventDefault();
    setProcessing(true); 

    const payload = await stripe.confirmCardPayment(clientSecret, {
      payment_method: { card: elements.getElement(CardElement) }
    });

    if (payload.error) {
      setError(`Payment failed ${payload.error.message}`);
      setProcessing(false);
    } else {

      createPayment(clientSecret, bookingId).then(res => {
        console.log(res)
        if(!res.ok){
            console.log("failed");
          throw Error(res.status)
        }
        else{
          alert("Thank you for your purchase.")
          setError(null);
          setProcessing(false);
          setSucceeded(true);
    
          //TODO: Should redirect somewhere besides home
          history.push('/');
        }

      })
      .catch((error) => {
        setError("There was a problem while processing your payment. Please try again later.");
        setProcessing(false);
        return
      })
    }
  };

  return (
    <div className='form-container'>
    <form id="payment-form" onSubmit={handleSubmit}>
      <CardElement id="card-element" options={cardStyle} onChange={handleChange} />
      <button
        disabled={processing || disabled || succeeded}
        id="submit"
      >
        <span id="button-text">
          {processing ? (
            <div className="spinner" id="spinner"></div>
          ) : (
            "Pay now"
          )}
        </span>
      </button>
      {/* Show any error that happens when processing the payment */}
      {error && (
        <div className="card-error" role="alert">
          {error}
        </div>
      )}
      
    </form>
    </div>
  );
}

export default PaymentForm