import React, { Component } from "react";
import { Link } from "react-router-dom";

import { Nav } from "./styles";
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
          <NavigationAuthComplete authUser={authUser} />
        ) : (
          <NavigationNonAuth navToggle={props.navToggle} />
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
        <ul>
          <li>
            <Link to={ROUTES.HOME}>Home</Link>
          </li>
          <li>
            <Link to={ROUTES.UPCOMING_EVENTS}>Upcoming Events</Link>
          </li>
          <li>
            <Link to={ROUTES.INVITES}>Invites {this.state.totalInvites}</Link>
          </li>
          <li>
            <Link to={ROUTES.MY_EVENTS}>My Events</Link>
          </li>
          <li>
            <Link to={ROUTES.BOOK_ROOM}>Book a room</Link>
          </li>
          <li>
            <Link to={ROUTES.ACCOUNT}>Account</Link>
          </li>
          {this.props.authUser.roles.includes(ROLES.ADMIN) && (
            <li>
              <Link to={ROUTES.ADMIN}>Admin</Link>
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
    <ul>
      <li>
        <Link to={ROUTES.LANDING}>Landing</Link>
      </li>
      <li>
        <Link to={ROUTES.SIGN_IN}>Sign In</Link>
      </li>
    </ul>
  </React.Fragment>
);

const NavigationAuthComplete = withFirebase(NavigationAuthBase);

export default Navigation;
