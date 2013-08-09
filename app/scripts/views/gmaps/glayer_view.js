define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

/*
 * TODO dispose lists of features
 */

function( $, _, Backbone ) 
{

'use strict';

var GLayerView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var opt = this.options;

    opt.icon = _.defaults( opt.icon, {
      width: 24
      ,height: 24
      ,anchor: { x: 12, y: 0 }
      ,origin: { x: 0, y: 0 }
    } );

    //console.log('glayer view init', opt);

    this._visible = opt.visible;
    this.name = opt.name;

    this.markers = [];
    this.polygons = [];

    this.listenTo( this.model,
      'add', this.feature_added, this );

    //var cluster_style = [];//default
    var cluster_style = [{
      url: opt.icon.url
      ,width: opt.icon.width
      ,height: opt.icon.height
      ,anchor: [ opt.icon.height-1, 0 ]
      //,anchorIcon: [24, 24]
      //,textColor: '#ffe100'
      ,textSize: 14
    }];

    this.clusterer = new MarkerClusterer(
      opt.map, [], 
      {
        maxZoom: 14,
        gridSize: 80, 
        styles: cluster_style
      });

    //var cl = this.clusterer;
    //var nclusters = cl.getTotalClusters();
    //var clusters = cl.getClusters();

  },

  dispose: function()
  {
    //TODO marker dispose
    //marker.$infowin.off('click');
  },

  is_visible: function()
  {
    return this._visible;
    //return this.clusterer
      //.getTotalMarkers() > 0;
  },

  visible: function( v )
  {
    if ( v ) this.show();
    else this.hide();
  },

  show: function()
  {
    if ( this.is_visible() )
    {
      console.warn(this.name, 'layer view is already visible');
      return;
    }

    var opt = this.options;
    var cl = this.clusterer;

    _.each( this.markers, function( m )
    {
      m.setMap( opt.map );
      cl.addMarker( m );
    });

    _.each( this.polygons, function( p )
    {
      p.setMap( opt.map );
    });

    this._visible = true;
  },

  hide: function()
  {
    this.clusterer.clearMarkers();

    _.each( this.polygons, function( p )
    {
      p.setMap( null );
    });

    this._visible = false;
  },

  feature_added: function( feature ) 
  {
    switch ( feature.get('geometry').type )
    {
      case 'Point':
      this.markers.push(
        this.make_marker( feature )
      );
      break;

      case 'Polygon':
      this.polygons.push(
        this.make_polygon( feature )
      );
      break;
    }
  },

  make_marker: function( feature ) 
  {
    //console.log('glayer add feature', opt);

    var self = this;
    var opt = this.options;
    var map = opt.map;
    var props = feature.get('properties');

    var infowin = $('<div/>')
      .append( 
          '<b>'+props.titulo+'</b>'+
          '<br>'+props.resumen )
      .click( function()
      {
        //TODO dispose click
        self.trigger('select:entidad', feature);
      })
      [0];

    var coordarr = feature
      .get('geometry')
      .coordinates;

    var coord = new google.maps.LatLng(
        coordarr[0], coordarr[1] );   

    var icon = _.extend( {}, opt.icon );

    icon.origin = new google.maps.Point(
        icon.origin.x, icon.origin.y );

    icon.anchor = new google.maps.Point(
        icon.anchor.x, icon.anchor.y );

    var marker = new google.maps.Marker({
      map: map,
      position: coord,
      icon: icon
    });

    google.maps.event.addListener( 
      marker, 'click',
      function( e ) {
        opt.infowin.setPosition( coord );
        opt.infowin.setContent( infowin );
        opt.infowin.open( map );
        //map.setCenter( coord );
      });

    this.clusterer.addMarker( marker );

    if ( ! this.is_visible() )
      this.clusterer.clearMarkers();

    return marker;
  },

  make_polygon: function( feature )
  {
    //console.log('glayer add poly',feature)

    var opt = this.options;

    var coordarr = feature
      .get('geometry')
      .coordinates;

    var c, paths = [];
    for ( c = 0; c < coordarr.length; c++ )
    {
      paths[c] = new google.maps.LatLng(
        coordarr[c][0], coordarr[c][1] );
    }

    var poly = new google.maps.Polygon({
      paths: paths,
      strokeColor: opt.color,
      strokeOpacity: 0.8,
      strokeWeight: 1,
      fillColor: opt.color,
      fillOpacity: 0.4
    });

    if ( this.is_visible() )
      poly.setMap( opt.map );

    return poly;
  }

});

return GLayerView;

});

