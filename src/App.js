import { Component } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';
import Alert from './components/layout/Alert';
class App extends Component {
  state = {
    users: [],
    loading: false,
    alert: null,
  };

  componentDidMount() {
    this.fetchUsers();
  }

  // search/fetch github users
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
      this.setState({ alert: { msg: 'Error fetching data:', type: 'danger' } });
      this.setState({ loading: false });
    }
  };

  // clear users from state
  clearUsers = () => {
    this.setState({ users: [], loading: false, alert: null });
  };

  setAlert = (msg, type) => {
    this.setState({ alert: { msg, type } });

    setTimeout(() => this.setState({ alert: null }), 3000);
  };

  render() {
    const { loading, users } = this.state;

    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <Alert alert={this.state.alert} />

          <Search
            searchUsers={this.fetchUsers}
            clearUsers={this.clearUsers}
            showClear={users.length > 0 ? true : false}
            setAlert={this.setAlert}
          />

          <Users loading={loading} users={users} />
        </div>
      </div>
    );
  }
}

export default App;
