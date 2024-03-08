import React, { useState, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import GithubState from './context/github/GithubState';
import AlertState from './context/alert/AlertState';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

const App = () => {
  return (
    <GithubState>
      <AlertState>
        <Router>
          <div className="App">
            <Navbar />

            <div className="container">
              <Alert />

              <Routes>
                <Route
                  exact
                  path="/"
                  element={
                    <Fragment>
                      {/* Search Functionality */}
                      <Search />

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
      </AlertState>
    </GithubState>
  );
};

export default App;
