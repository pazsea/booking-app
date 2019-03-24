import React, { Component } from "react";
import L from "leaflet";
import styled from "styled-components";
import { withAuthorization } from "../Session";
import { compose } from "recompose";
import { calculateETA, isEmpty } from "../../utilities";
import { LeafLetControl } from "./styles";
import { CloseButton } from "../BookTime/styles";

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: 1em auto;
  border-radius: 4px;
`;

var PersonMarker = L.icon({
  iconUrl: require("./personMarker.png"),
  iconSize: [50, 50], // size of the icon
  iconAnchor: [25, 50], // point of the icon which will correspond to marker's location
  popupAnchor: [0, -50] // point from which the popup should open relative to the iconAnchor
});

var personsLayerGroup = L.layerGroup();

class Map extends Component {
  addPersonMarkers = () => {
    const { booking } = this.props;
    let { usersETA } = booking;
    if (!isEmpty(usersETA)) {
      Object.keys(usersETA).forEach(userID => {
        const userLocationInfo = usersETA[userID];
        const currentPos = userLocationInfo.current;
        const ETA = calculateETA(
          userLocationInfo.origin,
          userLocationInfo.current,
          booking.location
        );
        L.marker([currentPos.latitude, currentPos.longitude], {
          icon: PersonMarker
        })
          .addTo(personsLayerGroup)
          .bindPopup(`${userLocationInfo.userName} <br>ETA: ${ETA}`);
      });
      personsLayerGroup.addTo(this.map);
    }
  };

  componentDidMount() {
    this.map = L.map("map", {
      center: [59.313448, 18.110614],
      zoom: 13,
      zoomControl: false
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
      .bindPopup("KYH School");

    this.addPersonMarkers();
  }
  // One or more persons moved, redraw markers
  componentDidUpdate() {
    // Remove all previous people markers
    personsLayerGroup.clearLayers();
    // Add updated people markers
    this.addPersonMarkers();
  }

  render() {
    return (
      <LeafLetControl>
        <Wrapper width="90vw" height="80vh" id="map" />
        <CloseButton onClick={this.props.close}>Close</CloseButton>
      </LeafLetControl>
    );
  }
}
const condition = authUser => !!authUser;

export default compose(withAuthorization(condition))(Map);
