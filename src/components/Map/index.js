import React, { Component } from "react";
import L from "leaflet";
import styled from "styled-components";
import Geolocation from "./geolocation";
import { AuthUserContext, withAuthorization } from "../Session";
import { withFirebase } from "../Firebase";
import { compose } from "recompose";

// import { userInfo } from "os";

const Map = props => (
  <AuthUserContext.Consumer>
    {authUser => <MapComplete authUser={authUser} {...props} />}
  </AuthUserContext.Consumer>
);

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: 1em auto;
`;

var PersonMarker = L.icon({
  iconUrl: require("./personMarker.png"),
  iconSize: [50, 50], // size of the icon
  iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
});

class MapBase extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUsers: [],
      mapEvent: this.props.mapEvent,
      noUsers: false
    };
  }

  componentDidMount() {
    console.log("MOOOOOOOUNT");
    this.map = L.map("map", {
      center: [59.313448, 18.110614],
      zoom: 13,
      zoomControl: false
    });
    console.log("efter this map");

    this.props.firebase
      .events()
      .child(this.state.mapEvent)
      .child("hasAcceptedUid")
      .once("value", snapshot => {
        console.log("nuuu är du på första steget");
        if (snapshot.val()) {
          const eventUsernames = Object.keys(snapshot.val());
          eventUsernames.forEach(nameUid => {
            this.props.firebase
              .user(nameUid)
              .child("positions")
              .limitToLast(1)
              .once("value", snapshot => {
                console.log(snapshot.val());
                const lastKnownPositionUser = snapshot.val();
                if (lastKnownPositionUser) {
                  const positionsList = Object.keys(lastKnownPositionUser).map(
                    key => ({
                      ...lastKnownPositionUser[key]
                    })
                  );
                  let lastKnownPositions = {};
                  if (positionsList.length === 1) {
                    lastKnownPositions = Object.assign(positionsList[0]);
                  } else {
                    lastKnownPositions = Object.assign(positionsList);
                  }
                  const { latitude, longitude } = lastKnownPositions;
                  console.log("Latitude för användaren " + latitude);
                  console.log("Latitude för användaren " + longitude);

                  this.props.firebase
                    .user(nameUid)
                    .child("username")
                    .once("value", snapshot => {
                      const name = snapshot.val();
                      console.log("Användare som är inbjuden " + name);

                      L.marker([latitude, longitude], { icon: PersonMarker })
                        .addTo(this.map)
                        .bindPopup(name);
                    });
                }
              });
          });
        } else {
          this.setState({
            noUsers: true
          });
        }
      });

    L.tileLayer(
      "https://{s}.tile.openstreetmap.se/hydda/full/{z}/{x}/{y}.png",
      {
        attribution:
          'Tiles courtesy of <a href="http://openstreetmap.se/" target="_blank">OpenStreetMap Sweden</a> &mdash; Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        detectRetina: true,
        maxZoom: 20,
        maxNativeZoom: 17,
        accessToken:
          "pk.eyJ1IjoibmFpY2FoIiwiYSI6ImNqc2xsdGFxczJwYm40M254MnpnMGJlaHEifQ.CrjwoRsRgeGSWSFGC3xp6A"
      }
    ).addTo(this.map);

    L.marker([59.313448, 18.110614])
      .addTo(this.map)
      .bindPopup("KYH, en märklig skola")
      .openPopup();
  }

  render() {
    const { noUsers } = this.state;
<<<<<<< HEAD
    {
      if (noUsers) {
        return <div>No users has accepted in this event</div>;
      } else {
        return (
          <div>
            <Wrapper width="90vw" height="80vh" id="map" />
            <Geolocation />
            <button onClick={this.props.close}>CLOSE</button>
          </div>
        );
      }
=======

    if (noUsers) {
      return <div>No users has accepted in this event</div>;
    } else {
      return (
        <div>
          <Wrapper width="90vw" height="80vh" id="map" />
          <Geolocation />
          <button onClick={this.props.close}>CLOSE</button>
        </div>
      );
>>>>>>> master
    }
  }
}
const condition = authUser => !!authUser;

const MapComplete = withFirebase(MapBase);

export default compose(withAuthorization(condition))(Map);
