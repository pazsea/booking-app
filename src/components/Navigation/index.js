import React, { Component } from "react";
import { NavLink } from "react-router-dom";

import { Nav, InvCounter } from "./styles";
import SignOutButton from "../SignOut";

import * as ROUTES from "../../constants/routes";
import { withFirebase } from "../Firebase";
import { AuthUserContext } from "../Session";
import * as ROLES from "../../constants/roles";

const Navigation = props => (
  <Nav stateNav={props.stateNav}>
    <AuthUserContext.Consumer>
      {authUser =>
        authUser ? (
          <NavigationAuthComplete authUser={authUser} {...props} />
        ) : (
          <NavigationNonAuth navToggle={props.navToggle} {...props} />
        )
      }
    </AuthUserContext.Consumer>
  </Nav>
);

class NavigationAuthBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalInvites: 0
    };
  }

  componentDidMount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("invitedToEvents")
      .on("value", snapshot => {
        if (snapshot.val() !== null) {
          const total = Object.keys(snapshot.val()).length;
          this.setState({
            totalInvites: total
          });
        } else {
          this.setState({
            totalInvites: 0
          });
        }
      });
  }

  componentWillUnmount() {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("invitedToEvents")
      .off();
  }

  render() {
    return (
      <React.Fragment>
        <ul className="main-nav">
          <li>
            <NavLink to={ROUTES.HOME} onClick={this.props.showNav}>
              Home
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.UPCOMING_EVENTS} onClick={this.props.showNav}>
              Upcoming
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.INVITES} onClick={this.props.showNav}>
              Invites{" "}
              <InvCounter>
                <i className="fas fa-bell" />
                {this.state.totalInvites}
              </InvCounter>
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.MY_EVENTS} onClick={this.props.showNav}>
              My Bookings
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.BOOK_ROOM} onClick={this.props.showNav}>
              Book a room
            </NavLink>
          </li>
          <li>
            <NavLink to={ROUTES.ACCOUNT} onClick={this.props.showNav}>
              Account
            </NavLink>
          </li>
          {this.props.authUser.roles.includes(ROLES.ADMIN) && (
            <li>
              <NavLink to={ROUTES.ADMIN} onClick={this.props.showNav}>
                Admin
              </NavLink>
            </li>
          )}
          <li>
            <SignOutButton />
          </li>
        </ul>
      </React.Fragment>
    );
  }
}

const NavigationNonAuth = props => (
  <React.Fragment>
    <ul className="main-nav">
      <li>
        <NavLink exact to={ROUTES.LANDING}>
          Landing
        </NavLink>
      </li>
      <li>
        <NavLink to={ROUTES.SIGN_IN}>Sign In</NavLink>
      </li>
    </ul>
  </React.Fragment>
);

const NavigationAuthComplete = withFirebase(NavigationAuthBase);

export default Navigation;
