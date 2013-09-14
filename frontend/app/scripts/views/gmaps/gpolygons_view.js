define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var GPolygonsView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;
    var opt = this.options;

    this.name = opt.name;
    this._visible = opt.visible;

    this._polygons = [];

    this.listenTo( this.model,
      'add', this.feature_added, this );

  }

  ,dispose: function()
  {
    _.each( this._polygons, function( p )
    {
      google.maps.event
        .clearInstanceListeners( p );
      p.setMap( null );
    });
    this._polygons = [];
  } 

  ,is_visible: function()
  {
    return !!this._visible;
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
      console.warn(this.name, 'gmarkers view is already visible');
      return;
    }

    var opt = this.options;

    _.each( this._polygons, function( p )
    {
      p.setMap( opt.map );
    } 
    , this );

    this._visible = true;
  }

  ,hide: function()
  {
    _.each( this._polygons, function( p )
    {
      p.setMap( null );
    });

    this._visible = false;
  }

  ,feature_added: function( feature ) 
  {
    var opt = this.options;

    if ( feature
        .get('geometry').type !== 'Polygon' )
      return;

    var p = this.add_polygon( feature );

    if ( this.is_visible() )
      p.setMap( opt.map );

    this.trigger( 'added:polygon', p );

  }

  ,add_polygon: function( feature )
  {
    //console.log('glayer add poly',feature)

    var self = this; 
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

    google.maps.event.addListener( 
      poly, 'click',
      function( e ) 
      {
        self.trigger('select:feature', feature);
      }); 

    this._polygons.push( poly );

    return poly;
  }

});

return GPolygonsView;

});

