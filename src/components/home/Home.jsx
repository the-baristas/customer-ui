import { useSelector } from 'react-redux';
import Image from 'react-bootstrap/Image';
import mainImage from './customer-ui-01.jpg';
import FlightSearch from '../flight-search/FlightSearch';

const Home = () => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);

    return ( 
        <div>
            {!userLoggedIn && <FlightSearch /> }
            {!userLoggedIn && <Image src={mainImage} fluid />}
            {userLoggedIn && <h1>Welcome</h1>}
        </div>
     );
}
 
export default Home;