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
} from "../../api/PaymentService";
import FlightTable from "./FlightTable";
import PassengerInfoForm from "./PassengerInfoForm";
import SeatClass from "./SeatClass";
import FlightCard from "../flight-list/FlightCard";
import FlightList from "../flight-list/FlightList";
import FlightSearch from "../flight-search/FlightSearch";
import PaymentForm from "../paymentForm/PaymentForm";
import mainImage from "./customer-ui-01.jpg";

const Booking = () => {
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
    const [checkInGroup, setCheckInGroup] = useState(3);
    const [departureClass, setDepartureClass] = useState("");
    const [depCheckInGroup, setDepCheckInGroup] = useState(3);
    const [retCheckInGroup, setRetCheckInGroup] = useState(3);
    const [returnClass, setReturnClass] = useState("");
    const [isRoundTrip, setIsRoundTrip] = useState(false);
    const [departureSelectionMade, setDepartureSelectionMade] = useState(false);
    const [returnSelectionMade, setReturnSelectionMade] = useState(false);
    const [pricePerPassengerState, setPricePerPassengerState] = useState(0);
    const [departurePricePPState, setDeparturePricePPState] = useState(0);
    const [returnPricePPState, setReturnPricePPState] = useState(0);
    const [RTPricePerPassengerState, setRTPricePerPassengerState] = useState(0);
    const [taxesPerPassenger, setTaxesPerPassenger] = useState(0);
    const [departureTaxesPP, setDepartureTaxesPP] = useState(0);
    const [returnTaxesPP, setReturnTaxesPP] = useState(0);
    const [passengerCount, setPassengerCount] = useState(1);
    const [totalPerPassenger, setTotalPerPassenger] = useState(0);
    const [totalPrice, setTotalPrice] = useState(0);
    const [flights, setFlights] = useState([]);
    const [departureFlights, setDepartureFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [flightPage, setFlightPage] = useState({});
    const [departureFlightPage, setDepartureFlightPage] = useState({});
    const [returnFlightPage, setReturnFlightPage] = useState({});
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
    const [departureFlight, setDepartureFlight] = useState({
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
    const [returnFlight, setReturnFlight] = useState({
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
    const [dateRange, setDateRange] = useState([new Date(), Date.now() + 6.048e+8]);
    const [startDate, endDate] = dateRange;
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");
    const [sortBy, setSortBy] = useState("departureTime");
    const [departureSortBy, setDepartureSortBy] = useState("departureTime");
    const [returnSortBy, setReturnSortBy] = useState("departureTime");
    const [filter, setFilter] = useState("all");
    const [departureFilter, setDepartureFilter] = useState("all");
    const [returnFilter, setReturnFilter] = useState("all");
    // sets the total price of upgrades
    const [upgradesPricePP, setUpgradesPricePP] = useState(0);
    const [desUpgradesPricePP, setDesUpgradesPricePP] = useState(0);
    const [retUpgradesPricePP, setRetUpgradesPricePP] = useState(0);

    // state variables check if a boarding group upgrade has already been applied
    const [hasBGUpgrade, setHasBgUpgrade] = useState(false);
    const [hasRetBGUpgrade, setHasRetBgUpgrade] = useState(false);
    const [hasDepBGUpgrade, setHasDepBgUpgrade] = useState(false);

    // callbacks

    const handleUpgrades = (upgradePrice) => {
        if (hasBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasBgUpgrade(true);
        }
    }

    const handleRetUpgrades = (upgradePrice) => {
        if (hasRetBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasRetBgUpgrade(true);
        }
    }

    const handleDepUpgrades = (upgradePrice) => {
        if (hasDepBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasDepBgUpgrade(true);
        }
    }

    const handleFlightSearch = (flights) => {
        setFlights(flights.content);
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setSelectedFlight(selectedFlight);
        setSeatClass(seatClass);
        
        switch (seatClass) {
            case SeatClass.ECONOMY:
                setCheckInGroup(3);
                break;
            case SeatClass.BUSINESS:
                setCheckInGroup(2);
                break;
            case SeatClass.FIRST:
                setCheckInGroup(1);
                break;
            default:
                // TODO: Go to error page.
                break;
        }

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

    const handleDepartureSelection = (selectedFlight, seatClass) => {
        setDepartureFlight(selectedFlight);
        setDepartureClass(seatClass);
        let selectedFlightCard = document.getElementById("fc"+selectedFlight.id);
        let flightCards = document.getElementById("depFlightCards");
        let departureSort = document.getElementById("departure-sort");
        let departureFilter = document.getElementById("departure-filter");
        departureSort.style.display = "none";
        departureFilter.style.display = "none";
        flightCards.style.display = "none";
        setDepartureSelectionMade(true);
        let depPricePP;
        switch (seatClass) {
            case SeatClass.ECONOMY:
                setDepCheckInGroup(3);
                depPricePP = selectedFlight.economyPrice;
                depPricePP = Math.round(depPricePP * 100) / 100;
                setDeparturePricePPState(depPricePP);
                break;
            case SeatClass.BUSINESS:
                setDepCheckInGroup(2);
                depPricePP = selectedFlight.businessPrice;
                depPricePP = Math.round(depPricePP * 100) / 100;
                setDeparturePricePPState(depPricePP);
                break;
            case SeatClass.FIRST:
                setDepCheckInGroup(1);
                depPricePP = selectedFlight.firstPrice;
                depPricePP = Math.round(depPricePP * 100) / 100;
                setDeparturePricePPState(depPricePP);
                break;
            default:
                // TODO: Go to error page.
                break;
        }

    };

    const handleReturnSelection = (selectedFlight, seatClass) => {
        setReturnFlight(selectedFlight);
        setReturnClass(seatClass);
        let selectedFlightCard = document.getElementById("fc"+selectedFlight.id);
        let flightCards = document.getElementById("retFlightCards");
        let returnSort = document.getElementById("return-sort");
        let returnFilter = document.getElementById("return-filter");
        returnSort.style.display = "none";
        returnFilter.style.display = "none";
        flightCards.style.display = "none";
        let returnPricePP;


        setReturnSelectionMade(true);
        switch (seatClass) {
            case SeatClass.ECONOMY:
                setRetCheckInGroup(3);
                returnPricePP = selectedFlight.economyPrice;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            case SeatClass.BUSINESS:
                setRetCheckInGroup(2);
                returnPricePP = selectedFlight.businessPrice;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            case SeatClass.FIRST:
                setRetCheckInGroup(1);
                returnPricePP = selectedFlight.firstPrice;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            default:
                // TODO: Go to error page.
                break;
        }
    };

    const handleRTSelection = () => {
            
        calculateRTPrice(departureFlight, departureClass, returnFlight, returnClass);
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
    }

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

    const calculateRTPrice = (departureFlight, departureClass, returnFlight, returnClass) => {
        let departurePricePP;
        let returnPricePP;
        let pricePP;

        switch (departureClass) {
            case SeatClass.ECONOMY:
                departurePricePP = departureFlight.economyPrice;
                break;
            case SeatClass.BUSINESS:
                departurePricePP = departureFlight.businessPrice;
                break;
            case SeatClass.FIRST:
                departurePricePP = departureFlight.firstPrice;
                break;
            default:
                // TODO: Go to error page.
                break;
        }

        switch (returnClass) {
            case SeatClass.ECONOMY:
                returnPricePP = returnFlight.economyPrice;
                break;
            case SeatClass.BUSINESS:
                returnPricePP = returnFlight.businessPrice;
                break;
            case SeatClass.FIRST:
                returnPricePP = returnFlight.firstPrice;
                break;
            default:
                // TODO: Go to error page.
                break;
        }

        departurePricePP = Math.round(departurePricePP * 100) / 100;
        let departureUpgradesPricePP = Math.round(desUpgradesPricePP * 100) / 100;
        returnPricePP = Math.round(returnPricePP * 100) / 100;
        let returnUpgradesPricePP = Math.round(retUpgradesPricePP * 100) / 100;

        pricePP = departurePricePP + departureUpgradesPricePP + returnPricePP + returnUpgradesPricePP;

        setDeparturePricePPState(departurePricePP);
        setDesUpgradesPricePP(departureUpgradesPricePP);
        setReturnPricePPState(returnPricePP);
        setRetUpgradesPricePP(returnUpgradesPricePP);
        setRTPricePerPassengerState(pricePP);

        const departureTaxesPerPassenger =
            Math.round((departurePricePP + returnUpgradesPricePP) * 0.07 * 100) / 100;
        setDepartureTaxesPP(departureTaxesPerPassenger);

        const returnTaxesPerPassenger =
            Math.round((returnPricePP + returnPricePP) * 0.07 * 100) / 100;
        setReturnTaxesPP(returnTaxesPerPassenger);

        const totalTaxesPP = departureTaxesPerPassenger + returnTaxesPerPassenger;

        const totalPerPassenger = pricePP + totalTaxesPP;
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
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=${event.target.value}`,
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

    function handleSortByChangeDepartures(event) {
        setDepartureSortBy(event.target.value);

        let theMonth = startDate.getMonth() + 1;
        let theDate = startDate.getDate();
        let theYear = startDate.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;

        fetch(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=${event.target.value}`,
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
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleSortByChangeReturns(event) {
        setReturnSortBy(event.target.value);

        let theMonth = endDate.getMonth() + 1;
        let theDate = endDate.getDate();
        let theYear = endDate.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;

        fetch(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${dest}&destinationId=${origin}&pageNo=0&pageSize=10&sortBy=${event.target.value}`,
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
                setReturnFlights(data.content);
                setReturnFlightPage(data);
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
                    filter: event.target.value
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

    function handleFilterChangeDepartures(event) {
        setDepartureFilter(event.target.value);

        let theMonth = startDate.getMonth() + 1;
        let theDate = startDate.getDate();
        let theYear = startDate.getFullYear();
        let theHours = "00";
        let theMins = "00";

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
                    filter: event.target.value
                })
            }
        )
            .then((resp) => resp.json())
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleFilterChangeReturns(event) {
        setDepartureFilter(event.target.value);

        let theMonth = endDate.getMonth() + 1;
        let theDate = endDate.getDate();
        let theYear = endDate.getFullYear();
        let theHours = "00";
        let theMins = "00";

        fetch(
            `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${dest}&destinationId=${origin}&pageNo=${flightPage.number}&pageSize=10&sortBy=${sortBy}`,
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
                    filter: event.target.value
                })
            }
        )
            .then((resp) => resp.json())
            .then((data) => {
                setReturnFlights(data.content);
                setReturnFlightPage(data);
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
        setIsRoundTrip(false);
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


    function handleRTSubmit(event) {
        event.preventDefault();
        setIsRoundTrip(true);
        if (origin === "" || dest === "" || startDate === "" || endDate === "") {
            alert("Please make sure all search fields are completed.");
        } else {

            let departureMonth = startDate.getMonth() + 1;
            let departureDate = startDate.getDate();
            let departureYear = startDate.getFullYear();
            let departureHours = "00";
            let departureMins = "00";
            let departureFilter = "all";

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
                            month: departureMonth,
                            date: departureDate,
                            year: departureYear,
                            hours: departureHours,
                            mins: departureMins,
                            filter: departureFilter
                        })
                    }
                )
                    .then((resp) => resp.json())
                    .then((data) => {
                        
                        setDepartureFlights(data.content);
                        setDepartureFlightPage(data);
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("No departure flights found for this query, try again!");
                    })
            );

            let returnMonth = endDate.getMonth() + 1;
            let returnDate = endDate.getDate();
            let returnYear = endDate.getFullYear();
            let returnHours = "00";
            let returnMins = "00";
            let returnFilter = "all";

            trackPromise(
                fetch(
                    `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/query?originId=${dest}&destinationId=${origin}&pageNo=0&pageSize=10&sortBy=economyPrice`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization:
                                localStorage.getItem("utopiaCustomerKey")
                        },
                        body: JSON.stringify({
                            month: returnMonth,
                            date: returnDate,
                            year: returnYear,
                            hours: returnHours,
                            mins: returnMins,
                            filter: returnFilter
                        })
                    }
                )
                    .then((resp) => resp.json())
                    .then((data) => {
                        
                        setReturnFlights(data.content);
                        setReturnFlightPage(data);
                        history.push("/booking/search-results");
                    })
                    .catch((error) => {
                        console.error(error);
                        alert("No return flights found for this query, try again or consider purchasing a one way ticket!");
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

    function handlePageChangeReturns(newPage) {
        let theMonth = startDate.getMonth() + 1;
        let theDate = startDate.getDate();
        let theYear = startDate.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;

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
                    setReturnFlights(data.content);
                    setReturnFlightPage(data);
                })
                .catch((error) => {
                    console.error(error);
                    alert("No flights found, try again!");
                })
        );
    }

    function handlePageChangeDepartures(newPage) {
        let theMonth = endDate.getMonth() + 1;
        let theDate = endDate.getDate();
        let theYear = endDate.getFullYear();
        let theHours = "00";
        let theMins = "00";
        let theFilter = filter;

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
                    setDepartureFlights(data.content);
                    setDepartureFlightPage(data);
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

            switch (SeatClass) {
                case SeatClass.ECONOMY:
                    setCheckInGroup(3);
                    break;
                case SeatClass.BUSINESS:
                    setCheckInGroup(2);
                    break;
                case SeatClass.FIRST:
                    setCheckInGroup(1);
                    break;
                default:
                    // TODO: Go to error page.
                    break;
            }

            if (isRoundTrip === false) {
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
                    checkInGroup: checkInGroup
                });
                setPassengerInfo(newPassengerInfo);
            } catch (e) {
                // TODO: Delete payment.
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }
        } else {

            switch (departureClass) {
                case departureClass.ECONOMY:
                    setDepCheckInGroup(3);
                    break;
                case departureClass.BUSINESS:
                    setDepCheckInGroup(2);
                    break;
                case departureClass.FIRST:
                    setDepCheckInGroup(1);
                    break;
                default:
                    // TODO: Go to error page.
                    break;
            }

            switch (returnClass) {
                case returnClass.ECONOMY:
                    setRetCheckInGroup(3);
                    break;
                case returnClass.BUSINESS:
                    setRetCheckInGroup(2);
                    break;
                case returnClass.FIRST:
                    setRetCheckInGroup(1);
                    break;
                default:
                    // TODO: Go to error page.
                    break;
            }

            try {
                newPassengerInfo = await createPassenger({
                    bookingConfirmationCode: newBooking.confirmationCode,
                    originAirportCode:
                        departureFlight.route.originAirport.iataId,
                    destinationAirportCode:
                        departureFlight.route.destinationAirport.iataId,
                    airplaneModel: departureFlight.airplane.model,
                    departureTime: departureFlight.departureTime,
                    arrivalTime: departureFlight.arrivalTime,
                    givenName: passengerInfo.givenName,
                    familyName: passengerInfo.familyName,
                    dateOfBirth: passengerInfo.dateOfBirth,
                    gender: passengerInfo.gender,
                    address,
                    seatClass: departureClass,
                    // TODO: Allow user to choose seat.
                    seatNumber: 1,
                    // TODO: Create a seat class to check-in group map.
                    checkInGroup: depCheckInGroup
                });
                setPassengerInfo(newPassengerInfo);
            } catch (e) {
                // TODO: Delete payment.
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }

            try {
                newPassengerInfo = await createPassenger({
                    bookingConfirmationCode: newBooking.confirmationCode,
                    originAirportCode:
                        returnFlight.route.originAirport.iataId,
                    destinationAirportCode:
                        returnFlight.route.destinationAirport.iataId,
                    airplaneModel: returnFlight.airplane.model,
                    departureTime: returnFlight.departureTime,
                    arrivalTime: returnFlight.arrivalTime,
                    givenName: passengerInfo.givenName,
                    familyName: passengerInfo.familyName,
                    dateOfBirth: passengerInfo.dateOfBirth,
                    gender: passengerInfo.gender,
                    address,
                    seatClass: seatClass,
                    // TODO: Allow user to choose seat.
                    seatNumber: 1,
                    // TODO: Create a seat class to check-in group map.
                    checkInGroup: retCheckInGroup
                });
                setPassengerInfo(newPassengerInfo);
            } catch (e) {
                // TODO: Delete payment.
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }  
            
            const rtTotalPerPassenger = RTPricePerPassengerState + departureTaxesPP + returnTaxesPP;
            const finalTotal = rtTotalPerPassenger * passengerCount;
            setTotalPrice(finalTotal);

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
            departureFlight={departureFlight}
            returnFlight={returnFlight}
            seatClass={seatClass}
            departureClass={departureClass}
            returnClass={returnClass}
            isRoundTrip={isRoundTrip}
            pricePerPassenger={pricePerPassengerState}
            departurePricePP={departurePricePPState}
            returnPricePP={returnPricePPState}
            rtPricePerPassenger={RTPricePerPassengerState}
            taxesPerPassenger={taxesPerPassenger}
            departureTaxesPP={departureTaxesPP}
            returnTaxesPP={returnTaxesPP}
            passengerCount={passengerCount}
            setCheckInGroup={setCheckInGroup}
            checkInGroup={checkInGroup}
            upgradesPricePP={upgradesPricePP}
            desUpgradesPricePP={desUpgradesPricePP}
            retUpgradesPricePP={retUpgradesPricePP}
            setUpgradesPricePP={setUpgradesPricePP}
            retCheckInGroup={retCheckInGroup}
            depCheckInGroup={depCheckInGroup}
        />
    );
    const promise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );
    const flightCards = flights.map((flight) => (
        <FlightCard
            id={flight.id}
            key={flight.id}
            flight={flight}
            onFlightSelection={handleFlightSelection}
        />
    ));

    const departureFlightCards = departureFlights.map((flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            onFlightSelection={handleDepartureSelection}
        />
    ));

    const returnFlightCards = returnFlights.map((flight) => (
        <FlightCard
            key={flight.id}
            flight={flight}
            onFlightSelection={handleReturnSelection}
        />
    ));

    return (
        <div>
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
                        handleRTSubmit={handleRTSubmit}
                        handleOriginChange={handleOriginChange}
                        handleDestChange={handleDestChange}
                        date={date}
                        onDateChange={onDateChange}
                        dateRange={dateRange}
                        startDate={startDate}
                        endDate={endDate}
                        setDateRange={setDateRange}
                    ></FlightSearch>
                </Route>
                <Route path={`${path}/search-results`}>
                    <FlightList
                        flightCards={flightCards}
                        departureFlightCards={departureFlightCards}
                        returnFlightCards={returnFlightCards}
                        flightPage={flightPage}
                        departureFlight={departureFlight}
                        returnFlight={returnFlight}
                        departureSelectionMade={departureSelectionMade}
                        departureClass={departureClass}
                        departurePricePP={departurePricePPState}
                        returnPricePP={returnPricePPState}
                        returnSelectionMade={returnSelectionMade}
                        returnClass={returnClass}
                        departureFlightPage={departureFlightPage}
                        returnFlightPage={returnFlightPage}
                        retCheckInGroup={retCheckInGroup}
                        depCheckInGroup={depCheckInGroup}
                        setCheckInGroup={setCheckInGroup}
                        setDepCheckInGroup={setDepCheckInGroup}
                        setRetCheckInGroup={setRetCheckInGroup}
                        setUpgradesPricePP={setUpgradesPricePP}
                        setDesUpgradesPricePP={setDesUpgradesPricePP}
                        setRetUpgradesPricePP={setRetUpgradesPricePP}
                        handlePageChange={handlePageChange}
                        handlePageChangeDepartures={handlePageChangeDepartures}
                        handlePageChangeReturns={handlePageChangeReturns}
                        handleFilterChange={handleFilterChange}
                        handleFilterChangeDepartures={handleFilterChangeDepartures}
                        handleFilterChangeReturns={handleFilterChangeReturns}
                        onFlightSelection={handleFlightSelection}
                        onRTFlightSelection={handleRTSelection}
                        onSortBy={handleSortByChange}
                        onReturnsSortBy={handleSortByChangeReturns}
                        onDeparturesSortBy={handleSortByChangeDepartures}
                        isRoundTrip={isRoundTrip}
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

Booking.propTypes = {
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

export default Booking;