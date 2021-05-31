import React, { useState } from 'react';
import './App.css'
import Main from './pages/Main';
import Register from './pages/Register';
import Login from './pages/Login';
import NavBar from './components/NavBar';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

export const CredentialsContext = React.createContext();

function App() {
  const credentialsState = useState(null); 

  return (
    <div>

      <CredentialsContext.Provider value={credentialsState}>
        <div className="App">
          <Router>
            <NavBar />

            <Switch>
              <Route exact path='/'>
                <Main/>
              </Route>
              <Route exact path='/register'>
                <Register/>
              </Route>
              <Route exact path="/login">
                <Login />
              </Route>
            </Switch>
          </Router>
        </div>
      </CredentialsContext.Provider>
    </div>
  );
}

export default App;
