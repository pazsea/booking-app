import React, { Component } from "react";
// import update from "immutability-helper";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { calculateDistance } from "../Navigation";

const Geolocation = props => (
  <AuthUserContext.Consumer>
    {authUser => (
      <GeolocationComplete authUser={authUser} bookingID={props.bookingID} />
    )}
  </AuthUserContext.Consumer>
);

const KYHLocation = { latitude: 59.313437, longitude: 18.110645 };

function getObjectValues(dictionary) {
  var values = Object.keys(dictionary).map(function(key) {
    return dictionary[key];
  });
  return values;
}

function roundMilliseconds(time) {
  var unit;
  time = time / 1000;

  if (time < 60) {
    unit = "sec";
  } else {
    time = time / 60;
    if (time < 60) {
      unit = "min";
    } else {
      time = time / 60;
      if (time < 60) {
        unit = "h";
      } else {
        time = time / 24;
        unit = "d";
      }
    }
  }

  return Math.round(time) + " " + unit;
}

class GeolocationBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startTime: null,
      location: {
        latitude: null,
        longitude: null
      },
      invitees: {}
    };
  }

  getLastKnownPosition = (
    num,
    userID = this.props.authUser.uid,
    callbackFunction
  ) => {
    this.props.firebase
      .user(userID)
      .child("positions")
      .limitToLast(num)
      .on("value", snapshot => {
        const lastKnownPositionObject = snapshot.val();

        if (lastKnownPositionObject) {
          const lastKnownPositions = Object.keys(lastKnownPositionObject).map(
            key => ({
              ...lastKnownPositionObject[key],
              uid: key
            })
          );

          callbackFunction(lastKnownPositions);
        }
      });
  };

  calculateETA = (origin, current, destination) => {
    var distanceTraveled = calculateDistance(origin, current);
    var distanceRemaining = calculateDistance(current, destination);

    var passedTime = current.timestamp - origin.timestamp;
    var speed = distanceTraveled / passedTime;
    var timeLeft = distanceRemaining / speed;

    return roundMilliseconds(timeLeft); //milliseconds left to arrival
  };

  getDataForETA = bookingID => {
    let bookingStartTime; //Done

    let bookingLocation = KYHLocation; //Should in the future come from the db

    // Get booking object
    this.props.firebase.event(bookingID).on("value", snapshot => {
      const booking = snapshot.val();

      const timeList = Object.keys(booking.time);
      bookingStartTime = parseInt(timeList[0]);
      let startTimeETA = bookingStartTime - 3600000;

      this.setState({
        startTime: bookingStartTime,
        location: {
          latitude: bookingLocation.latitude,
          longitude: bookingLocation.longitude
        },
        invitees: {}
      });

      const acceptedUserList = Object.keys(booking.hasAcceptedUid);

      acceptedUserList.forEach(userID => {
        // Get last 2 known positions
        this.getLastKnownPosition(2, userID, positionList => {
          let originLocation;
          let currentLocation;
          // Get originLocation
          if (positionList[0].createdAt >= startTimeETA) {
            originLocation = positionList[0];
          }

          // Get currentLocation
          if (positionList[1].createdAt >= startTimeETA) {
            currentLocation = positionList[1];
          }

          // When data from getLastKnownPosition() is recieved, get userName
          this.props.firebase
            .user(userID)
            .child("username")
            .on("value", snapshot => {
              const userName = snapshot.val();

              // Wen userName is recieved, update state
              this.setState(prevState => {
                let invitees = {
                  ...prevState.invitees
                };

                invitees[userID] = {
                  userID: userID,
                  userName: userName,
                  origin: {
                    latitude: originLocation.latitude,
                    longitude: originLocation.longitude,
                    timestamp: originLocation.createdAt
                  },
                  current: {
                    latitude: currentLocation.latitude,
                    longitude: currentLocation.longitude,
                    timestamp: currentLocation.createdAt
                  }
                };

                return { invitees: invitees };
              }); // Closing setState
            }); // Closing firebase get userName
        }); // Closing getLastKnownPosition
      }); // Closing forEach
    }); // CLosing firebase get booking
  }; // Closing getDataForETA

  componentDidMount() {
    this.getDataForETA(this.props.bookingID);
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const { startTime, invitees, location } = this.state;

    if (!startTime) {
      return <p style={{ color: "white" }}>Loading...</p>;
    }

    var allUserObjects = getObjectValues(invitees);
    return (
      <div style={{ color: "white" }}>
        {allUserObjects.map(userObject => (
          <p key={userObject.userID}>
            name: {userObject.userName}{" "}
            <span>
              {" "}
              {this.calculateETA(
                userObject.origin,
                userObject.current,
                location
              )}
            </span>{" "}
          </p>
        ))}
      </div>
    );
  }
}

const condition = authUser => !!authUser;

const GeolocationComplete = withFirebase(GeolocationBase);

export default compose(withAuthorization(condition))(Geolocation);
