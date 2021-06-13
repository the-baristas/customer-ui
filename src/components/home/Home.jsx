import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { createBooking } from "../../api/BookingApi";
import { createPassenger } from "../../api/PassengerApi";
import FlightTable from "../booking/FlightTable";
import PassengerInfoForm from "../booking/PassengerInfoForm";
import FlightCard from "../flight-list/FlightCard";
import FlightList from "../flight-list/FlightList";
import FlightSearch from "../flight-search/FlightSearch";
import PaymentForm from "../paymentForm/PaymentForm";
import mainImage from "./customer-ui-01.jpg";

const Home = () => {
    const userStatus = useSelector((state) => state.userStatus);

    const [selectedFlight, setSelectedFlight] = useState({
        id: 0,
        airplane: null,
        departureTime: "",
        arrivalTime: "",
        firstReserved: 0,
        firstPrice: 0,
        businessReserved: 0,
        businessPrice: 0,
        economyReserved: 0,
        economyPrice: 0,
        isActive: false,
        route: null
    });
    const [flights, setFlights] = useState([]);
    const [seatClass, setSeatClass] = useState("");
    const [booking, setBooking] = useState({
        confirmationCode: "",
        layoverCount: 0,
        username: ""
    });
    const [passengerInfo, setPassengerInfo] = useState({
        givenName: "",
        familyName: "",
        dateOfBirth: "",
        gender: "",
        streetAddress: "",
        city: "",
        state: "",
        zipCode: ""
    });
    const [totalPrice, setTotalPrice] = useState(0);

    const { path } = useRouteMatch();
    const history = useHistory();

    const handleFlightSearch = (flights) => {
        setFlights(flights);
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setSelectedFlight(selectedFlight);
        setSeatClass(seatClass);
        // TODO: Calculate total price.
        setTotalPrice(50);
        (async () => {
            const confirmationCode = uuidv4();
            const layoverCount = 0;
            setBooking(
                await createBooking({
                    confirmationCode,
                    layoverCount,
                    username: userStatus.username
                })
            );
            history.push(`${path}/passenger-info`);
        })();
    };

    const handlePassengerInfoSubmit = (passengerInfo) => {
        setPassengerInfo(passengerInfo);
        history.push(`${path}/checkout`);
    };

    const handlePaymentCreation = () => {
        const address = `${passengerInfo.streetAddress} ${passengerInfo.city} ${passengerInfo.state} ${passengerInfo.zipCode}`;
        (async () => {
            setPassengerInfo(
                await createPassenger({
                    bookingConfirmationCode: booking.confirmationCode,
                    originAirportCode:
                        selectedFlight.route.originAirport.iataId,
                    destinationAirportCode:
                        selectedFlight.route.destinationAirport.iataId,
                    airplaneModel: selectedFlight.airplane.model,
                    departureTime: selectedFlight.departureTime,
                    arrivalTime: selectedFlight.arrivalTime,
                    givenName: passengerInfo.givenName,
                    familyName: passengerInfo.familyName,
                    dateOfBirth: passengerInfo.dateOfBirth,
                    gender: passengerInfo.gender,
                    address,
                    seatClass: seatClass,
                    // TODO: Allow user to chhose seat.
                    seatNumber: 1,
                    // TODO: Create a seat class to check-in group map.
                    checkInGroup: 1
                })
            );
        })();
        //TODO: Should redirect somewhere besides root
        history.push(`${path}`);
    };

    const flightTable = (
        <FlightTable selectedFlight={selectedFlight} seatClass={seatClass} />
    );
    const promise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );
    const flightCards = flights.map((flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            onFlightSelection={handleFlightSelection}
        />
    ));
    return (
        <div>
            {userStatus.userLoggedIn && <h1>Welcome {userStatus.username}</h1>}
            <Switch>
                <Route exact path={path}>
                    <Image src={mainImage} fluid />
                    <FlightSearch onFlightSearch={handleFlightSearch} />
                </Route>
                <Route path={`${path}/search-results`}>
                    <FlightList flights={flights} flightCards={flightCards} />
                </Route>
                <Route path={`${path}/passenger-info`}>
                    {flightTable}
                    <PassengerInfoForm
                        onPassengerInfoSubmit={handlePassengerInfoSubmit}
                    />
                </Route>
                <Route path={`${path}/checkout`}>
                    {flightTable}
                    <Elements stripe={promise}>
                        <PaymentForm
                            bookingId={booking.id}
                            totalPrice={totalPrice}
                            onPaymentCreation={handlePaymentCreation}
                        />
                    </Elements>
                </Route>
            </Switch>
        </div>
    );
};

Home.propTypes = {
    selectedFlight: PropTypes.object,
    flights: PropTypes.node,
    seatClass: PropTypes.string,
    booking: PropTypes.object,
    passenger: PropTypes.object,
    totalPrice: PropTypes.number
};

export default Home;
