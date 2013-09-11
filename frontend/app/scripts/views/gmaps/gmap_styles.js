define( function() {

'use strict';

var map_styles =
[

  //{
    //stylers: [
      //{
        //"hue": "#f1c40f"
      //}
    //]
  //}

  {
    featureType: "poi.business"
    ,stylers: [
      { visibility: "off" }
    ]
  }

  //,{ 
    //featureType: "poi", //parks?
    //stylers: [
      //{ visibility: "on" }
      //,{ color: "#1abc9c" }
    //]
  //}

  //,{
    //featureType: "road"
    //,stylers: [
      //{ visibility: "on" }
      //,{ color: "#333333" }
    //]
  //}

  ,{
    featureType: "road"
    ,elementType: "labels"
    ,stylers: [
      { visibility: "on" }
      //,{ color: "#34495e" }
    ]
  }

  ,{
    featureType: "road"
    ,elementType: "geometry"
    ,stylers: [
      { visibility: "simplified" }
      ,{ lightness: 80 }
      //,{ color: "#222" }
    ]
  }

  ,{
    featureType: "transit.line"
    ,stylers: [
      { visibility: "off" }
    ]
  }

  ,{
    featureType: "transit.station.bus"
    ,stylers: [
      { visibility: "off" }
    ]
  }

  ,{
    featureType: "water"
    ,stylers: [
      { visibility: "on" }
      ,{ weight: 1 }
      ,{ 
        color: 
          "#3498db" 
          //"#2980b9" 
          //"#34495e" 
      }
    ]
  }

  ,{
    featureType: "landscape"
    ,stylers: [
      { "visibility": "on" }
      //,{ "color": "#ecf0f1" }
      //,{ "color": "#000000" }
    ]
  }

];

//var map_styles =
//[
  //{
    //"featureType": "landscape",
    //"stylers": [
      //{ "visibility": "simplified" },
      //{ "invert_lightness": true }
    //]
  //},{
    //"featureType": "road",
    //"stylers": [
      //{ "visibility": "simplified" },
      //{ "saturation": -100 },
      //{ "lightness": -85 }
    //]
  //},{
    //"featureType": "administrative",
    //"stylers": [
      //{ "invert_lightness": true },
      //{ "visibility": "simplified" }
    //]
  //},{
    //"featureType": "transit",
    //"stylers": [
      //{ "invert_lightness": true },
      //{ "visibility": "simplified" }
    //]
  //},{
    //"featureType": "poi",
    //"stylers": [
      //{ "visibility": "simplified" },
      //{ "saturation": -62 },
      //{ "invert_lightness": true }
    //]
  //},{
    //"featureType": "water",
    //"stylers": [
      //{ "lightness": -36 },
      //{ "hue": "#00c3ff" },
      //{ "saturation": -22 },
      //{ "weight": 1 }
    //]
  //},{
  //}
//];

return map_styles;

});

