import React, { useContext } from 'react';
import { CredentialsContext } from '../App';
import { Link } from 'react-router-dom';

export default function NavBar() {
  const [ credentials, setCredentials ] = useContext(CredentialsContext);

  const logout = () => {
    setCredentials(null);
  }

  return(
    <div>
      <nav className="nav bg-light navbar-expand-lg navbar-light">
        <ul className="navbar-nav mr-auto">
          <li className="navbar-item">
            <Link to="/" className="nav-link">Home</Link>
          </li>
          {!credentials &&
            <li className="navbar-item">
              <Link to="/register" className="nav-link">Register</Link>
            </li>
          }
          {!credentials &&
            <li className="navbar-item">
              <Link to="/login" className="nav-link">Login</Link>
            </li>
          }
          {credentials && 
            <li className="navbar-item">                
              <Link to="/" className="nav-link" onClick={logout}>Logout</Link>                
            </li>
          }                 
        </ul>
      </nav>
    </div>
  );
};