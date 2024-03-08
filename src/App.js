import React, { Component, Fragment } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
import About from './components/pages/About';
import User from './components/users/User';

class App extends Component {
  state = {
    users: [],
    user: {},
    loading: false,
    alert: null,
    repos: [],
  };

  componentDidMount() {
    this.fetchUsers();
  }

  getUser = async (username) => {
    this.setState({ loading: true });

    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}?client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        this.setState({
          loading: false,
          alert: null,
          user: data,
        });
      }
    } catch (error) {
      this.setState({
        alert: { msg: 'Error fetching data:', type: 'danger' },
        loading: false,
      });
    }
  };

  getUserRepos = async (username) => {
    this.setState({ loading: true });

    try {
      const { data } = await axios.get(
        `https://api.github.com/users/${username}/repos?per_page=5&sort=created;asc&client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        this.setState({
          loading: false,
          alert: null,
          repos: data,
        });
      }
    } catch (error) {
      this.setState({
        alert: { msg: 'Error fetching data:', type: 'danger' },
        loading: false,
      });
    }
  };

  fetchUsers = async (query = '') => {
    this.setState({ loading: true });

    try {
      const { data } = await axios.get(
        `https://api.github.com/${
          query ? `search/users?q=${query}&` : 'users?'
        }` +
          `client_id=${process.env.REACT_APP_CLIENT_ID}&client_secret=${process.env.REACT_APP_CLIENT_SECRET}`,
      );

      if (data) {
        this.setState({
          loading: false,
          alert: null,
          users: query ? data.items : data,
        });
      }
    } catch (error) {
      this.setState({
        alert: { msg: 'Error fetching data:', type: 'danger' },
        loading: false,
      });
    }
  };

  clearUsers = () => {
    this.setState({ users: [], loading: false, alert: null });
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => this.setState({ alert: null }), 3000);
  };

  render() {
    const { loading, users, user, alert, repos } = this.state;

    return (
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
                      searchUsers={this.fetchUsers}
                      clearUsers={this.clearUsers}
                      showClear={users.length > 0}
                      setAlert={this.setAlert}
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
                    getUser={this.getUser}
                    getUserRepos={this.getUserRepos}
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
    );
  }
}

export default App;
