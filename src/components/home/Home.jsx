import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import mainImage from './customer-ui-01.jpg';
import FlightSearch from '../flight-search/FlightSearch';
import FlightList from '../flight-list/FlightList';
import Checkout from '../checkout/Checkout';
import PassengerInfoForm from '../passenger-info-form/PassengerInfoForm';
import { useState } from 'react';
import {BrowserRouter as Router, Route, Switch, Link} from 'react-router-dom';
import { useHistory } from 'react-router-dom';

const Home = () => {

    const userStatus = useSelector((state) => state.userStatus);
    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);
    const [selectedFlight, setSelectedFlight] = useState({});

    const [sortBy, setSortBy] = useState('departureTime');

    const [flights, setFlights] = useState([]);

    const handleFlightSelection = (flight) => {
        setSelectedFlight(flight);
    };

    const handleFlightSearch = (flights) => {
        setFlights(flights.content);
    };

    function handleSortByChange(event) {
        setSortBy(event.target.value);

        let theMonth = date.getMonth() + 1;
        let theDate = date.getDate();
        let theYear = date.getFullYear();

        fetch(`http://localhost:8090/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=${sortBy}`, {
        method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem('utopiaCustomerKey') },
                body: JSON.stringify({month: theMonth, date: theDate, year: theYear})
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                setFlights(data.content);
                history.push('/booking/search-results');
            })
            .catch(error => {
                console.log(error);
                alert("No flights found, try again!");
            })
    
        }

    // ---

    const [date, setDate] = useState(new Date());
    const [origin, setOrigin] = useState('');
    const [dest, setDest] = useState('');
    const [results, setResults] = useState([]);

    const history = useHistory();

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
        if (origin === '' || dest === '' || date === '') {
            alert ('Please make sure all search fields are completed.');
        } else {
            
            let theMonth = date.getMonth() + 1;
            let theDate = date.getDate();
            let theYear = date.getFullYear();
            
            fetch(`http://localhost:8090/flights/query?originId=${origin}&destinationId=${dest}&pageNo=0&pageSize=10&sortBy=economyPrice`, {
                method: "POST",
                headers: {"Content-Type": "application/json", "Authorization": localStorage.getItem('utopiaCustomerKey') },
                body: JSON.stringify({month: theMonth, date: theDate, year: theYear})
            })
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                setFlights(data.content);
                history.push('/booking/search-results');
            })
            .catch(error => {
                console.log(error);
                alert("No flights found, try again!");
            })
        }
    
    }

    return ( 
        <div>

{userLoggedIn && <h1>Welcome {userStatus.username}</h1>}
            <div>
                
                <Switch>
                    <Route exact path="/booking">
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
                    <Route path="/booking/search-results">
                        <FlightList
                            flights={flights}
                            onFlightSelection={handleFlightSelection}
                            onSortBy={handleSortByChange}
                        />
                    </Route>
                </Switch>
            </div>

        </div>
     );
}
 
export default Home;