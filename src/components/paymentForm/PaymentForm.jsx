import { CardElement, useElements, useStripe } from "@stripe/react-stripe-js";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";
import { getToken } from "../../utils/Login";
import "./PaymentForm.css";

const PaymentForm = (props) => {
    const [succeeded, setSucceeded] = useState(false);
    const [error, setError] = useState(null);
    const [processing, setProcessing] = useState("");
    const [disabled, setDisabled] = useState(true);
    const [clientSecret, setClientSecret] = useState("");

    const stripe = useStripe();
    const elements = useElements();
    const history = useHistory();

    const currency = "usd";

    useEffect(() => {
        // Create PaymentIntent as soon as the page loads
        window
            .fetch(
                process.env.REACT_APP_BOOKING_SERVICE_URL +
                    "/payments/payment-intent",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json","Authorization": getToken()
                    },
                    body: JSON.stringify({
                        amount: props.totalDollars * 100,
                        currency
                    })
                }
            )
            .then((res) => {
                if (!res.ok) {
                    throw Error();
                }
                return res.json();
            })
            .then((data) => {
                setClientSecret(data.clientSecret);
            })
            .catch((error) => {
                alert(
                    "We are unable to process payments at this time. Please try again later."
                );
                (error);
                history.push("/");
            });
    }, [history, props.totalDollars]);

    const cardStyle = {
        style: {
            base: {
                color: "#32325d",
                fontFamily: "Arial, sans-serif",
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

    const handleSubmit = async (ev) => {
        ev.preventDefault();
        setProcessing(true);

        const payload = await stripe.confirmCardPayment(clientSecret, {
            payment_method: { card: elements.getElement(CardElement) }
        });

        if (payload.error) {
            setError(`Payment failed ${payload.error.message}`);
            setProcessing(false);
        } else {
            alert("Thank you for your purchase.");
            setError(null);
            setProcessing(false);
            setSucceeded(true);

            props.onPaymentCreation(clientSecret);
        }
    };

    return (
        <div className="form-container">
            <form id="payment-form" onSubmit={handleSubmit}>
                <CardElement
                    id="card-element"
                    options={cardStyle}
                    onChange={handleChange}
                />
                <button
                    data-testid="payButton"
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
};

export default PaymentForm;
