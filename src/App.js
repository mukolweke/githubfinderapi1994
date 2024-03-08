import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GithubState from './context/github/GithubState';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

const App = () => {
  const [alert, setAlert] = useState(null);

  const setAlertMsg = (msg, type) => {
    setAlert({ msg, type });
    setTimeout(() => setAlert(null), 3000);
  };

  return (
    <GithubState>
      <Router>
        <div className="App">
          <Navbar />

          <div className="container">
            <Alert alert={alert} />

            <Routes>
              <Route
                exact
                path="/"
                element={
                  <Fragment>
                    {/* Search Functionality */}
                    <Search setAlert={setAlertMsg} />

                    {/* Display Users */}
                    <Users />
                  </Fragment>
                }
              />

              <Route exact path="/user/:username" element={<User />} />

              <Route exact path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
