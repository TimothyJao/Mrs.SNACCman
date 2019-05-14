import React from "react";
import { Link } from "react-router-dom";

class MainPage extends React.Component {
  constructor(props) {
    super(props);
    this.logoutUser = this.logoutUser.bind(this);
    this.getLinks = this.getLinks.bind(this);
  }

  logoutUser(e) {
    e.preventDefault();
    this.props.logout();
  }

  getLinks() {
    if (this.props.loggedIn) {
      return (
        <div>
          <button onClick={this.logoutUser}>Logout</button>
        </div>
      );
    } else if (!this.props.loggedIn) {
      return (
        <div>
          <Link to="/login">Log In!</Link>
          <br />
          <Link to="/signup">Sign Up!</Link>
        </div>
      );
    }
  }

  render() {
    return (
      <div>
        <div className="home-page">
          <h1 className="home-title">Mrs. Snaccman</h1>
          {this.getLinks()}
        </div>
      </div>
    );
  }
}

export default MainPage;
