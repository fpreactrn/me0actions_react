import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CredentialsContext } from '../App';
import Actions from '../components/Actions'

export default function Main() {
  const [ credentials ] = useContext(CredentialsContext);

  return (
    <div className="container mt-5">
      <div className="row">
        <div className="col-sm-8 col-sm-offset-2">
          <div className="card">
            <div className="card-header">
              <h1 className="text-center text-info">Action Item List {credentials && <span>for </span>}{credentials && credentials.username}</h1>
            </div> 

            <body>
              {!credentials &&
                <div className="card-body">              
                  <Link to="/register">Register</Link>
                  <br />  
                  <Link to="/login">Login</Link>
                  <br /> 
                </div>
              }
            </body>

            <div className="card-footer">
              {credentials && <Actions />} 
            </div>
          </div>    
        </div>      
      </div>        
    </div>
  )
};