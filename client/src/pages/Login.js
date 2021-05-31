import React, { useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import { CredentialsContext } from '../App';
// import { Form } from '../styles/Form';
import Form from '../styles/Form';
import { Link } from 'react-router-dom'; 

const handleErrors = async (response) => {
  if (! response.ok) {
    const { message } = await response.json();
    throw Error(message);
  }
  return response.json();
};

export default function Login() {
  const [ username, setUsername ] = useState("");
  const [ password, setPassword ] = useState("");
  const [ error, setError ] = useState("");
  const [ , setCredentials ] = useContext(CredentialsContext);
  const history = useHistory();

  const login = (e) => {
    e.preventDefault();
    fetch("/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username,
        password
      })
    })
    // .then(response => response.json())
    // .then(data => console.log(data))
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
      <h1 className="text-center text-info">Log in</h1>
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
          <button onClick={login} className="btn btn-info btn-md" type="button">Submit</button>
          <Link to="/register">I am not registered yet</Link>
        </div>
      </div>  
    </Form>
  )
};