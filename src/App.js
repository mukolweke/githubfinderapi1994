import { Component } from 'react';
import axios from 'axios';
import './App.css';
import Navbar from './components/layout/Navbar';
import Users from './components/users/Users';
import Search from './components/users/Search';

class App extends Component {
  state = {
    users: [],
    loading: false,
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
        this.setState({ loading: false, users: query ? data.items : data });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      this.setState({ loading: false });
    }
  };

  render() {
    const { loading, users } = this.state;

    return (
      <div className="App">
        <Navbar />
        <div className="container">
          <Search searchUsers={this.fetchUsers} />

          <Users loading={loading} users={users} />
        </div>
      </div>
    );
  }
}

export default App;
