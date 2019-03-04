import React, { Component } from "react";
import { compose } from "recompose";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";

const Geolocation = () => (
  <AuthUserContext.Consumer>
    {authUser => <GeolocationComplete authUser={authUser} />}
  </AuthUserContext.Consumer>
);

class GeolocationBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      browserCoords: null,
      lastKnownCoords: null
    };
  }

  calculateDistance = (lat1, lon1, lat2, lon2) => {
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

  calculateETA = (
    startLat,
    startLong,
    currentLat,
    currentLong,
    endLat,
    endLong,
    startTime
  ) => {
    var distanceTraveled = this.calculateDistance(
      startLat,
      startLong,
      currentLat,
      currentLong
    );
    var remainingDistance = this.calculateDistance(
      currentLat,
      currentLong,
      endLat,
      endLong
    );
    var passedTime = Date.now() - startTime; //millisekunder
    var speed = distanceTraveled / passedTime;
    var timeLeft = remainingDistance / speed;

    return timeLeft;
  };

  getStartingPositionForETA = (userID, bookingID) => {
    // let bookingStartTime; //snapshot som hämtar starttime utifrån bookingID
    // let bookingDescription;

    this.props.firebase
      .events()
      .child(bookingID)
      .child("time")
      .limitToFirst(1)
      // .key()
      .on("value", snapshot => {
        let bookingStartTimeObject = snapshot.val();
        // let bookingStartTime = Object.keys(bookingStartTimeObject);
        console.log(bookingStartTimeObject);
      });

    this.props.firebase
      .events()
      .child(bookingID)
      .child("description")
      // .getKey()
      .on("value", snapshot => {
        let bookingDescription = snapshot.val();
        console.log(bookingDescription);
      });

    var startingPosition; //snapshot som hämtar första reggad position för angiven userID inom 1h innan srtattid för booking
    var startLat; //Latitude från startingPosition
    var startLong; //Longitude från startingPosition

    return startLat, startLong;
  };

  getETA = (userID, bookingID) => {
    var startPosition = this.getStartingPositionForETA(userID, bookingID);
    var startLat = startPosition.startLat; //funkar detta?
    var startLong = startPosition.startLong; //funkar detta?
    var currentPosition = this.getLastKnownPosition(1, userID);
    var currentLat; //Latitude från currentPosition (getLastKnownPosition)
    var currentLong; //Longitude från currentPosition (getLastKnownPosition)
    var endLat = 59.313448; //Static value for KYH
    var endLong = 18.110614; //Static value for KYH
    var startTime; //Snapshot med startTime för booking utifrån given bookingID

    this.calculateETA(
      startLat,
      startLong,
      currentLat,
      currentLong,
      endLat,
      endLong,
      startTime
    );
  };

  updatePosition = position => {
    this.setState({ browserCoords: position.coords });

    if (position.coords && this.state.lastKnownCoords) {
      const { latitude: lat1, longitude: lng1 } = position.coords;
      const { latitude: lat2, longitude: lng2 } = this.state.lastKnownCoords;
      const dist = this.calculateDistance(lat1, lng1, lat2, lng2);
      if (dist > 1) {
        this.writeUserPositionToDB(position.coords);
      }
    }
    this.writeUserPositionToDB(position.coords);
  };

  writeUserPositionToDB = position => {
    const { latitude, longitude } = position;
    console.log("writeUserPositionToDB called");
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("positions")
      .push({
        latitude: latitude,
        longitude: longitude,
        createdAt: Date.now()
      });

    this.setState({ lastKnownCoords: position });
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
          this.setState({ lastKnownCoords: lastKnownPositions });
        }
      });
  };

  // componentDidMount() {
  //   this.getStartingPositionForETA(
  //     "BCYJmNCULPb27ZoiNYvIJ9IBPY63",
  //     "-LZyJ5kLF8iTqNLqigZW"
  //   );
  //   this.watchId = navigator.geolocation.watchPosition(
  //     this.updatePosition,

  //     error => {
  //       console.log("error" + error);
  //     },
  //     {
  //       enableHighAccuracy: true,
  //       timeout: 20000,
  //       maximumAge: 0,
  //       distanceFilter: 1
  //     }
  //   );
  //   this.getLastKnownPosition(1);
  // }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    const whiteText = { color: "white" };
    return <div />;
  }
}

const Coords = props => (
  <div>
    {props.position ? (
      <div>
        <div>Lat: {props.position.latitude}</div>
        <div>Long: {props.position.longitude}</div>
      </div>
    ) : null}
  </div>
);

const condition = authUser => !!authUser;

const GeolocationComplete = withFirebase(GeolocationBase);

export default compose(withAuthorization(condition))(Geolocation);
