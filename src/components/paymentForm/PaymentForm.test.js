import React from 'react';
import {render} from "@testing-library/react";
import { Provider } from "react-redux";
import store from "../../redux/store";
import { Elements } from '@stripe/react-stripe-js';
import { loadStripe } from "@stripe/stripe-js";
import PaymentForm from './PaymentForm';


const promise = loadStripe(process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY);


it("Pay button exists", () => {
    const {getByTestId} = render(<Provider store={store}><Elements stripe={promise} ><PaymentForm></PaymentForm></Elements></Provider>);
    const button = getByTestId("payButton");
    expect(button).toBeTruthy();
    expect(button.innerHTML).toContain("Pay");
})