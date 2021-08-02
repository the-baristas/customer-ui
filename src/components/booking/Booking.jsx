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
import { searchFlights } from "../../api/FlightApi";
import { createPassenger, deletePassenger } from "../../api/PassengerApi";
import { createPayment, deletePayment } from "../../api/PaymentService";
import FlightCard from "../flight-list/FlightCard";
import FlightList from "../flight-list/FlightList";
import FlightSearch from "../flight-search/FlightSearch";
import PaymentForm from "../paymentForm/PaymentForm";
import mainImage from "./customer-ui-01.jpg";
import FlightTable from "./FlightTable";
import PassengerInfoForm from "./PassengerInfoForm";
import SeatClass from "./SeatClass";

const Booking = () => {
    // Constants

    const USA_TAX_RATE = 0.075;

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
    const [departureFlights, setDepartureFlights] = useState([]);
    const [returnFlights, setReturnFlights] = useState([]);
    const [flightPage, setFlightPage] = useState({});
    const [departureFlightPage, setDepartureFlightPage] = useState({});
    const [returnFlightPage, setReturnFlightPage] = useState({});
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
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(Date.now() + 6.048e8);
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");
    const [departureSortBy, setDepartureSortBy] = useState("departureTime");
    const [returnSortBy, setReturnSortBy] = useState("departureTime");
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

    // Callbacks

    const handleUpgrades = (upgradePrice) => {
        if (hasBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasBgUpgrade(true);
        }
    };

    const handleRetUpgrades = (upgradePrice) => {
        if (hasRetBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasRetBgUpgrade(true);
        }
    };

    const handleDepUpgrades = (upgradePrice) => {
        if (hasDepBGUpgrade !== true) {
            setUpgradesPricePP(upgradePrice);
            setHasDepBgUpgrade(true);
        }
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setDepartureFlight(selectedFlight);
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
        let selectedFlightCard = document.getElementById(
            "fc" + selectedFlight.id
        );
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
        let selectedFlightCard = document.getElementById(
            "fc" + selectedFlight.id
        );
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
        calculateRTPrice(
            departureFlight,
            departureClass,
            returnFlight,
            returnClass
        );
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
            Math.round(pricePerPassenger * USA_TAX_RATE * 100) / 100;
        setTaxesPerPassenger(taxesPerPassenger);
        const totalPerPassenger = pricePerPassenger + taxesPerPassenger;
        setTotalPerPassenger(totalPerPassenger);
        // TODO: Allow creation of more than 1 passenger at a time.
        setTotalPrice(totalPerPassenger * passengerCount);
    };

    const calculateRTPrice = (
        departureFlight,
        departureClass,
        returnFlight,
        returnClass
    ) => {
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
        let departureUpgradesPricePP =
            Math.round(desUpgradesPricePP * 100) / 100;
        returnPricePP = Math.round(returnPricePP * 100) / 100;
        let returnUpgradesPricePP = Math.round(retUpgradesPricePP * 100) / 100;

        pricePP =
            departurePricePP +
            departureUpgradesPricePP +
            returnPricePP +
            returnUpgradesPricePP;

        setDeparturePricePPState(departurePricePP);
        setDesUpgradesPricePP(departureUpgradesPricePP);
        setReturnPricePPState(returnPricePP);
        setRetUpgradesPricePP(returnUpgradesPricePP);
        setRTPricePerPassengerState(pricePP);

        const departureTaxesPerPassenger =
            Math.round(
                (departurePricePP + returnUpgradesPricePP) * USA_TAX_RATE * 100
            ) / 100;
        setDepartureTaxesPP(departureTaxesPerPassenger);

        const returnTaxesPerPassenger =
            Math.round((returnPricePP + returnPricePP) * USA_TAX_RATE * 100) /
            100;
        setReturnTaxesPP(returnTaxesPerPassenger);

        const totalTaxesPP =
            departureTaxesPerPassenger + returnTaxesPerPassenger;

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
        const newSortBy = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: newSortBy,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: departureFilter
        })
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlights(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });

        setDepartureFilter(newSortBy);
    }

    function handleSortByChangeDepartures(event) {
        const newSortBy = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: newSortBy,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: departureFilter
        })
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });

        setDepartureSortBy(newSortBy);
    }

    function handleSortByChangeReturns(event) {
        const newSortBy = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: newSortBy,
            month: endDate.getMonth() + 1,
            date: endDate.getDate(),
            year: endDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: returnFilter
        })
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });

        setReturnSortBy(newSortBy);
    }

    function handleFilterChange(event) {
        const newFilter = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: departureSortBy,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: newFilter
        })
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });

        setDepartureFilter(newFilter);
    }

    function handleFilterChangeDepartures(event) {
        const newFilter = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: departureSortBy,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: newFilter
        })
            .then((data) => {
                setDepartureFlights(data.content);
                setDepartureFlightPage(data);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });

        setDepartureFilter(newFilter);
    }

    function handleFilterChangeReturns(event) {
        const newFilter = event.target.value;
        searchFlights({
            origin,
            dest,
            sortBy: returnSortBy,
            month: endDate.getMonth() + 1,
            date: endDate.getDate(),
            year: endDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter: newFilter
        }).then((data) => {
            setDepartureFlights(data.content);
            setDepartureFlightPage(data);
        });

        setDepartureFilter(event.target.value);
    }

    function handleFlightSearchSubmit({
        roundTrip,
        origin,
        destination,
        startDate,
        endDate
    }) {
        trackPromise(
            searchFlights({
                origin,
                dest,
                sortBy: departureSortBy,
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
                year: startDate.getFullYear(),
                filter: departureFilter
            })
                .then((data) => {
                    setDepartureFlights(data.content);
                    setDepartureFlightPage(data);
                    if (!roundTrip) {
                        history.push("/booking/search-results");
                    }
                })
                .catch((error) => {
                    console.error(error);
                    alert(
                        "No departure flights found for this query, try again!"
                    );
                })
        );

        if (roundTrip) {
            trackPromise(
                searchFlights({
                    dest,
                    origin,
                    sortBy: returnSortBy,
                    month: endDate.getMonth() + 1,
                    date: endDate.getDate(),
                    year: endDate.getFullYear(),
                    filter: returnFilter
                })
                    .then((data) => {
                        setReturnFlights(data.content);
                        setReturnFlightPage(data);
                        history.push("/booking/search-results");
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(
                            "No return flights found for this query, try again or consider purchasing a one way ticket!"
                        );
                    })
            );
        }

        setIsRoundTrip(roundTrip);
        setOrigin(origin);
        setDest(destination);
        setStartDate(startDate);
        setEndDate(endDate);
    }

    function handlePageChange(newPage) {
        trackPromise(
            searchFlights({
                origin,
                dest,
                newPage,
                sortBy: departureSortBy,
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
                year: startDate.getFullYear(),
                filter: departureFilter
            })
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

    function handlePageChangeReturns(newPage) {
        trackPromise(
            searchFlights({
                origin,
                dest,
                newPage,
                sortBy: departureSortBy,
                month: endDate.getMonth() + 1,
                date: endDate.getDate(),
                year: endDate.getFullYear(),
                filter: departureFilter
            })
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
        trackPromise(
            searchFlights({
                origin,
                dest,
                newPage,
                sortBy: departureSortBy,
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
                year: startDate.getFullYear(),
                filter: departureFilter
            })
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
            } catch (error) {
                console.error(error);
                // TODO: Cancel stripe payment.
                return;
            }

            let payment;
            try {
                payment = await createPayment(clientSecret, newBooking.id);
            } catch (error) {
                console.error(error);
                await deleteBooking(newBooking.id);
                // TODO: Cancel stripe payment.
                return;
            }

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

            const address = `${passengerInfo.streetAddress} ${passengerInfo.city} ${passengerInfo.state} ${passengerInfo.zipCode}`;
            let newPassengerInfo;
            if (isRoundTrip === false) {
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
                        seatClass: seatClass,
                        // TODO: Allow user to choose seat.
                        seatNumber: 1,
                        // TODO: Create a seat class to check-in group map.
                        checkInGroup: checkInGroup
                    });
                    setPassengerInfo(newPassengerInfo);
                } catch (error) {
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
                } catch (error) {
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
                } catch (error) {
                    // TODO: Delete payment.
                    await deleteBooking(newBooking.id);
                    // TODO: Cancel stripe payment.
                    return;
                }

                const rtTotalPerPassenger =
                    RTPricePerPassengerState + departureTaxesPP + returnTaxesPP;
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
            } catch (error) {
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

    // FIXME
    const stripePromise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );

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
        <Switch>
            <Route exact path={path}>
                <Image
                    src={mainImage}
                    className="img-bg"
                    aria-label="main image"
                />
                <FlightSearch
                    onFlightSearchSubmit={handleFlightSearchSubmit}
                ></FlightSearch>
            </Route>
            <Route path={`${path}/search-results`}>
                <FlightList
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
                <Elements stripe={stripePromise}>
                    <PaymentForm
                        totalDollars={totalPrice}
                        onPaymentCreation={handlePaymentCreation}
                    />
                </Elements>
            </Route>
        </Switch>
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
