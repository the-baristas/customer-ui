import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import mainImage from './customer-ui-01.jpg';
import FlightSearch from '../flight-search/FlightSearch';
import FlightList from '../flight-list/FlightList';
import Checkout from '../checkout/Checkout';
import PassengerInfoForm from '../passenger-info-form/PassengerInfoForm';
import { useState } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';

const Home = () => {

    const userStatus = useSelector((state) => state.userStatus);
    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);
    const [selectedFlight, setSelectedFlight] = useState({});
    const [flights, setFlights] = useState([]);

    const handleFlightSelection = (flight) => {
        setSelectedFlight(flight);
    };

    const handleFlightSearch = (flights) => {
        setFlights(flights);
    };

    return ( 
        <div>

{userLoggedIn && <h1>Welcome {userStatus.username}</h1>}
            <div>
                <Router>
                <Switch>
                    <Route exact path="/">
                        <Image src={mainImage} fluid />
                        <FlightSearch
                            onFlightSearch={handleFlightSearch}
                        ></FlightSearch>
                    </Route>
                    <Route path="/search-results">
                        <FlightList
                            flights={flights}
                            onFlightSelection={handleFlightSelection}
                        />
                    </Route>
                </Switch>
                </Router>
            </div>

        </div>
     );
}
 
export default Home;