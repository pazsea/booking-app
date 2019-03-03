import React, { Component } from "react";
import L from "leaflet";
import styled from "styled-components";
import Geolocation from "./geolocation";

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

class Map extends Component {
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
      .bindPopup("KYH, en märklig skola")
      .openPopup();

    L.marker([59.31445, 18.110613], { icon: PersonMarker })
      .addTo(this.map)
      .bindPopup("Användare");
  }

  render() {
    return (
      <div>
        <Wrapper width="90vw" height="80vh" id="map" />
        <Geolocation />
      </div>
    );
  }
}

export default Map;
