import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";
import Geolocation from "./geolocation";

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
  margin: 1em auto;
`;

const PersonMarker = L.icon({
  iconUrl: "./personMarker.png",

  iconSize: [38, 95] // size of the icon
  // iconAnchor: [22, 94], // point of the icon which will correspond to marker's location
  // popupAnchor: [-3, -76] // point from which the popup should open relative to the iconAnchor
});

class Map extends Component {
  componentDidMount() {
    this.map = L.map("map", {
      center: [58, 16],
      zoom: 6,
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

    L.marker([58.5, 18.4, { icon: PersonMarker }])
      .addTo(this.map)
      .bindPopup("Användare")
      .openPopup();
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
