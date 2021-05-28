import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';

const Home = () => {

    const userLoggedIn = useSelector( state => state.userLoggedIn);

    return ( 
        <div>
            {!userLoggedIn && <Link to='/register'><h3>Register</h3></Link>}
            {userLoggedIn && <h1>Welcome</h1>}
        </div>
     );
}
 
export default Home;