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

    this._infowin=new google.maps.InfoWindow();

    this._visible = opt.visible;
    this.name = opt.name;

    this.markers = [];
    this.polygons = [];

    // infowin data+events by feature id
    this.$infowins = {};

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

  }

  ,dispose: function()
  {
    //TODO marker dispose
    for ( var k in this.$infowins )
    {
      this.$infowins[k].off('click');
      this.$infowins[k].remove();
    }
    this.$infowins = null;
  }

  ,is_visible: function()
  {
    return this._visible;
    //return this.clusterer
      //.getTotalMarkers() > 0;
  }

  ,visible: function( v )
  {
    if ( v ) this.show();
    else this.hide();
  }

  ,show: function()
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
  }

  ,hide: function()
  {
    this.clusterer.clearMarkers();

    _.each( this.polygons, function( p )
    {
      p.setMap( null );
    });

    this._visible = false;
  }

  ,feature_added: function( feature ) 
  {
    switch ( feature.get('geometry').type )
    {
      case 'Point':

        this.add_infowin( feature );

        var m = this.add_marker( feature );

        this.clusterer.addMarker( m );

        if ( ! this.is_visible() )
          this.clusterer.clearMarkers();

      break;

      case 'Polygon':

        this.add_polygon( feature );

      break;
    }
  }

  ,add_marker: function( feature ) 
  {
    //console.log('glayer add feature', opt);

    var self = this;
    var opt = this.options;
    var id = feature.get('id');
    var props = feature.get('properties'); 

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
      map: opt.map,
      position: coord,
      icon: icon
    });

    google.maps.event.addListener( 
      marker, 'click',
      function( e ) {
        self.infowin( feature );
      }); 

    this.markers.push( marker );

    return marker;
  }

  ,add_infowin: function( feature )
  {
    var self = this;
    var props = feature.get('properties');
    var id = feature.get('id');

    var $infowin = $('<div/>')
      .append( 
          '<b>'+props.titulo+'</b>'+
          '<br>'+props.resumen )

      // see dispose()
      .click( function()
      {
        self._infowin.close();
        self.trigger('select:feature', feature);
      });

    this.$infowins[ id ] = $infowin;
  }

  // get/set infowin
  ,infowin: function( feature )
  {
    if ( ! feature )
      return this._infowin;

    var opt = this.options;

    var props = feature.get('properties');
    var id = feature.get('id');

    var $infowin = this.$infowins[ id ];

    var coordarr = feature
      .get('geometry')
      .coordinates;

    var coord = new google.maps.LatLng(
        coordarr[0], coordarr[1] );

    this._infowin.close();
    this._infowin.setPosition( coord );
    this._infowin.setContent( $infowin[0] );
    this._infowin.open( opt.map );
  }

  ,add_polygon: function( feature )
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

    this.polygons.push( poly );

    return poly;
  }

});

return GLayerView;

});

