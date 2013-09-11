
/*
 * DEPRECATED
 */

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

var GFeaturesView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;
    var opt = this.options;

    opt.icon = _.defaults( opt.icon, {
      width: 24
      ,height: 24
      ,anchor: { x: 12, y: 0 }
      ,origin: { x: 0, y: 0 }
    } );

    this.name = opt.name;
    this._visible = opt.visible;

    this.markers = [];
    this.polygons = [];

    this.listenTo( this.model,
      'add', this.feature_added, this );

  }

  ,dispose: function()
  {
    //TODO marker dispose
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

    _.each( this.markers, function( m )
    {
      m.setMap( opt.map );
    }
    , this );

    _.each( this.polygons, function( p )
    {
      p.setMap( opt.map );
    } 
    , this );

    this._visible = true;
  }

  ,hide: function()
  {
    //this is managed by the clusterer
    _.each( this.markers, function( m )
    {
      m.setMap( null );
    });

    _.each( this.polygons, function( p )
    {
      p.setMap( null );
    });

    this._visible = false;
  }

  ,feature_added: function( feature ) 
  {
    var opt = this.options;

    switch ( feature.get('geometry').type )
    {
      case 'Point':

        var m = this.add_marker( feature );

        if ( this.is_visible() )
          m.setMap( opt.map );

        this.trigger( 'added:marker', m );

      break;

      case 'Polygon':

        var p = this.add_polygon( feature );

        if ( this.is_visible() )
          p.setMap( opt.map );

        this.trigger( 'added:polygon', p );

      break;
    }
  }

  ,add_marker: function( feature ) 
  {
    //console.log('gfeatures view add marker'
        //,this.name, feature );

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
        icon.anchor.x, 
        icon.anchor.y + icon.height/2 );
        //icon.anchor.x, icon.anchor.y );

    var marker = new google.maps.Marker({
      //map: opt.map,
      position: coord,
      icon: icon
    });

    google.maps.event.addListener( 
      marker, 'click',
      function( e ) {
        //self.infowin( feature );
        self.trigger('select:feature', feature);
      }); 

    this.markers.push( marker );

    return marker;
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

    this.polygons.push( poly );

    return poly;
  }

});

return GFeaturesView;

});

