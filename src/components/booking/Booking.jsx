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
    emailBookingDetails,
    updateBooking
} from "../../api/BookingApi";
import { createPassenger, deletePassenger, getTakenSeats } from "../../api/PassengerApi";
import { createPayment, deletePayment } from "../../api/PaymentService";
import FlightCard from "../flight-list/FlightCard";
import TripCard from "../flight-list/TripCard";
import FlightList from "../flight-list/FlightList";
import FlightSearch from "../flight-search/FlightSearch";
import PaymentForm from "../paymentForm/PaymentForm";
import mainImage from "./customer-ui-01.jpg";
import FlightTable from "./FlightTable";
import PassengerInfoForm from "./PassengerInfoForm";
import SeatChoice from "./SeatChoice";
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
    const [depPassengerInfo, setDepPassengerInfo] = useState({
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
    const [retPassengerInfo, setRetPassengerInfo] = useState({
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

    const [takenSeats, setTakenSeats] = useState([]);
    const [takenSeatsRet, setTakenSeatsRet] = useState([]);
    const [takenSeatsDep, setTakenSeatsDep] = useState([]);

    const seatChoiceMap = new Map();
    const pickSeat = (flight, seatNum) => {
        seatChoiceMap.set(flight.id, seatNum);
    };
    

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
    const [depSeats, setDepSeats] = useState([]);
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
    const [retSeats, setRetSeats] = useState([]);
    const [date, setDate] = useState(new Date());
    const [dateRange, setDateRange] = useState([
        new Date(),
        Date.now() + 6.048e8
    ]);
    const [startDate, endDate] = dateRange;
    const [origin, setOrigin] = useState("");
    const [dest, setDest] = useState("");
    const [sortBy, setSortBy] = useState("departureTime");
    const [departureSortBy, setDepartureSortBy] = useState("departureTime");
    const [returnSortBy, setReturnSortBy] = useState("departureTime");
    const [filter, setFilter] = useState("all");
    const [departureFilter, setDepartureFilter] = useState("all");
    const [returnFilter, setReturnFilter] = useState("all");

    const [trips, setTrips] = useState([]);
    const [selectedTrip, setSelectedTrip] = useState([]);
    const [leg1Seats, setLeg1Seats] = useState([]);
    const [leg2Seats, setLeg2Seats] = useState([]);
    const [leg3Seats, setLeg3Seats] = useState([]);

    const [depTrips, setDepTrips] = useState([]);
    const [selectedDepTrip, setSelectedDepTrip] = useState([]);
    const [depLeg1Seats, setDepLeg1Seats] = useState([]);
    const [depLeg2Seats, setDepLeg2Seats] = useState([]);
    const [depLeg3Seats, setDepLeg3Seats] = useState([]);

    const [retTrips, setRetTrips] = useState([]);
    const [selectedRetTrip, setSelectedRetTrip] = useState([]);
    const [retLeg1Seats, setRetLeg1Seats] = useState([]);
    const [retLeg2Seats, setRetLeg2Seats] = useState([]);
    const [retLeg3Seats, setRetLeg3Seats] = useState([]);

    // sets price of check-in group upgrade
    const [CIUPricePP, setCIUPricePP] = useState(0);
    const [desUpgradesPricePP, setDesUpgradesPricePP] = useState(0);
    const [retUpgradesPricePP, setRetUpgradesPricePP] = useState(0);

    // state variables check if a boarding group upgrade has already been applied
    const [hasBGUpgrade, setHasBgUpgrade] = useState(false);
    const [hasRetBGUpgrade, setHasRetBgUpgrade] = useState(false);
    const [hasDepBGUpgrade, setHasDepBgUpgrade] = useState(false);

    // seat choice

    const [SCUPricePP, setSCUPricePP] = useState(0);
    const [depSCUPricePP, setDepSCUPricePP] = useState(0);
    const [retSCUPricePP, setRetSCUPricePP] = useState(0);

    const [seatChoice, setSeatChoice] = useState(null);
    const [returnSeatChoice, setReturnSeatChoice] = useState(null);
    const [departureSeatChoice, setDepartureSeatChoice] = useState(null);

    // state variables check if a seat choice upgrade has been applied
    const [hasSeatChoiceUpgrade, setHasSeatChoiceUpgrade] = useState(false);
    const [hasRetSeatChoiceUpgrade, setHasRetSeatChoiceUpgrade] = useState(false);
    const [hasDepSeatChoiceUpgrade, setHasDepSeatChoiceUpgrade] = useState(false);

    // Callbacks
    const handleCIUpgrade = (upgradePrice) => {
        if (hasBGUpgrade !== true) {
            setCIUPricePP(upgradePrice);
            setHasBgUpgrade(true);
        }
    };

    const handleRetUpgrades = (upgradePrice) => {
        if (hasRetBGUpgrade !== true) {
            setCIUPricePP(upgradePrice);
            setHasRetBgUpgrade(true);
        }
    };

    const handleDepUpgrades = (upgradePrice) => {
        if (hasDepBGUpgrade !== true) {
            setCIUPricePP(upgradePrice);
            setHasDepBgUpgrade(true);
        }
    };

    const handleFlightSearch = (flights) => {
        setFlights(flights.content);
    };

    const handleFlightSelection = (selectedFlight, seatClass) => {
        setSelectedFlight(selectedFlight);
        setSeatClass(seatClass);

        switch (seatClass) {
            case SeatClass.ECONOMY:
                setCheckInGroup(3);
                let economyClassSeats = Array.from(Array(selectedFlight.airplane.economyClassSeatsMax), (x, index) => (index + selectedFlight.airplane.businessClassSeatsMax + selectedFlight.airplane.firstClassSeatsMax) + 1);

                getTakenSeats(selectedFlight.id)?.then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        economyClassSeats.splice(economyClassSeats.indexOf(result[i]), 1);
                    } 
                setTakenSeats(economyClassSeats);
                });
                break;
            case SeatClass.BUSINESS:
                setCheckInGroup(2);
                let businessClassSeats = Array.from(Array(selectedFlight.airplane.businessClassSeatsMax), (x, index) => (index + selectedFlight.airplane.firstClassSeatsMax) + 1);

                getTakenSeats(selectedFlight.id).then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        businessClassSeats.splice(businessClassSeats.indexOf(result[i]), 1);
                    } 
                setTakenSeats(businessClassSeats);
                });
                break;
            case SeatClass.FIRST:
                setCheckInGroup(1);
                let firstClassSeats = Array.from(Array(selectedFlight.airplane.firstClassSeatsMax), (x, index) => index + 1);

                getTakenSeats(selectedFlight.id).then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        firstClassSeats.splice(firstClassSeats.indexOf(result[i]), 1);
                    } 
                setTakenSeats(firstClassSeats);
                });
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

    const handleRTSelection = () => {
        calculateRTTripPrice(
            selectedDepTrip,
            departureClass,
            selectedRetTrip,
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

    const calculateTripPrice = (selectedTrip, seatClass) => {
        let pricePerPassenger;
        console.log(selectedTrip);
        switch (seatClass) {
            case SeatClass.ECONOMY:
                let i = 0;
                selectedTrip.map((flight) => {
                i+= flight.economyPrice;
                });
                console.log("i");
                console.log(i);
                let layoverDiscount1 = .1;
                let ecStops = selectedTrip.length - 1;
                let discountApplied1 = layoverDiscount1 * ecStops;
                let economyDisc = discountApplied1 * (i/selectedTrip.length);
                pricePerPassenger = (i/selectedTrip.length) - economyDisc;

                break;
            case SeatClass.BUSINESS:
                let j = 0;
                selectedTrip.map((flight) => {
                j+= flight.businessPrice;
                });
                let layoverDiscount2 = .1;
                let bizStops = selectedTrip.length - 1;
                let discountApplied2 = layoverDiscount2 * bizStops;
                let businessDisc = discountApplied2 * (i/selectedTrip.length);
                pricePerPassenger = (i/selectedTrip.length) - businessDisc;
                break;
            case SeatClass.FIRST:
                let k = 0;
                selectedTrip.map((flight) => {
                k+= flight.firstPrice;
                });
                let layoverDiscount3 = .1;
                let firstStops = selectedTrip.length - 1;
                let discountApplied3 = layoverDiscount3 * firstStops;
                let firstDisc = discountApplied3 * (i/selectedTrip.length);
                pricePerPassenger = (i/selectedTrip.length) - firstDisc;
                break;
            default:
                // TODO: Go to error page.
                break;
        }
        pricePerPassenger = Math.round(pricePerPassenger * 100) / 100;
        setPricePerPassengerState(pricePerPassenger);
        console.log(pricePerPassenger);
        const taxesPerPassenger =
            Math.round(pricePerPassenger * USA_TAX_RATE * 100) / 100;
        setTaxesPerPassenger(taxesPerPassenger);
        const totalPerPassenger = pricePerPassenger + taxesPerPassenger;
        setTotalPerPassenger(totalPerPassenger);
        // TODO: Allow creation of more than 1 passenger at a time.
        setTotalPrice(totalPerPassenger * passengerCount);
    };

    const calculateRTTripPrice = (
        departureTrip,
        departureseatClass,
        returnTrip,
        returnseatClass
    ) => {
        let departurePricePP = 0;
        let returnPricePP = 0;
        let pricePP = 0;

        switch (departureClass) {
            case SeatClass.ECONOMY:
                let i = 0;
                departureTrip.map((flight) => {
                i+= flight.economyPrice;
                });
                console.log(i);
                let layoverDiscount1 = .1;
                let ecStops = departureTrip.length - 1;
                let discountApplied1 = layoverDiscount1 * ecStops;
                let economyDisc = discountApplied1 * (i/departureTrip.length);
                departurePricePP = (i/departureTrip.length) - economyDisc;
                departurePricePP = Math.round(departurePricePP * 100) / 100;
                console.log("Departure Price PP w/i Switch:");
                console.log(departurePricePP);
                setDeparturePricePPState(departurePricePP);
                break;
            case SeatClass.BUSINESS:
                let j = 0;
                departureTrip.map((flight) => {
                j+= flight.businessPrice;
                });
                let layoverDiscount2 = .1;
                let bizStops = departureTrip.length - 1;
                let discountApplied2 = layoverDiscount2 * bizStops;
                let businessDisc = discountApplied2 * (i/departureTrip.length);
                departurePricePP = (i/departureTrip.length) - businessDisc;
                departurePricePP = Math.round(departurePricePP * 100) / 100;
                setDeparturePricePPState(departurePricePP);
                break;
            case SeatClass.FIRST:
                let k = 0;
                departureTrip.map((flight) => {
                k+= flight.firstPrice;
                });
                let layoverDiscount3 = .1;
                let firstStops = departureTrip.length - 1;
                let discountApplied3 = layoverDiscount3 * firstStops;
                let firstDisc = discountApplied3 * (i/departureTrip.length);
                departurePricePP = (i/departureTrip.length) - firstDisc;
                departurePricePP = Math.round(departurePricePP * 100) / 100;
                setDeparturePricePPState(departurePricePP);
                break;
            default:
                // TODO: Go to error page.
                break;
        }

        switch (returnClass) {
            case SeatClass.ECONOMY:
                let l = 0;
                returnTrip.map((flight) => {
                console.log(flight.economyPrice);
                l+= flight.economyPrice;
                });
                let layoverDiscount1 = .1;
                let ecStops = returnTrip.length - 1;
                let discountApplied1 = layoverDiscount1 * ecStops;
                let economyDisc = discountApplied1 * (l/returnTrip.length);
                returnPricePP = (l/returnTrip.length) - economyDisc;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            case SeatClass.BUSINESS:
                let m = 0;
                returnTrip.map((flight) => {
                m+= flight.businessPrice;
                });
                let layoverDiscount2 = .1;
                let bizStops = returnTrip.length - 1;
                let discountApplied2 = layoverDiscount2 * bizStops;
                let businessDisc = discountApplied2 * (m/returnTrip.length);
                returnPricePP = (m/returnTrip.length) - businessDisc;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            case SeatClass.FIRST:
                let n = 0;
                returnTrip.map((flight) => {
                n+= flight.firstPrice;
                });
                let layoverDiscount3 = .1;
                let firstStops = returnTrip.length - 1;
                let discountApplied3 = layoverDiscount3 * firstStops;
                let firstDisc = discountApplied3 * (n/returnTrip.length);
                returnPricePP = (n/returnTrip.length) - firstDisc;
                returnPricePP = Math.round(returnPricePP * 100) / 100;
                setReturnPricePPState(returnPricePP);
                break;
            default:
                // TODO: Go to error page.
                break;
        }


        let departureUpgradesPricePP = Math.round(desUpgradesPricePP * 100) / 100;
        let returnUpgradesPricePP = Math.round(retUpgradesPricePP * 100) / 100;

        pricePP =
            departurePricePP +
            departureUpgradesPricePP +
            returnPricePP +
            returnUpgradesPricePP;

        
        setDesUpgradesPricePP(departureUpgradesPricePP);
        setRetUpgradesPricePP(returnUpgradesPricePP);
        setRTPricePerPassengerState(pricePP);

        const departureTaxesPerPassenger =
            Math.round(
                (departurePricePP) * USA_TAX_RATE * 100
            ) / 100;
        setDepartureTaxesPP(departureTaxesPerPassenger);

        const returnTaxesPerPassenger =
            Math.round((returnPricePP) * USA_TAX_RATE * 100) /
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

    const seatsArray = [];

    const handleTripSelection = (selectedTrip, seatClass) => {
        setSelectedTrip(selectedTrip);
        setSeatClass(seatClass);

        switch (seatClass) {
            case SeatClass.ECONOMY:
                setCheckInGroup(3);
                selectedTrip.map((flight) => {
                    let economyClassSeats = Array.from(Array(flight.airplane.economyClassSeatsMax), (x, index) => (index + flight.airplane.businessClassSeatsMax + flight.airplane.firstClassSeatsMax) + 1);
    
                    getTakenSeats(flight.id)?.then(result => {
                        for(let i = 0; i <= result.length; i++) {
                            economyClassSeats.splice(economyClassSeats.indexOf(result[i]), 1);
                        } 
                        seatsArray.push(economyClassSeats);
                    }); 

                if(seatsArray.length === 1) {
                    setLeg1Seats(economyClassSeats);
                } else if(seatsArray.length === 2) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                } else if (seatsArray.length === 3) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                    setLeg3Seats(seatsArray[2]);
                } else {
                    // throw error
                    }
                });
                break;
            case SeatClass.BUSINESS:
                setCheckInGroup(2);
                selectedTrip.map((flight) => {
                    let businessClassSeats = Array.from(Array(flight.airplane.businessClassSeatsMax), (x, index) => (index + flight.airplane.firstClassSeatsMax) + 1);

                    getTakenSeats(flight.id)?.then(result => {
                        for(let i = 0; i <= result.length; i++) {
                            businessClassSeats.splice(businessClassSeats.indexOf(result[i]), 1);
                        } 
                })
                seatsArray.push(businessClassSeats);
                    });
                if(seatsArray.length === 1) {
                    setLeg1Seats(seatsArray[0]);
                } else if(seatsArray.length === 2) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                } else if (seatsArray.length === 3) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                    setLeg3Seats(seatsArray[2]);
                } else {
                    // throw error
                    }
                break;
            case SeatClass.FIRST:
                setCheckInGroup(1);
                selectedTrip.map((flight) => {
                let firstClassSeats = Array.from(Array(flight.airplane.firstClassSeatsMax), (x, index) => index + 1);

                getTakenSeats(flight.id)?.then(result => {
                    for(let i = 0; i <= result.length; i++) {
                        firstClassSeats.splice(firstClassSeats.indexOf(result[i]), 1);
                    } 
                    seatsArray.push(firstClassSeats);
                });
                if(seatsArray.length === 1) {
                    setLeg1Seats(seatsArray[0]);
                } else if(seatsArray.length === 2) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                } else if (seatsArray.length === 3) {
                    setLeg1Seats(seatsArray[0]);
                    setLeg2Seats(seatsArray[1]);
                    setLeg3Seats(seatsArray[2]);
                } else {
                    // throw error
                    }
                });
                break;
            default:
                // TODO: Go to error page.
                break;
        }

        calculateTripPrice(selectedTrip, seatClass);
        (async () => {
            const confirmationCode = uuidv4().toUpperCase();
            let layoverCount = selectedTrip.length > 2 ? selectedTrip.length - 2 : 0;
            setBookingToCreate({
                confirmationCode,
                layoverCount,
                username: userStatus.username
            });
            history.push(`${path}/passenger-info`);
        })();
    };

    const generateTripId = (tripObj) => {
        let tripId = '';
        for(let i in tripObj) {
            tripId += tripObj[i].route.originAirport.iataId + tripObj[i].id;
        }
        tripId += tripObj[tripObj.length-1].route.destinationAirport.iataId;
        return tripId;
    }

    const handleDepartureTripSelection = (selectedDTrip, seatClassInput) => {
        setSelectedDepTrip(selectedDTrip);
        setDepartureClass(seatClassInput);
        let selectedFlightCard = document.getElementById(generateTripId(selectedDTrip));
        let flightCards = document.getElementById("depFlightCards");
        let departureSort = document.getElementById("departure-sort");
        let departureFilter = document.getElementById("departure-filter");
        departureSort.style.display = "none";
        departureFilter.style.display = "none";
        flightCards.style.display = "none";
        setDepartureSelectionMade(true);
        (async () => {
            const confirmationCode = uuidv4().toUpperCase();
            const layoverCount = 0;
            setBookingToCreate({
                confirmationCode,
                layoverCount,
                username: userStatus.username
            });
        })();
    };

    const handleReturnTripSelection = (selectedRTrip, seatClassInput) => {
        setSelectedRetTrip(selectedRTrip);
        setReturnClass(seatClassInput);
        let selectedFlightCard = document.getElementById(generateTripId(selectedRTrip));
        let flightCards = document.getElementById("retFlightCards");
        let departureSort = document.getElementById("return-sort");
        let departureFilter = document.getElementById("return-filter");
        departureSort.style.display = "none";
        departureFilter.style.display = "none";
        flightCards.style.display = "none";
        setReturnSelectionMade(true);
        
        (async () => {
            const confirmationCode = uuidv4().toUpperCase();
            const layoverCount = 0;
            setBookingToCreate({
                confirmationCode,
                layoverCount,
                username: userStatus.username
            });
        })();
    };


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
                    `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/new-search?originId=${origin}&destinationId=${dest}`,
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
                        console.log('trips fetched:');
                        console.log(data);

                        setTrips(data);
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
        if (
            origin === "" ||
            dest === "" ||
            startDate === "" ||
            endDate === ""
        ) {
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
                    `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/new-search?originId=${origin}&destinationId=${dest}`,
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
                        setDepTrips(data);
                    })
                    .catch((error) => {
                        console.error(error);
                        alert(
                            "No departure flights found for this query, try again!"
                        );
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
                    `${process.env.REACT_APP_FLIGHT_SERVICE_URL}/flights/new-search?originId=${dest}&destinationId=${origin}`,
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
                        console.log(data);
                        setRetTrips(data);
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
        // TO DO: CREATE NEW ENDPOINT HERE
    };

    // Elements

    const flightTable = (
        <FlightTable
            selectedFlight={selectedFlight}
            selectedTrip={selectedTrip}
            selectedDepTrip={selectedDepTrip}
            selectedRetTrip={selectedRetTrip}
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
            CIUPricePP={CIUPricePP}
            desUpgradesPricePP={desUpgradesPricePP}
            retUpgradesPricePP={retUpgradesPricePP}
            setCIUPricePP={setCIUPricePP}
            retCheckInGroup={retCheckInGroup}
            depCheckInGroup={depCheckInGroup}
            seatChoice={seatChoice}
            setSeatChoice={setSeatChoice}
            returnSeatChoice={returnSeatChoice}
            setReturnSeatChoice={setReturnSeatChoice}
            departureSeatChoice={departureSeatChoice}
            setDepartureSeatChoice={setDepartureSeatChoice}
            hasSeatChoiceUpgrade={hasSeatChoiceUpgrade}
            setHasSeatChoiceUpgrade={setHasSeatChoiceUpgrade}
            hasRetSeatChoiceUpgrade={hasRetSeatChoiceUpgrade}
            setHasRetSeatChoiceUpgrade={setHasRetSeatChoiceUpgrade}
            hasDepSeatChoiceUpgrade={hasDepSeatChoiceUpgrade}
            setHasDepSeatChoiceUpgrade={setHasDepSeatChoiceUpgrade}
            takenSeats={takenSeats}
            takenSeatsDep={takenSeatsDep}
            takenSeatsRet={takenSeatsRet}
            retSeats={retSeats}
            depSeats={depSeats}
            SCUPricePP={SCUPricePP}
            setSCUPricePP={setSCUPricePP}
            depSCUPricePP={depSCUPricePP}
            setDepSCUPricePP={setDepSCUPricePP}
            retSCUPricePP={retSCUPricePP}
            setRetSCUPricePP={setRetSCUPricePP}
        />
    );

    const promise = loadStripe(
        process.env.REACT_APP_STRIPE_TEST_PUBLISHABLE_KEY
    );

    const tripCards = trips.map((trip) => (
        <TripCard
            key={generateTripId(trip)}
            trip={trip}
            onTripSelection={handleTripSelection}
            />
    ));


    const departureTripCards = depTrips.map((trip) => (
        <TripCard
            trip={trip}
            onTripSelection={handleDepartureTripSelection}
        />
    ));

    const returnTripCards = retTrips.map((trip) => (
        <TripCard
            trip={trip}
            onTripSelection={handleReturnTripSelection}
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
                    flightPage={flightPage}
                    tripCards={tripCards}
                    departureTripCards={departureTripCards}
                    returnTripCards={returnTripCards}
                    departureFlight={departureFlight}
                    returnFlight={returnFlight}
                    selectedDepTrip={selectedDepTrip}
                    selectedRetTrip={selectedRetTrip}
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
                    setCIUPricePP={setCIUPricePP}
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
