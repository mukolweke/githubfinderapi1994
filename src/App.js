import React, { useState, Fragment, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import GithubState from './context/github/GithubState';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

const App = () => {
  const [users, setUsers] = useState([]);
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);
  const [repos, setRepos] = useState([]);

  useEffect(() => {
    fetchUsers();
  }, []);

  const getUser = async (username) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        setLoading(false);
        setUser(data);
        setAlert(null);
      }
    } catch (error) {
      setAlert({ msg: 'Error fetching data:', type: 'danger' });
      setLoading(false);
    }
  };

  const getUserRepos = async (username) => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created;asc&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        setLoading(false);
        setRepos(data);
        setAlert(null);
      }
    } catch (error) {
      setAlert({ msg: 'Error fetching data:', type: 'danger' });
      setLoading(false);
    }
  };

  const fetchUsers = async (query = '') => {
    setLoading(true);

    try {
      const { data } = await axios.get(
        `https://api.github.com/${
          query ? `search/users?q=${query}&` : 'users?'
        }` +
          `client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        setLoading(false);
        setUsers(query ? data.items : data);
        setAlert(null);
      }
    } catch (error) {
      setAlert({ msg: 'Error fetching data:', type: 'danger' });
      setLoading(false);
    }
  };

  const clearUsers = () => {
    setLoading(false);
    setUsers([]);
    setAlert(null);
  };

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
                    <Search
                      searchUsers={fetchUsers}
                      clearUsers={clearUsers}
                      showClear={users.length > 0}
                      setAlert={setAlertMsg}
                    />
                    <Users loading={loading} users={users} />
                  </Fragment>
                }
              />
              <Route
                exact
                path="/user/:username"
                element={
                  <User
                    getUser={getUser}
                    getUserRepos={getUserRepos}
                    user={user}
                    repos={repos}
                    loading={loading}
                  />
                }
              />
              <Route exact path="/about" element={<About />} />
            </Routes>
          </div>
        </div>
      </Router>
    </GithubState>
  );
};

export default App;
