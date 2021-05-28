import {Link} from 'react-router-dom';
import { useSelector } from 'react-redux';
import LogoutButton from '../logoutButton/LogoutButton';

const Header = () => {

    const userLoggedIn = useSelector( state => state.userLoggedIn)

    return ( 
        <div style={{backgroundColor: 'rgb(184, 198, 224)'}}>
            <Link to='/'><h2 style={{display: 'inline'}}>Home</h2></Link>
            
            { !userLoggedIn && <Link to='/login'>
                <button 
                    data-testid="loginButton"
                    className="btn btn-primary"
                    style={{marginLeft: 20}}>
                    Login</button>
            </Link>}
            { userLoggedIn && <div style={{display: 'inline', marginLeft: 20}}><LogoutButton ></LogoutButton></div>}
        </div>
     );
}
 
export default Header;