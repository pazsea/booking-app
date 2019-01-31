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
import HomePage from "../Home";
import AccountPage from "../Account";
import AdminPage from "../Admin";

import * as ROUTES from "../../constants/routes";
import { withAuthentication } from "../Session";
import { SpanArrow } from "./styles";

class App extends Component {
  state = {
    isOpen: true
  };

  navToggle = () => {
    console.log("togglar Navbaren");
    this.setState(prevState => {
      return {
        isOpen: !prevState.isOpen
      };
    });
  };

  render() {
    return (
      <Router>
        <div>
          <SpanArrow>
            <i
              className="fas fa-arrow-circle-down fa-3x"
              onClick={this.navToggle}
            />
          </SpanArrow>
          <Navigation stateNav={this.state.isOpen} />
          {/*           <Route exact path={ROUTES.BOOK_TIME_SLOT} component={BookTime} /> */}
          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            exact
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route exact path={ROUTES.HOME} component={HomePage} />
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
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
