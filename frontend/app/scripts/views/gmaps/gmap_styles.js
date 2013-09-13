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

]

//darktheme
//var map_styles =
//[
  //{
    //"featureType": "landscape",
    //"stylers": [
      //{ "invert_lightness": true },
      //{ "visibility": "simplified" },
      //{ "saturation": -30 },
      //{ "lightness": -30 }
    //]
  //},{
    //"featureType": "poi",
    //"stylers": [
      //{ "visibility": "simplified" },
      //{ "invert_lightness": true },
      //{ "saturation": -60 }
    //]
  //},{
    //"featureType": "administrative",
    //"stylers": [
      //{ "invert_lightness": true },
      //{ "visibility": "simplified" }
    //]
  //},{
    //"featureType": "road",
    //"stylers": [
      //{ "invert_lightness": true }
    //]
  //},{
    //"featureType": "road.arterial",
    //"stylers": [
      //{ "visibility": "on" },
      //{ "lightness": -40 }
    //]
  //},{
    //"featureType": "road.local",
    //"stylers": [
      //{ "lightness": -10 }
    //]
  //},{
    //"featureType": "water",
    //"stylers": [
      //{ "lightness": -36 },
      //{ "hue": "#00c3ff" },
      //{ "saturation": -22 },
      //{ "weight": 1 }
    //]
    ////"featureType": "water",
    ////"stylers": [
      ////{ "weight": 1.5 },
      ////{ "hue": "#00aaff" },
      ////{ "lightness": -37 },
      ////{ "saturation": -46 }
    ////]
  //},{
    //"featureType": "transit",
    //"stylers": [
      //{ "invert_lightness": true }
    //]
  //},{
    //"featureType": "poi.business",
    //"stylers": [
      //{ "visibility": "off" }
    //]
  //},{
    //"featureType": "road.highway",
    //"stylers": [
      //{ "saturation": -75 },
      //{ "visibility": "simplified" },
      //{ "weight": 0.6 }
    //]
  //},{
    //"featureType": "road.highway",
    //"elementType": "labels",
    //"stylers": [
      //{ "visibility": "off" }
    //]
  //},{
  //}
//]

return map_styles;

});

