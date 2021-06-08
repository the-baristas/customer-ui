import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Route, Switch, useRouteMatch } from "react-router-dom";
import Checkout from "../Checkout";
import FlightSearch from "../flight-search/FlightSearch";
import FlightTable from "../FlightTable";
import PassengerInfoForm from "../PassengerInfoForm";
import PaymentForm from "../paymentForm/PaymentForm";
import SearchResults from "../search-results/SearchResults";
import mainImage from "./customer-ui-01.jpg";

const Home = () => {
    const userStatus = useSelector((state) => state.userStatus);
    const userLoggedIn = userStatus.userLoggedIn;
    const [selectedFlight, setSelectedFlight] = useState({});
    const [flights, setFlights] = useState([{}]);
    const { path } = useRouteMatch();

    const handleFlightSelection = (flight) => {
        setSelectedFlight(flight);
    };

    const handleFlightSearch = (flights) => {
        setFlights(flights);
    };

    const passengerInfoForm = <PassengerInfoForm />;
    const flightTable = <FlightTable selectedFlight={selectedFlight} />;
    const promise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );
    const paymentForm = (
        <Elements stripe={promise}>
            <PaymentForm></PaymentForm>
        </Elements>
    );
    return (
        <div>
            {userLoggedIn && <h1>Welcome {userStatus.username}</h1>}
            <Switch>
                <Route exact path={path}>
                    <FlightSearch onFlightSearch={handleFlightSearch} />
                    <Image src={mainImage} fluid />
                </Route>
                {/* <Route path={`${path}/flights`}> */}
                <Route path="/flights">
                    <SearchResults
                        flights={flights}
                        onFlightSelection={handleFlightSelection}
                    />
                </Route>
                {/* <Route path={`${path}/checkout`}> */}
                <Route path="/checkout">
                    <Checkout
                        flightTable={flightTable}
                        passengerInfoForm={passengerInfoForm}
                        paymentForm={paymentForm}
                    />
                </Route>
            </Switch>
        </div>
    );
};

export default Home;
