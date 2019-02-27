import React, { Component } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import styled from "styled-components";

const Wrapper = styled.div`
  width: ${props => props.width};
  height: ${props => props.height};
`;

class Map extends Component {
  componentDidMount() {
    this.map = L.map("map", {
      center: [58, 16],
      zoom: 6,
      zoomControl: false
    });

    L.tileLayer(
      "https://cartodb-basemaps-{s}.global.ssl.fastly.net/rastertiles/voyager_nolabels/{z}/{x}/{y}{r}.png",
      {
        detectRetina: true,
        maxZoom: 20,
        maxNativeZoom: 17,
        attribution:
          'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        accessToken:
          "pk.eyJ1IjoibmFpY2FoIiwiYSI6ImNqc2xsdGFxczJwYm40M254MnpnMGJlaHEifQ.CrjwoRsRgeGSWSFGC3xp6A"
      }
    ).addTo(this.map);
  }

  render() {
    return <Wrapper width="1280px" height="720px" id="map" />;
  }
}

export default Map;
