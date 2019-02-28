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
      dbCoords: null,
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

  updatePosition = position => {
    this.setState({ browserCoords: position.coords });
    if (position.coords && this.state.dbCoords) {
      const { latitude: lat1, longitude: lng1 } = position.coords;
      const { latitude: lat2, longitude: lng2 } = this.state.dbCoords;
      const dist = this.calculateDistance(lat1, lng1, lat2, lng2);
      if (dist > 1) {
        // this.writeUserPositionToDB(position.coords);
      }
    }
    this.writeUserPositionToDB(position.coords);
  };

  writeUserPositionToDB = position => {
    const { latitude, longitude } = position;
    console.log("writeUserPositionToDB called");
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("positions")
      .push({ latitude: latitude, longitude: longitude });

    this.setState({ dbCoords: position });
    // console.log(this.state.lastKnownCoords);
    // console.log(this.state.dbCoords);
  };

  getUserPositionFromDB = () => {
    this.props.firebase
      .user(this.props.authUser.uid)
      .child("position")
      .once("value", snapshot => {
        const userPosition = snapshot.val();
        console.log(JSON.parse(JSON.stringify(userPosition)));
        this.setState({ dbCoords: userPosition });
      });
  };

  getLastKnownPosition = () => {
    // const { latitude, longitude } = position;
    this.props.firebase
      .users()
      .child(this.props.authUser.uid)
      .child("positions")
      .limitToLast(1)

      .once("value", snapshot => {
        const lastKnownPosition = snapshot.val();
        //   var key = Object.keys( snapshot.val() )[ 0 ];

        const lastLat = lastKnownPosition.latitude;
        // const lastLong = snapshot.val()[1];

        // console.log(JSON.parse(JSON.stringify(lastKnownPosition)));
        // console.log(lastKnownPosition);
        console.log("lastLat");
        console.log(lastLat);
        console.log("lastLong");
        // console.log(lastLong);
        console.log("lastKnownPosition snapVal");
        console.log(lastKnownPosition);
        this.setState({ lastKnownCoords: lastKnownPosition });
      });
  };

  componentDidMount() {
    //   this.getUserPositionFromDB();
    this.getLastKnownPosition();
    console.log("geolocation mounted");
    this.watchId = navigator.geolocation.watchPosition(
      this.updatePosition,

      error => {
        console.log("error" + error);
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
        distanceFilter: 1
      }
    );
  }

  componentWillUnmount() {
    navigator.geolocation.clearWatch(this.watchId);
  }

  render() {
    console.log("browserCoords");

    console.log(JSON.parse(JSON.stringify(this.state.browserCoords)));
    console.log("lastKnownCoords");
    console.log(JSON.parse(JSON.stringify(this.state.lastKnownCoords)));
    return (
      <div>
        <div>Geolocation</div>
        <div>
          <p>Coords from Browser</p>
          <Coords position={this.state.browserCoords} />

          <p>Coords from DB</p>
          <Coords position={this.state.dbCoords} />

          <p>Last known coords</p>
          <Coords position={this.state.lastKnownCoords} />
        </div>
      </div>
    );
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
