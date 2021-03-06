define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'config'
    ], 

function( $, _, Backbone, config ) {

'use strict';

var GMapView = function( opt ) 
{ 
  var self = this;

  var el = opt.el;

  var riachuelo = new google.maps.LatLng(
    config.center[0], config.center[1] );

  var zoom = 10; 

  var _map = new google.maps.Map( el, {
    center: riachuelo,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: zoom,
    minZoom: 9,
    //maxZoom: 16,
    streetViewControl: false,
    panControl: false,
    scrollwheel: false,
    //scaleControl: true,
    //zoomControl: true,
    //overviewMapControl: false,
    //mapTypeControl: false,
    mapTypeControlOptions: {
      style: google.maps.MapTypeControlStyle
        .HORIZONTAL_BAR,
      position: google.maps.ControlPosition
        .TOP_LEFT
    },
    zoomControlOptions: {
      style: google.maps.ZoomControlStyle
        .SMALL,
        //.LARGE,
      position: google.maps.ControlPosition
        .LEFT_TOP
        //.LEFT_BOTTOM
    },
    styles: config.map_styles
  }); 

  //var layout = new MapLayout();
  //layout.on_resize( function()
  //{
    //layout.update();
    //self.origin();
  //});
  //layout.update();


  this.map = function()
  {
    return _map;
  };

  this.origin = function() 
  {
    _map.setCenter( riachuelo );
    if ( _map.getZoom() !== zoom )
      _map.setZoom( zoom );
  };

  this.focus = function( feature )
  {
    var geom = feature.get('geometry');

    var coord = new google.maps.LatLng(
      //zoom 13
      //geom.coordinates[0] - 0.02
      //,geom.coordinates[1] + 0.03 
      //zoom 15
      geom.coordinates[0] - 0.003
      ,geom.coordinates[1] + 0.008
    );

    _map.setCenter( coord );
    _map.setZoom( 15 );
  };

  //this.zoom = function()
  //{
    //return _map.getZoom();
  //}

}

//function MapLayout()
//{
  //var $win = $(window);  
  //var $map = $('#map');

  //var sidebarw = $('.sidebar').width();
  //var footerh = $('.footer').height();

  //this.update = function()
  //{
    //$map.css({
      //width: $win.width() - sidebarw
      //,height: $win.height() 
          //- $map.position().top 
          //- footerh
    //});
  //}

  //this.on_resize = function( callback )
  //{
    //var timer = 0, delay = 1200;
    //$win.resize( function() 
    //{
      //clearTimeout( timer );
      //timer = setTimeout( callback, delay );
    //});
  //}
//}

GMapView.load_api = function( callback ) 
{
  if ( GMapView.load_api.loaded === true )
  {
    console.log('gmaps api loaded')
    callback();
    return;
  }

  var _cbname = '_init_map';

  window[_cbname] = function() 
  {
    GMapView.load_api.loaded = true;
    window[_cbname] = null;
    callback();
  }

  var s = document.createElement("script");
  s.type = "text/javascript";
  s.src = "https://maps.googleapis.com/maps/api/js?sensor=false&callback="+_cbname;
  document.body.appendChild( s );
}

return GMapView;

});

