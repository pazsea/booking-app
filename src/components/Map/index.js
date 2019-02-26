import React, { Component } from "react";


const { Map: LeafletMap } = window.ReactLeaflet (

  
  <div id="mapContainer">
    <span />
  </div>

 
);


// Make sure all the code (below) is called after the div and leaflet.js inclusion
var mymap = L.map( 'mapContainer' ).setView( [ 51.505, -0.09 ], 13 );
L.tileLayer( 'https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={pk.eyJ1IjoibmFpY2FoIiwiYSI6ImNqc2xsdGFxczJwYm40M254MnpnMGJlaHEifQ.CrjwoRsRgeGSWSFGC3xp6A}', {
  attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
  maxZoom: 18,
  id: 'mapbox.streets',
  accessToken: 'your.mapbox.access.token'
}

export default Map;

// Credit needs to be added: © OpenStreetMap contributors https://www.openstreetmap.org/copyright

// Read about it at: https://www.openstreetmap.org/copyright
// For a browsable electronic map, the credit should appear in the corner of the map. 
