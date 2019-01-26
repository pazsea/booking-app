import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";

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

class App extends Component {

  state = {
    isOpen: false
  };

  navToggle = () => {
    console.log("Nu jävlar!!!!");
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
          <Navigation navToggle={this.navToggle} stateNav={this.state.isOpen} />

          <Route exact path={ROUTES.LANDING} component={LandingPage} />
          <Route exact path={ROUTES.SIGN_UP} component={SignUpPage} />
          <Route exact path={ROUTES.SIGN_IN} component={SignInPage} />
          <Route
            exact
            path={ROUTES.PASSWORD_FORGET}
            component={PasswordForgetPage}
          />
          <Route exact path={ROUTES.HOME} component={HomePage} />
          <Route exact path={ROUTES.ACCOUNT} component={AccountPage} />
          <Route exact path={ROUTES.ADMIN} component={AdminPage} />
        </div>
      </Router>
    );
  }
}

export default withAuthentication(App);
