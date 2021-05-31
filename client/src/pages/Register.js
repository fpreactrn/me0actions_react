import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import Form from '../styles/Form';
import { Link } from 'react-router-dom'

import { CredentialsContext } from '../App';

const handleErrors = async (response) => {
  if (! response.ok) {
    const { message } = await response.json();
    throw Error(message);
  }
  return response.json();
};

export default function Register() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  const [ , setCredentials ] = useContext(CredentialsContext);
  const history = useHistory();

  const register = (e) => {
    e.preventDefault();
    fetch("/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    .then(handleErrors)
    .then(() => {
      setCredentials({
        username,
        password
      })
      history.push('/')
     })
    .catch((error) => {
       console.error(error)
       setError(error.message)
     })
  };

  return (
    <Form>
      <h1 className="text-info text-center">Register</h1>
      <div className="form-group">
        {error && <span style={{color: "red"}}>{error}</span>}<br/>
        <input
          className="form-control"
          placeholder="User Name"
          onChange={(e) => setUsername(e.target.value)}
        />

        <br/>
        <br/>

        <input
          className="form-control"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
          type="password"
        />

        <br/>
        <br/>
        
        <div className="d-flex justify-content-between align-item-end">
          <button onClick={register} type="button" className="btn btn-info btn-md">Submit</button>
          <Link to='/login'>I am already registered</Link>
        </div>  
      </div>  
    </Form>
  )
};