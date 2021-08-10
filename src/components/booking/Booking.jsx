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
    const [departingFlightPassengerInfo, setDepartingFlightPassengerInfo] =
        useState({
            id: 0,
            givenName: "",
            familyName: "",
            dateOfBirth: "",
            gender: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            seatClass: "",
            seatNumber: 0,
            checkInGroup: 0
        });
    // TODO: Set returning ticket's info. It's different from the departing one.
    const [returningFlightPassengerInfo, setReturningFlightPassengerInfo] =
        useState({
            id: 0,
            givenName: "",
            familyName: "",
            dateOfBirth: "",
            gender: "",
            streetAddress: "",
            city: "",
            state: "",
            zipCode: "",
            seatClass: "",
            seatNumber: 0,
            checkInGroup: 0
        });
    const [departingFlightClass, setDepartingFlightClass] = useState("economy");
    const [returningFlightClass, setReturningFlightClass] = useState("economy");
    const [departingFlightCheckInGroup, setDepCheckInGroup] = useState(3);
    const [returningFlightCheckInGroup, setRetCheckInGroup] = useState(3);
    const [isRoundTrip, setIsRoundTrip] = useState(false);
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
    const [departingFlights, setDepartingFlights] = useState([]);
    const [returningFlights, setReturnFlights] = useState([]);
    const [departingFlightsPagesCount, setDepartingFlightsPagesCount] =
        useState(0);
    const [returningFlightsPagesCount, setReturningFlightsPagesCount] =
        useState(0);
    const [selectedDepartingFlight, setSelectedDepartingFlight] = useState({
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
        route: {
            originAirport: {
                city: "",
                iataId: ""
            },
            destinationAirport: {
                city: "",
                iataId: ""
            }
        }
    });
    const [selectedReturningFlight, setSelectedReturningFlight] = useState({
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
        route: {
            originAirport: {
                city: "",
                iataId: ""
            },
            destinationAirport: {
                city: "",
                iataId: ""
            }
        }
    });
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(Date.now() + 6.048e8);
    const [origin, setOrigin] = useState("");
    const [destination, setDestination] = useState("");
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

    const handleOneWayTripContinue = (
        selectedFlight,
        seatClass,
        checkInGroup,
        additionalCost
    ) => {
        // calculateTotalPrice(selectedFlight, seatClass);

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

        setSelectedDepartingFlight(selectedFlight);
        setDepartingFlightClass(seatClass);
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

    // const handleDepartingFlightSelection = (selectedFlight, seatClass) => {
    //     let selectedFlightCard = document.getElementById(
    //         "fc" + selectedFlight.id
    //     );
    //     let flightCards = document.getElementById("depFlightCards");
    //     let departureSort = document.getElementById("departure-sort");
    //     let departureFilter = document.getElementById("departure-filter");
    //     departureSort.style.display = "none";
    //     departureFilter.style.display = "none";
    //     flightCards.style.display = "none";
    //     setDepartureSelectionMade(true);
    //     let depPricePP;
    //     switch (seatClass) {
    //         case SeatClass.ECONOMY:
    //             setDepCheckInGroup(3);
    //             depPricePP = selectedFlight.economyPrice;
    //             depPricePP = Math.round(depPricePP * 100) / 100;
    //             setDeparturePricePPState(depPricePP);
    //             break;
    //         case SeatClass.BUSINESS:
    //             setDepCheckInGroup(2);
    //             depPricePP = selectedFlight.businessPrice;
    //             depPricePP = Math.round(depPricePP * 100) / 100;
    //             setDeparturePricePPState(depPricePP);
    //             break;
    //         case SeatClass.FIRST:
    //             setDepCheckInGroup(1);
    //             depPricePP = selectedFlight.firstPrice;
    //             depPricePP = Math.round(depPricePP * 100) / 100;
    //             setDeparturePricePPState(depPricePP);
    //             break;
    //         default:
    //             // TODO: Go to error page.
    //             break;
    //     }

    //     setSelectedDepartingFlight(selectedFlight);
    //     setDepartingFlightClass(seatClass);
    // };

    // const handleReturningFlightSelection = (selectedFlight, seatClass) => {
    //     setSelectedReturningFlight(selectedFlight);
    //     setReturningFlightClass(seatClass);
    //     let selectedFlightCard = document.getElementById(
    //         "fc" + selectedFlight.id
    //     );
    //     let flightCards = document.getElementById("retFlightCards");
    //     let returnSort = document.getElementById("return-sort");
    //     let returnFilter = document.getElementById("return-filter");
    //     returnSort.style.display = "none";
    //     returnFilter.style.display = "none";
    //     flightCards.style.display = "none";
    //     let returnPricePP;

    //     setReturnSelectionMade(true);
    //     switch (seatClass) {
    //         case SeatClass.ECONOMY:
    //             setRetCheckInGroup(3);
    //             returnPricePP = selectedFlight.economyPrice;
    //             returnPricePP = Math.round(returnPricePP * 100) / 100;
    //             setReturnPricePPState(returnPricePP);
    //             break;
    //         case SeatClass.BUSINESS:
    //             setRetCheckInGroup(2);
    //             returnPricePP = selectedFlight.businessPrice;
    //             returnPricePP = Math.round(returnPricePP * 100) / 100;
    //             setReturnPricePPState(returnPricePP);
    //             break;
    //         case SeatClass.FIRST:
    //             setRetCheckInGroup(1);
    //             returnPricePP = selectedFlight.firstPrice;
    //             returnPricePP = Math.round(returnPricePP * 100) / 100;
    //             setReturnPricePPState(returnPricePP);
    //             break;
    //         default:
    //             // TODO: Go to error page.
    //             break;
    //     }
    // };

    const handleRoundTripContinue = () => {
        calculateRTPrice(
            selectedDepartingFlight,
            departingFlightClass,
            selectedReturningFlight,
            returningFlightClass
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

    // TODO: Add handler for returning flight.
    const handlePassengerInfoSubmit = (passengerInfo) => {
        setDepartingFlightPassengerInfo(passengerInfo);
        history.push(`${path}/checkout`);
    };

    function handleDepartingFlightsSortChange(pageNumber, sort, filter) {
        searchFlights({
            origin,
            dest: destination,
            newPage: pageNumber - 1,
            sortBy: sort,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter
        })
            .then((data) => {
                setDepartingFlights(data.content);
                setDepartingFlightsPagesCount(data.totalPages);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleReturningFlightsSortChange(pageNumber, sort, filter) {
        searchFlights({
            origin,
            dest: destination,
            newPage: pageNumber - 1,
            sortBy: sort,
            month: endDate.getMonth() + 1,
            date: endDate.getDate(),
            year: endDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter
        })
            .then((data) => {
                setDepartingFlights(data.content);
                setDepartingFlightsPagesCount(data.totalPages);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleDepartingFlightsFilterChange(pageNumber, sort, filter) {
        searchFlights({
            origin,
            dest: destination,
            newPage: pageNumber - 1,
            sortBy: sort,
            month: startDate.getMonth() + 1,
            date: startDate.getDate(),
            year: startDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter
        })
            .then((data) => {
                setDepartingFlights(data.content);
                setDepartingFlightsPagesCount(data.totalPages);
            })
            .catch((error) => {
                console.error(error);
                alert("No flights found, try again!");
            });
    }

    function handleReturningFlightsFilterChange(pageNumber, sort, filter) {
        searchFlights({
            origin,
            dest: destination,
            newPage: pageNumber - 1,
            sortBy: sort,
            month: endDate.getMonth() + 1,
            date: endDate.getDate(),
            year: endDate.getFullYear(),
            hours: 0,
            mins: 0,
            filter
        }).then((data) => {
            setReturnFlights(data.content);
            setReturningFlightsPagesCount(data.totalPages);
        });
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
                dest: destination,
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
                year: startDate.getFullYear()
            })
                .then((data) => {
                    setDepartingFlights(data.content);
                    setDepartingFlightsPagesCount(data.totalPages);
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
                    dest: destination,
                    origin,
                    month: endDate.getMonth() + 1,
                    date: endDate.getDate(),
                    year: endDate.getFullYear()
                })
                    .then((data) => {
                        setReturnFlights(data.content);
                        setReturningFlightsPagesCount(data.totalPages);
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
        setDestination(destination);
        setStartDate(startDate);
        setEndDate(endDate);
    }

    function handleDepartingFlightsPageChange(pageNumber, sort, filter) {
        trackPromise(
            searchFlights({
                origin,
                dest: destination,
                newPage: pageNumber - 1,
                sortBy: sort,
                month: startDate.getMonth() + 1,
                date: startDate.getDate(),
                year: startDate.getFullYear(),
                filter: filter
            })
                .then((data) => {
                    setDepartingFlights(data.content);
                    setDepartingFlightsPagesCount(data.totalPages);
                })
                .catch((error) => {
                    console.error(error);
                    alert("No flights found, try again!");
                })
        );
    }

    function handleReturningFlightsPageChange(pageNumber, sort, filter) {
        trackPromise(
            searchFlights({
                origin,
                dest: destination,
                newPage: pageNumber - 1,
                sortBy: sort,
                month: endDate.getMonth() + 1,
                date: endDate.getDate(),
                year: endDate.getFullYear(),
                filter
            })
                .then((data) => {
                    setReturnFlights(data.content);
                    setReturningFlightsPagesCount(data.totalPages);
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

            const address = `${departingFlightPassengerInfo.streetAddress} ${departingFlightPassengerInfo.city} ${departingFlightPassengerInfo.state} ${departingFlightPassengerInfo.zipCode}`;
            let newPassengerInfo;
            if (isRoundTrip === false) {
                try {
                    newPassengerInfo = await createPassenger({
                        bookingConfirmationCode: newBooking.confirmationCode,
                        originAirportCode:
                            selectedDepartingFlight.route.originAirport.iataId,
                        destinationAirportCode:
                            selectedDepartingFlight.route.destinationAirport
                                .iataId,
                        airplaneModel: selectedDepartingFlight.airplane.model,
                        departureTime: selectedDepartingFlight.departureTime,
                        arrivalTime: selectedDepartingFlight.arrivalTime,
                        givenName: departingFlightPassengerInfo.givenName,
                        familyName: departingFlightPassengerInfo.familyName,
                        dateOfBirth: departingFlightPassengerInfo.dateOfBirth,
                        gender: departingFlightPassengerInfo.gender,
                        address,
                        seatClass: departingFlightClass,
                        // TODO: Allow user to choose seat.
                        seatNumber: 1,
                        // TODO: Create a seat class to check-in group map.
                        checkInGroup: departingFlightCheckInGroup
                    });
                    setDepartingFlightPassengerInfo(newPassengerInfo);
                } catch (error) {
                    // TODO: Delete payment.
                    await deleteBooking(newBooking.id);
                    // TODO: Cancel stripe payment.
                    return;
                }
            } else {
                switch (departingFlightClass) {
                    case departingFlightClass.ECONOMY:
                        setDepCheckInGroup(3);
                        break;
                    case departingFlightClass.BUSINESS:
                        setDepCheckInGroup(2);
                        break;
                    case departingFlightClass.FIRST:
                        setDepCheckInGroup(1);
                        break;
                    default:
                        // TODO: Go to error page.
                        break;
                }

                switch (returningFlightClass) {
                    case returningFlightClass.ECONOMY:
                        setRetCheckInGroup(3);
                        break;
                    case returningFlightClass.BUSINESS:
                        setRetCheckInGroup(2);
                        break;
                    case returningFlightClass.FIRST:
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
                            selectedDepartingFlight.route.originAirport.iataId,
                        destinationAirportCode:
                            selectedDepartingFlight.route.destinationAirport
                                .iataId,
                        airplaneModel: selectedDepartingFlight.airplane.model,
                        departureTime: selectedDepartingFlight.departureTime,
                        arrivalTime: selectedDepartingFlight.arrivalTime,
                        givenName: departingFlightPassengerInfo.givenName,
                        familyName: departingFlightPassengerInfo.familyName,
                        dateOfBirth: departingFlightPassengerInfo.dateOfBirth,
                        gender: departingFlightPassengerInfo.gender,
                        address,
                        seatClass: departingFlightClass,
                        // TODO: Allow user to choose seat.
                        seatNumber: 1,
                        // TODO: Create a seat class to check-in group map.
                        checkInGroup: departingFlightCheckInGroup
                    });
                    setDepartingFlightPassengerInfo(newPassengerInfo);
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
                            selectedReturningFlight.route.originAirport.iataId,
                        destinationAirportCode:
                            selectedReturningFlight.route.destinationAirport
                                .iataId,
                        airplaneModel: selectedReturningFlight.airplane.model,
                        departureTime: selectedReturningFlight.departureTime,
                        arrivalTime: selectedReturningFlight.arrivalTime,
                        givenName: returningFlightPassengerInfo.givenName,
                        familyName: returningFlightPassengerInfo.familyName,
                        dateOfBirth: returningFlightPassengerInfo.dateOfBirth,
                        gender: returningFlightPassengerInfo.gender,
                        address,
                        seatClass: returningFlightClass,
                        // TODO: Allow user to choose seat.
                        seatNumber: 1,
                        // TODO: Create a seat class to check-in group map.
                        checkInGroup: returningFlightCheckInGroup
                    });
                    setDepartingFlightPassengerInfo(newPassengerInfo);
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
            isRoundTrip={isRoundTrip}
            departureClass={departingFlightClass}
            returnClass={returningFlightClass}
            pricePerPassenger={pricePerPassengerState}
            departurePricePP={departurePricePPState}
            returnPricePP={returnPricePPState}
            rtPricePerPassenger={RTPricePerPassengerState}
            taxesPerPassenger={taxesPerPassenger}
            departureTaxesPP={departureTaxesPP}
            returnTaxesPP={returnTaxesPP}
            passengerCount={passengerCount}
            upgradesPricePP={upgradesPricePP}
            desUpgradesPricePP={desUpgradesPricePP}
            retUpgradesPricePP={retUpgradesPricePP}
            setUpgradesPricePP={setUpgradesPricePP}
            retCheckInGroup={returningFlightCheckInGroup}
            depCheckInGroup={departingFlightCheckInGroup}
            selectedDepartingFlight={selectedDepartingFlight}
            selectedReturningFlight={selectedReturningFlight}
        />
    );

    // FIXME
    const stripePromise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );

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
                    isRoundTrip={isRoundTrip}
                    departingFlightTotalPages={departingFlightsPagesCount}
                    returningFlightTotalPages={returningFlightsPagesCount}
                    departingFlights={departingFlights}
                    returningFlights={returningFlights}
                    oneDepartingFlightsPageChange={
                        handleDepartingFlightsPageChange
                    }
                    onReturningFlightsPageChange={
                        handleReturningFlightsPageChange
                    }
                    onDepartingFlightsFilterChange={
                        handleDepartingFlightsFilterChange
                    }
                    onReturningFlightFilterChange={
                        handleReturningFlightsFilterChange
                    }
                    onReturningFlightsSortChange={
                        handleReturningFlightsSortChange
                    }
                    onDepartingFlightsSortChange={
                        handleDepartingFlightsSortChange
                    }
                    onOneWayTripContinue={handleOneWayTripContinue}
                    onRoundTripContinue={handleRoundTripContinue}
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
    date: PropTypes.object,
    origin: PropTypes.string,
    dest: PropTypes.string
};

export default Booking;
