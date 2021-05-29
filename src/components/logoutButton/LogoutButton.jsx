import { removeToken } from "../../utils/Login";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userStatus/UserStatusActions';
import { useHistory } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';


const LogoutButton = () => {

    const userLoggedIn = useSelector( state => state.userStatus.userLoggedIn);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        removeToken();
        dispatch(logout());
        history.push('/')
    }

    return ( 
        <Nav.Link 
                id="nav-links" 
                href="/register" 
                onClick={handleLogout}
                data-testid="logoutButton" >Logout</Nav.Link>
     );
}
 
export default LogoutButton;