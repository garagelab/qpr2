define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/gmaps/gmap_styles'
    ,'leaflet_google'
    ], 

function( $, _, Backbone, map_styles ) {

'use strict';

var LMapView = function( opt ) 
{ 
  var self = this;

  var el = opt.el;

  var riachuelo = new L.LatLng(
    //zoom 11
    //-34.77433193049113, -58.39782728027342 );
    //zoom 10
    -34.98584712167135, -58.40400708984373 );
    //-34.965016,-59.057067 );

  var zoom = 10; 

  var _map = new L.Map( el, {
    center: riachuelo 
    ,zoom: zoom
    ,minZoom: 9
    ,maxZoom: 16
    ,scrollWheelZoom: false
  });

  //var _glayer = new L.Google('SATELLITE');
  var _glayer = new L.Google('ROADMAP'); 

  _map.addLayer( _glayer );

  _glayer._google.setOptions({
    styles: map_styles
    ,streetViewControl: false
    //,mapTypeControl: true
    //,mapTypeControlOptions: {
      //style: google.maps.MapTypeControlStyle
        //.HORIZONTAL_BAR,
      //position: google.maps.ControlPosition
        //.TOP_LEFT
    //}
  });

  this.map = function( key )
  {
    return key === 'google' 
      ? _glayer._google 
      : _map;
  };

  this.origin = function() 
  {
    _map.setView( riachuelo, zoom );
    //if ( _map.getZoom() !== zoom )
      //_map.setZoom( zoom );
  };

  this.focus = function( feature )
  {
    var geom = feature.get('geometry');

    var coord = new L.LatLng(
        geom.coordinates[0] - 0.02
        ,geom.coordinates[1] + 0.03 );

    _map.setView( coord, 13 );
    //_map.setZoom( 13 );
  };

}

return LMapView;

});

