define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'config'
    ,'utils'
    ], 

function( $, _, Backbone, config, utils ) {

'use strict';

var GCuencaView = function( opt ) 
{

  this.render = function()
  {
    poly.setMap( opt.map );
    //edge.setMap( opt.map );
  }

  var everything = [[-90, -90], [90, -90], [-90, 90], [-90, -90]];

  var poly = new google.maps.Polygon({

    paths: [
      utils.pts2latlng( everything )
      ,utils.pts2latlng( config.polygon )
    ],

    clickable: false,

    strokeWeight: 0,
    strokeOpacity: 0.2,
    fillColor: "#000000",
    fillOpacity: 0.1

    //darktheme
    //,strokeWeight: 0.8
    //,fillOpacity: 0.3
    //,fillColor: "#000000"
    //,strokeOpacity: 0.7
    //,strokeColor: "#ffffff"
  });   

  //var edge = new google.maps.Polyline({
    //path: utils.pts2latlng( config.polygon_edge ),
    //strokeColor: "#ff0000",
    //strokeOpacity: 0.5,
    //strokeWeight: 1
  //});

  //function pts2latlng( arr, reverse ) 
  //{
    //var points = [];
    //var i, len = arr.length;

    //for ( i = 0; i < len; i++ ) 
    //{
      //var ilat = reverse ? 1 : 0;
      //var ilng = reverse ? 0 : 1;
      //points.push(
          //new google.maps.LatLng(
            //arr[i][ ilat ], 
            //arr[i][ ilng ] ) );
    //}

    //return points;
  //} 

};

return GCuencaView;

});


