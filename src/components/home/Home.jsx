import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import PropTypes from "prop-types";
import React, { useState } from "react";
import { Image } from "react-bootstrap";
import { trackPromise } from "react-promise-tracker";
import { useSelector } from "react-redux";
import { Route, Switch, useHistory, useRouteMatch } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import {
    createBooking,
    deleteBooking,
    updateBooking
} from "../../api/BookingApi";
import { createPassenger, deletePassenger } from "../../api/PassengerApi";
import {
    createPayment,
    deletePayment
} from "../../services/paymentService/PaymentService";
import FlightTable from "../booking/FlightTable";
import PassengerInfoForm from "../booking/PassengerInfoForm";
import SeatClass from "../booking/SeatClass";
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

    const [bookingToCreate, setBookingToCreate] = useState({
        confirmationCode: "",
        layoverCount: 0,
        username: ""
    });
    const [passengerInfo, setPassengerInfo] = useState({
        id: 0,
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
    const [pricePerPassengerState, setPricePerPassengerState] = useState(0);
    const [taxesPerPassenger, setTaxesPerPassenger] = useState(0);
    const [passengerCount, setPassengerCount] = useState(1);
    const [totalPerPassenger, setTotalPerPassenger] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [flights, setFlights] = useState([]);
    const [flightPage, setFlightPage] = useState({});
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
    const [dateRange, setDateRange] = useState([new Date(), null]);
    const [startDate, endDate] = dateRange;
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");
    const [sortBy, setSortBy] = useState("departureTime");
    const [filter, setFilter] = useState("all");

    // Callbacks

    const handleFlightSearch = (flights) => {
        setFlights(flights.content);
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setSelectedFlight(selectedFlight);
        setSeatClass(seatClass);
        calculateTotalPrice(selectedFlight, seatClass);
        (async () => {
            const confirmationCode = uuidv4().toUpperCase();
            const layoverCount = 0;
            setBookingToCreate({
                confirmationCode,
                layoverCount,
                username: userStatus.username
            });
            history.push(`${path}/passenger-info`);
        })();
    };

    /**
     * Calculates price per passenger, taxes per passenger, total per passenger,
     * and total price, and sets them as state.
     */
    const calculateTotalPrice = (selectedFlight, seatClass) => {
        let pricePerPassenger;
        switch (seatClass) {
            case SeatClass.ECONOMY:
                pricePerPassenger = selectedFlight.economyPrice;
                break;
            case SeatClass.BUSINESS:
                pricePerPassenger = selectedFlight.businessPrice;
                break;
            case SeatClass.FIRST:
                pricePerPassenger = selectedFlight.firstPrice;
                break;
            default:
                // TODO: Go to error page.
                break;
        }
        pricePerPassenger = Math.round(pricePerPassenger * 100) / 100;
        setPricePerPassengerState(pricePerPassenger);
        const taxesPerPassenger =
            Math.round(pricePerPassenger * 0.07 * 100) / 100;
        setTaxesPerPassenger(taxesPerPassenger);
        const totalPerPassenger = pricePerPassenger + taxesPerPassenger;
        setTotalPerPassenger(totalPerPassenger);
        // TODO: Allow creation of more than 1 passenger at a time.
        setTotalPrice(totalPerPassenger * passengerCount);
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
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;

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
                    year: theYear,
                    hours: theHours,
                    mins: theMins,
                    filter: theFilter
                })
            }
        )
            .then((resp) => resp.json())
            .then((data) => {
                setFlights(data.content);
                setFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleFilterChange(event) {
        setFilter(event.target.value);

        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        let theYear = date.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = event.target.value;

        fetch(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=${flightPage.number}&pageSize=10&sortBy=${sortBy}`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: localStorage.getItem("utopiaCustomerKey")
                },
                body: JSON.stringify({
                    month: theMonth,
                    date: theDate,
                    year: theYear,
                    hours: theHours,
                    mins: theMins,
                    filter: theFilter
                })
            }
        )
            .then((resp) => resp.json())
            .then((data) => {
                setFlights(data.content);
                setFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
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
            let theHours = "00";
            let theMins = "00";
            let theFilter = "all";

            trackPromise(
                fetch(
                    `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=economyPrice`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                localStorage.getItem("utopiaCustomerKey")
                        },
                        body: JSON.stringify({
                            month: theMonth,
                            date: theDate,
                            year: theYear,
                            hours: theHours,
                            mins: theMins,
                            filter: theFilter
                        })
                    }
                )
                    .then((resp) => resp.json())
                    .then((data) => {
                        
                        setFlights(data.content);
                        setFlightPage(data);
                        history.push("/booking/search-results");
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("No flights found, try again!");
                    })
            );
        }
    }

    function handlePageChange(newPage) {
        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        let theYear = date.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;
        setFlightPage(newPage);

        trackPromise(
            fetch(
                `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=${newPage}&pageSize=10&sortBy=${sortBy}`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: localStorage.getItem("utopiaCustomerKey")
                    },
                    body: JSON.stringify({
                        month: theMonth,
                        date: theDate,
                        year: theYear,
                        hours: theHours,
                        mins: theMins,
                        filter: theFilter
                    })
                }
            )
                .then((resp) => resp.json())
                .then((data) => {
                    setFlights(data.content);
                    setFlightPage(data);
                })
                .catch((error) => {
                    console.error(error);
                    alert("No flights found, try again!");
                })
        );
    }

    const handlePaymentCreation = (clientSecret) => {
        (async () => {
            let newBooking;
            try {
                newBooking = await createBooking({
                    confirmationCode: bookingToCreate.confirmationCode,
                    layoverCount: bookingToCreate.layoverCount,
                    username: userStatus.username
                });
            } catch (e) {
                console.error(e);
                // TODO: Cancel stripe payment.
                return;
            }

            let payment;
            try {
                payment = await createPayment(clientSecret, newBooking.id);
            } catch (e) {
                console.error(e);
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }

            const address = `${passengerInfo.streetAddress} ${passengerInfo.city} ${passengerInfo.state} ${passengerInfo.zipCode}`;
            let newPassengerInfo;
            try {
                newPassengerInfo = await createPassenger({
                    bookingConfirmationCode: newBooking.confirmationCode,
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
                    // TODO: Allow user to choose seat.
                    seatNumber: 1,
                    // TODO: Create a seat class to check-in group map.
                    checkInGroup: 1
                });
                setPassengerInfo(newPassengerInfo);
            } catch (e) {
                // TODO: Delete payment.
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }

            try {
                await updateBooking({
                    id: newBooking.id,
                    confirmationCode: newBooking.confirmationCode,
                    layoverCount: newBooking.layoverCount,
                    totalPrice,
                    username: newBooking.username
                });
                // TODO: Redirect to booking confirmation page.
                history.push(`${path}`);
            } catch (e) {
                await deletePassenger(newPassengerInfo.id);
                await deletePayment(payment.stripeId);
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
            }
        })();
    };

    // Elements

    const flightTable = (
        <FlightTable
            selectedFlight={selectedFlight}
            seatClass={seatClass}
            pricePerPassenger={pricePerPassengerState}
            taxesPerPassenger={taxesPerPassenger}
            passengerCount={passengerCount}
        />
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
                    <Image
                        src={mainImage}
                        className="img-bg"
                        aria-label="main image"
                    />
                    <FlightSearch
                        onFlightSearch={handleFlightSearch}
                        sortBy={sortBy}
                        handleSubmit={handleSubmit}
                        handleOriginChange={handleOriginChange}
                        handleDestChange={handleDestChange}
                        date={date}
                        dateRange={dateRange}
                        startDate={startDate}
                        endDate={endDate}
                        setDateRange={setDateRange}
                    ></FlightSearch>
                </Route>
                <Route path={`${path}/search-results`}>
                    <FlightList
                        flightCards={flightCards}
                        flightPage={flightPage}
                        handlePageChange={handlePageChange}
                        handleFilterChange={handleFilterChange}
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
                            totalDollars={totalPrice}
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
