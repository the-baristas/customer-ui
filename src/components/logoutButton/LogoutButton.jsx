import { removeToken } from "../../utils/Login";
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../redux/userStatus/UserStatusActions';
import { useHistory } from 'react-router-dom';


const LogoutButton = () => {

    const userLoggedIn = useSelector( state => state.userLoggedIn);
    const dispatch = useDispatch();
    const history = useHistory();

    const handleLogout = () => {
        removeToken();
        dispatch(logout());
        history.push('/')
    }

    return ( 
        <button 
        data-testid="logoutButton"
        className="btn btn-primary"
        onClick={handleLogout}>
            Logout
        </button>
     );
}
 
export default LogoutButton;