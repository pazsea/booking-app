import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

import BookRoom from "../BookRoom";
import MyEvents from "../MyEvents";
import Invites from "../Invites";
import UpcomingEvents from "../UpcomingEvents";

import Navigation from "../Navigation";
import LandingPage from "../Landing";
import SignUpPage from "../SignUp";
import SignInPage from "../SignIn";
import PasswordForgetPage from "../PasswordForget";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { Menu, MenuItems } from "./styles";

class App extends Component {
  state = {
    isOpen: true
    // totalInvites: 0
  };

  navToggle = () => {
    this.setState(prevState => {
      return {
        isOpen: !prevState.isOpen
      };
    });
  };

  // componentDidMount() {
  //   // -------------- GET NUMBER OF INVITES -------------- //
  // this.props.firebase
  //   .user(this.props.authUser.uid)
  //   .child("invitedToEvents")
  //   .on("value", snapshot => {
  //     const inbj = snapshot.val();
  //     if (snapshot.val()) {
  //       const total = Object.keys(inbj).length;
  //       console.log(total);
  //       this.setState({
  //         totalInvites: total
  //       });
  //     } else {
  //       this.setState({
  //         totalInvites: 0
  //       });
  //     }
  //   });
  // }

  render() {
    return (
      <Router>
        <React.Fragment>
          <Menu>
            <MenuItems>
              <i className="fas fa-bars fa-3x" onClick={this.navToggle} />
              <h1>KYH BOOKING</h1>
            </MenuItems>
          </Menu>
          <Navigation stateNav={this.state.isOpen} showNav={this.navToggle} />
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            exact
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route
            exact
            path={ROUTES.UPCOMING_EVENTS}
            component={UpcomingEvents}
          />
          <Route exact path={ROUTES.BOOK_ROOM} component={BookRoom} />
          <Route exact path={ROUTES.INVITES} component={Invites} />
          <Route exact path={ROUTES.MY_EVENTS} component={MyEvents} />

          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        </React.Fragment>
      </Router>
    );
  }
}

export default withAuthentication(App);
