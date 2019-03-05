import React, { Component } from "react";
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
      browserCoords: null,
      lastKnownCoords: null,
      booking: null
    };
  }

  calculateETA = (origin, current, destination) => {
    var distanceTraveled = calculateDistance(origin, current);
    var distanceRemaining = calculateDistance(current, destination);

    var passedTime = current.timestamp - origin.timestamp;
    var speed = distanceTraveled / passedTime;
    var timeLeft = distanceRemaining / speed;

    return roundMilliseconds(timeLeft); //milliseconds left to arrival
  };

  // getDataForETA = (userID, bookingID) => {
  //   let bookingStartTime;
  //   let ETACalcStartTime;
  //   let startingPositionID; //snapshot som hämtar första reggad position för angiven userID inom 1h innan srtattid för booking

  //   let startLat;
  //   let startLong;

  //   let bookingLocation = KYHLocation;

  //   let userName;
  //   let originLocation;
  //   let currentLocation;

  //   this.setState({
  //     booking: {
  //       startTime: bookingStartTime,
  //       location: {
  //         latitude: bookingLocation.latitude,
  //         longitude: bookingLocation.longitude
  //       },
  //       invitees: {
  //         user1: {
  //           userID: userID,
  //           userName: userName,
  //           origin: {
  //             latitude: originLocation.latitude,
  //             longitude: originLocation.longitude,
  //             timestamp: originLocation.createdAt
  //           },
  //           current: {
  //             latitude: currentLocation.latitude,
  //             longitude: currentLocation,
  //             timestamp: currentLocation.createdAt
  //           }
  //         }
  //       }
  //     }
  //   });

  //   // startingPositionID
  //   this.props.firebase
  //     .user(userID)
  //     .child("positions")
  //     .orderByChild("createdAt")
  //     .startAt(ETACalcStartTime)
  //     .limitToFirst(1)
  //     .on("child_added", function(snapshot) {
  //       startingPositionID = snapshot.key;
  //     });

  //   this.props.firebase
  //     .events()
  //     .child(bookingID)
  //     .child("time")
  //     .limitToFirst(1)
  //     .on("value", snapshot => {
  //       bookingStartTime = Object.keys(snapshot.val());
  //       console.log(bookingID);
  //       console.log(bookingStartTime);
  //     });

  //   this.props.firebase
  //     .user(userID)
  //     .child(startingPositionID)
  //     .child("latitude")
  //     .on("value", snapshot => {
  //       startLat = snapshot.val();
  //       console.log(startLat);
  //     });

  //   this.props.firebase
  //     .user(userID)
  //     .child(startingPositionID)
  //     .child("longitude")
  //     .on("value", snapshot => {
  //       startLong = snapshot.val();
  //       console.log(startLong);
  //     });
  // };

  componentDidMount() {
    this.setState({
      booking: {
        startTime: 1551686400000,
        location: {
          latitude: 58,
          longitude: 16
        },
        invitees: {
          user1: {
            userID: "user1",
            userName: "bob",
            origin: {
              latitude: 57,
              longitude: 16,
              timestamp: 1551683473000
            },
            current: {
              latitude: 57.3,
              longitude: 16.2,
              timestamp: 1551684193000
            }
          },
          user2: {
            userID: "user2",
            userName: "albert",
            origin: {
              latitude: 57,
              longitude: 16,
              timestamp: 1551683473000
            },
            current: {
              latitude: 57.3,
              longitude: 16.2,
              timestamp: 1551694193000
            }
          }
        }
      }
    });
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const { booking } = this.state;
    if (!booking) {
      return <p style={{ color: "white" }}>Loading...</p>;
    }

    var allUserObjects = getObjectValues(booking.invitees);
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
                KYHLocation
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
