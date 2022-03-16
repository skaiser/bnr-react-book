import axios from 'axios';
import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import UserContext from '../context/UserContext';
import './UserDetails.css';

function UserDetails() {
  const navigate = useNavigate();
  const { userDetails, setUserDetails } = useContext(UserContext);

  const logout = () => {
    axios
      .post('/api/auth/logout', {})
      .then(() => {
        setUserDetails({});
        navigate('/');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="user-details-component">
      {userDetails.username ? (
        <div>
          {`Welcome, ${userDetails.username}`}
          <button type="button" onClick={logout}>
            Logout
          </button>
        </div>
      ) : (
        <Link to="/login">Login</Link>
      )}
    </div>
  );
}

export default UserDetails;
