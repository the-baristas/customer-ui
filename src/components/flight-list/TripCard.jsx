import moment from 'moment';
import React, {useState, useEffect} from 'react';
import { Card } from 'react-bootstrap';
import Button from 'react-bootstrap/Button';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import ListGroupItem from 'react-bootstrap/ListGroupItem';
import SeatClass from "../booking/SeatClass";
import './FlightCard.css';
import Pagination from 'react-bootstrap/Pagination';
import { faPlane } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Timeline } from 'antd';
import * as airportTimezone from 'airport-timezone'

const TripCard = (props) => {

    const {trip, onTripSelection} = props;
    const [flight1, setFlight1] = useState({});
    const [flight2, setFlight2] = useState({});
    const [flight3, setFlight3] = useState({});
    const [lastFlight, setLastFlight] = useState(trip[trip.length-1]);

    const [tripPriceE, setTripPriceE] = useState('');
    const [tripPriceB, setTripPriceB] = useState('');
    const [tripPriceF, setTripPriceF] = useState('');

    const [loaded, setLoaded] = useState(false);
    const [displayTripDetails, setDisplayTripDetails] = useState(false);

    useEffect(() => {
        let i = 0, j = 0, k = 0;

        trip.map((flight) => {
            i+= flight.economyPrice;
            j+=flight.businessPrice;
            k+=flight.firstPrice;
        });
        
        let layoverDiscount = .1;
        let stops = trip.length - 1;
        let discountApplied = layoverDiscount * stops;

        let economyDisc = discountApplied * (i/trip.length);
        let businessDisc = discountApplied * (j/trip.length);
        let firstDisc = discountApplied * (k/trip.length);

        let ePrice = (i/trip.length) - economyDisc;
        let bPrice = (j/trip.length) - businessDisc;
        let fPrice = (k/trip.length) - firstDisc;
        setTripPriceE(ePrice);
        setTripPriceB(bPrice);
        setTripPriceF(fPrice);
    }, []);

    useEffect(() => {
        setFlight1(trip[0]);
        if(trip.length > 1) {
            setFlight2(trip[1]);
        }
        
        if(trip.length > 2) {
            setFlight3(trip[2]);
        }
        setLoaded(true);
    }, []);

    const handleClick = (e, seatClass) => {
        onTripSelection(trip, seatClass);
    };

    const calculateTripDuration = (trip) => {
        let totalDurationMinutes = 0;

        for(let i = 0; i < trip.length; i++) {
            totalDurationMinutes += calculateFlightDuration(trip[i]) ;
        } 
        return totalDurationMinutes;
    }

    const calculateFlightDuration = (flight) => {
        let originAirportTimezoneInfo = airportTimezone.default.filter((airport) => {return airport.code === flight.route.originAirport.iataId})[0];
        let destinationAirportTimezoneInfo = airportTimezone.default.filter((airport) => {return airport.code === flight.route.destinationAirport.iataId})[0];

        //This is the duration between the arrival and departure times without considering timezones
        let rawDuration = moment.duration(moment(flight.arrivalTime).diff(flight.departureTime));
        console.log(flight);
        console.log("Raw Duration hours: " + rawDuration.asHours())
        console.log("Duration with timezones: " + rawDuration.add( (destinationAirportTimezoneInfo.offset.gmt - originAirportTimezoneInfo.offset.gmt), 'hours').asHours())
        return rawDuration.add( (destinationAirportTimezoneInfo.offset.gmt - originAirportTimezoneInfo.offset.gmt), 'hours').asMinutes();

    }

    const duration = calculateTripDuration(trip);
    const durationHours = Math.floor(duration / 60);
    const durationMinutes = calculateTripDuration(trip);

    const getAllFlightsButLast = (value, index, array) => {
        return index !== trip.length-1;
    }

    const generateTripId = (tripObj) => {
        let tripId = '';
        for(let i in tripObj) {
            tripId += tripObj[i].route.originAirport.iataId + tripObj[i].id;
        }
        tripId += tripObj[tripObj.length-1].route.destinationAirport.iataId;
        return tripId;
    }

    return(
        <div className="flight-card-component" id={generateTripId(trip)}>

{loaded && <Row className="flight-card">
            <Col xs={12} lg={2}>
            <Row className="origin-airport">
            { flight1.route.originAirport.city } ({ flight1.route.originAirport.iataId })
            </Row>
            <Row className="departure-time">
            { moment(flight1.departureTime).format('h:mm a') }
            </Row>
            <Row className="departure-date">
            { moment(flight1.departureTime).format('MMMM Do, YYYY') }
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="duration">
            {durationHours} hr {durationMinutes} min 
            </Row>
            <Row className="duration-icon">
            <FontAwesomeIcon icon={faPlane} />
            </Row>
            <Row className="duration">
            { trip.length === 2 && <Button variant="link" className="just-link" onClick={() => setDisplayTripDetails(true)}>{trip.length-1 } stop</Button>}
            { trip.length > 2 && <Button variant="link" className="just-link" onClick={() => setDisplayTripDetails(true)}>{trip.length-1} stops</Button>}
            { trip.length === 1 && <>Non-stop</>}
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="dest-airport">
            { lastFlight.route.destinationAirport.city }
            </Row>
            <Row className="arrival-time">
            { moment(lastFlight.arrivalTime).format('h:mm a') }
            </Row>
            <Row className="arrival-date">
            { moment(lastFlight.arrivalTime).format('MMMM Do, YYYY') }
            </Row>
            </Col>


            <Col xs={12} lg={2}>
            <Row className="b-e">
            Economy
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.ECONOMY)}>${Math.floor(tripPriceE)}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-b">
            Business
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.BUSINESS)}>${Math.floor(tripPriceB)}</Button>
            </Row>
            </Col>

            <Col xs={12} lg={2}>
            <Row className="b-f">
            First
            </Row>
            <Row className="book-rc">
            <Button className="book-button" onClick={(e) => handleClick(e, SeatClass.FIRST)}>${Math.floor(tripPriceF)}</Button>
            </Row>
            </Col>

       { displayTripDetails && 
       <Row>
           <Col xs={12} lg={2}>
               <br />
               <h2>itinerary:</h2>
           </Col>

           <Col xs={12} lg={2}>
            <Timeline mode="left">
                <Timeline.Item>
                    {flight1.route.originAirport.city + " (" + flight1.route.originAirport.iataId + ")"}<br />
                </Timeline.Item>
            { trip.filter(getAllFlightsButLast).map((flight) => {
            return <Timeline.Item label={moment(flight.arrivalTime).format('h:mm A')}>
                <small>{moment.duration(moment(trip[trip.indexOf(flight) + 1].departureTime).diff(flight.arrivalTime)).asHours()} hour layover</small><br />
                {flight.route.destinationAirport.city + " (" + flight.route.destinationAirport.iataId + ")"}
                </Timeline.Item>
            })
            }
            <Timeline.Item label={moment(trip[trip.length-1].arrivalTime).format('h:mm A')}>
            {trip[trip.length-1].route.destinationAirport.city + " (" + trip[trip.length-1].route.destinationAirport.iataId + ")"}<br />
            </Timeline.Item>
            </Timeline>
           </Col>
           <br />
            <Button variant="link" onClick={() => setDisplayTripDetails(false)} className="just-link">Close Itinerary</Button>
            </Row>
            }     
</Row>
}

        </div>
    );
}

export default TripCard;