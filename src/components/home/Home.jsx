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
    // Redux

    const userStatus = useSelector((state) => state.userStatus);

    // Router

    const { path } = useRouteMatch();
    const history = useHistory();

    // States

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
    const [seatClass, setSeatClass] = useState("");
    const [totalPrice, setTotalPrice] = useState(0);
    const [flights, setFlights] = useState([]);
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
    const [date, setDate] = useState(new Date());
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");
    const [sortBy, setSortBy] = useState("departureTime");

    // Callbacks

    const handleFlightSearch = (flights) => {
        setFlights(flights.content);
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setSelectedFlight(selectedFlight);
        setSeatClass(seatClass);
        // TODO: Calculate total price.
        setTotalPrice(50);
        (async () => {
            const confirmationCode = uuidv4().toUpperCase();
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

    function handleSortByChange(event) {
        setSortBy(event.target.value);

        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        let theYear = date.getFullYear();

        fetch(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=${sortBy}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("utopiaCustomerKey")
                },
                body: JSON.stringify({
                    month: theMonth,
                    date: theDate,
                    year: theYear
                })
            }
        )
            .then((resp) => resp.json())
            .then((data) => {
                console.log(data);
                setFlights(data.content);
                history.push("/booking/search-results");
            })
            .catch((error) => {
                console.log(error);
                alert("No flights found, try again!");
            });
    }

    function onDateChange(date) {
        setDate(date);
    }

    function handleOriginChange(event) {
        setOrigin(event.target.value);
    }

    function handleDestChange(event) {
        setDest(event.target.value);
    }

    function handleSubmit(event) {
        event.preventDefault();
        if (origin === "" || dest === "" || date === "") {
            alert("Please make sure all search fields are completed.");
        } else {
            let theMonth = date.getMonth() + 1;
            let theDate = date.getDate();
            let theYear = date.getFullYear();

            fetch(
                `http://localhost:8090/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=economyPrice`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("utopiaCustomerKey")
                    },
                    body: JSON.stringify({
                        month: theMonth,
                        date: theDate,
                        year: theYear
                    })
                }
            )
                .then((resp) => resp.json())
                .then((data) => {
                    console.log(data);
                    setFlights(data.content);
                    history.push("/booking/search-results");
                })
                .catch((error) => {
                    console.log(error);
                    alert("No flights found, try again!");
                });
        }
    }

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

    // Elements

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
                    <FlightSearch
                        onFlightSearch={handleFlightSearch}
                        sortBy={sortBy}
                        handleSubmit={handleSubmit}
                        handleOriginChange={handleOriginChange}
                        handleDestChange={handleDestChange}
                        date={date}
                        onDateChange={onDateChange}
                    ></FlightSearch>
                </Route>
                <Route path={`${path}/search-results`}>
                    <FlightList
                        flights={flights}
                        flightCards={flightCards}
                        onFlightSelection={handleFlightSelection}
                        onSortBy={handleSortByChange}
                    />
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
    totalPrice: PropTypes.number,
    sortBy: PropTypes.string,
    date: PropTypes.object,
    origin: PropTypes.string,
    dest: PropTypes.string
};

export default Home;
