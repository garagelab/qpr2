define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) {

'use strict';

var GMapView = function( opt ) 
{ 
  var self = this;

  var el = opt.el;

  var riachuelo = new google.maps.LatLng(
    -34.98584712167135, -58.40400708984373 );
    //-34.965016,-59.057067 );

  var zoom = 10;

  var map_styles = [
    {
      featureType: "poi.business",
        stylers: [
        { visibility: "off" }
      ]
    },{
      featureType: "road",
        elementType: "labels",
        stylers: [
        { visibility: "on" }
      ]
    },{
      featureType: "road",
        elementType: "geometry",
        stylers: [
        { visibility: "simplified" },
        { lightness: 80 }
      ]
    },{
      featureType: "transit.line",
      stylers: [
      { visibility: "off" }
      ]
    },{
      featureType: "transit.station.bus",
      stylers: [
      { visibility: "off" }
      ]
    }
  ];

  var _map = new google.maps.Map( el, {
    center: riachuelo,
    mapTypeId: google.maps.MapTypeId.ROADMAP,
    zoom: zoom,
    minZoom: 9,
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
      
    styles: map_styles
  }); 

  //var layout = new MapLayout();
  //layout.on_resize( function()
  //{
    //layout.update();
    //self.origin();
  //});
  //layout.update();

  var _infowin = new google.maps.InfoWindow(); 

  this.infowin = function() 
  {
    return _infowin;
  };

  this.map = function()
  {
    return _map;
  };

  this.origin = function() 
  {
    _map.setCenter( riachuelo );
    _map.setZoom( zoom );
  };

  this.focus = function( feature )
  {
    var geom = feature.get('geometry');

    var coord = new google.maps.LatLng(
        geom.coordinates[0] - 0.005
        ,geom.coordinates[1] + 0.007 );

    _map.setCenter( coord );
    _map.setZoom( 15 );
  };

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

//GMapView.load_api = function( callback ) 
//{
  //if ( GMapView.load_api.loaded === true )
  //{
    //callback();
    //return;
  //}

  //var _cbname = '_init_map';

  //window[_cbname] = function() 
  //{
    //GMapView.load_api.loaded = true;
    //window[_cbname] = null;
    //callback();
  //}

  //var s = document.createElement("script");
  //s.type = "text/javascript";
  //s.src = "http://maps.googleapis.com/maps/api/js?sensor=false&callback="+_cbname;
  //document.body.appendChild( s );
//}

return GMapView;

});

