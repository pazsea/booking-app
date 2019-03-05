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

export const calculateDistance = (position1, position2) => {
  const { latitude: lat1, longitude: lon1 } = position1;
  const { latitude: lat2, longitude: lon2 } = position2;

  var R = 6371; // km (change this constant to get miles)
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;

  return Math.round(d * 1000);
};

class NavigationAuthBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      totalInvites: 0,
      lastStoredPosition: { latitude: 0, longitude: 0 }
    };
  }

  writeUserPositionToDB = position => {
    const { latitude, longitude } = position;
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("positions")
      .push({
        latitude: latitude,
        longitude: longitude,
        createdAt: Date.now()
      });
    this.setState({ lastStoredPosition: position });
  };

  updatePosition = position => {
    const dist = calculateDistance(
      position.coords,
      this.state.lastStoredPosition
    );
    if (dist > 10) {
      // ÄNDRADE FRÅN 1 TILL 10 SÅ ATT DEN INTE PUSHAR TILL FIREBASE HELA TIDEN
      this.writeUserPositionToDB(position.coords);
    }
  };

  getLastKnownPosition = (num, user = this.props.authUser.uid) => {
    this.props.firebase
      .user(user)
      .child("positions")
      .limitToLast(num)
      .on("value", snapshot => {
        const lastKnownPositionObject = snapshot.val();

        if (lastKnownPositionObject) {
          const positionsList = Object.keys(lastKnownPositionObject).map(
            key => ({
              ...lastKnownPositionObject[key],
              uid: key
            })
          );
          let lastKnownPositions = {};
          if (positionsList.length === 1) {
            lastKnownPositions = Object.assign(positionsList[0]);
          } else {
            lastKnownPositions = Object.assign(positionsList);
          }
          this.setState({ lastStoredPosition: lastKnownPositions });
        }
      });
  };

  componentDidMount() {
    console.log("nav mpounted");

    // --------------  UPDATE AMOUNT OF INVITES -------------- //
    this.props.firebase.user(this.props.authUser.uid).on("value", snapshot => {
      const inbj = snapshot.val();
      if (inbj.hasOwnProperty("invitedToEvents")) {
        const total = Object.keys(inbj.invitedToEvents).length;
        this.setState({
          totalInvites: total
        });
      } else if (inbj.hasOwnProperty("invitedToEvents") === null) {
        this.setState({
          totalInvites: 0
        });
      }
    });

    // --------------  STORE POSITION -------------- //
    this.watchId = navigator.geolocation.watchPosition(
      this.updatePosition,

      error => {
        console.log("error" + error);
      },
      {
        enableHighAccuracy: true,
        // timeout: 20000, STYR TIDEN DEN PUSHAR IN TILL FIREBASE
        maximumAge: 0,
        distanceFilter: 1
      }
    );
  }

  componentWillUnmount() {
    this.props.firebase.user(this.props.authUser.uid).off();
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    return (
      <React.Fragment>
        <ul className="main-nav">
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
