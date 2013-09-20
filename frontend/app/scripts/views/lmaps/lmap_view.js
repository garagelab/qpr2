define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/gmaps/gmap_styles'
    ], 

function( $, _, Backbone, map_styles ) {

'use strict';

var LMapView = function( opt ) 
{ 
  var self = this;

  var el = opt.el;

  var riachuelo = new L.latLng(
    -34.77433193049113, -58.39782728027342 );
    //-34.98584712167135, -58.40400708984373 );
    //-34.965016,-59.057067 );

  var zoom = 11; 

  var _map = new L.Map( el, {
    center: riachuelo 
    ,zoom: zoom
    ,minZoom: 9
    ,maxZoom: 16
  });

  //var google = new L.Google('SATELLITE');
  var google = new L.Google('ROADMAP');

  _map.addLayer( google );

  //var _map = new google.maps.Map( el, {
    //center: riachuelo,
    //mapTypeId: google.maps.MapTypeId.ROADMAP,
    //zoom: zoom,
    //minZoom: 9,
    //maxZoom: 16,
    //streetViewControl: false,
    //panControl: false,
    //scrollwheel: false,
    ////scaleControl: true,
    ////zoomControl: true,
    ////overviewMapControl: false,
    ////mapTypeControl: false,
    //mapTypeControlOptions: {
      //style: google.maps.MapTypeControlStyle
        //.HORIZONTAL_BAR,
      //position: google.maps.ControlPosition
        //.TOP_LEFT
    //},
    //zoomControlOptions: {
      //style: google.maps.ZoomControlStyle
        //.SMALL,
        ////.LARGE,
      //position: google.maps.ControlPosition
        //.LEFT_TOP
        ////.LEFT_BOTTOM
    //},
    
    //styles: map_styles
  //}); 

  this.map = function()
  {
    return _map;
  };

  this.origin = function() 
  {
    _map.setView( riachuelo );
    if ( _map.getZoom() !== zoom )
      _map.setZoom( zoom );
  };

  this.focus = function( feature )
  {
    var geom = feature.get('geometry');

    var coord = new google.maps.LatLng(
        geom.coordinates[0] - 0.02
        ,geom.coordinates[1] + 0.03 );

    _map.setView( coord );
    _map.setZoom( 13 );
  };

  //this.zoom = function()
  //{
    //return _map.getZoom();
  //}

}

return LMapView;

});

