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

var GMarkersView = Backbone.View.extend({ 

  initialize: function() 
  { 
    var self = this;
    var opt = this.options;

    var def_m_opt = {
      width: 24
      ,height: 24
      ,origin: { x: 0, y: 0 }
    };

    def_m_opt.anchor = { 
      x: Math.round( 
      (opt.marker.width || def_m_opt.width) /2 )
      ,y: 0 
    };

    opt.marker = _.defaults(opt.marker, def_m_opt);

    this.name = opt.name;
    this._visible = opt.visible;

    this._markers = [];

    this.listenTo( this.model,
      'add', this.feature_added, this );

  }

  ,dispose: function()
  {
    _.each( this._markers, function( m )
    {
      google.maps.event
        .clearInstanceListeners( m );
      m.setMap( null );
    });
    this._markers = [];
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

    _.each( this._markers, function( m )
    {
      m.setMap( opt.map );
    }
    , this );

    this._visible = true;
  }

  ,hide: function()
  {
    //this is managed by the clusterer
    _.each( this._markers, function( m )
    {
      m.setMap( null );
    });

    this._visible = false;
  }

  ,feature_added: function( feature ) 
  {
    var opt = this.options;

    if ( feature
        .get('geometry').type !== 'Point' )
      return;

    var m = this.add_marker( feature );

    if ( this.is_visible() )
      m.setMap( opt.map );

    this.trigger( 'added:marker', m );

  }

  ,add_marker: function( feature ) 
  {
    //console.log('gfeatures view add marker'
        //,this.name, feature );

    var self = this; 

    var marker = this.make_marker( feature );

    google.maps.event.addListener( 
      marker, 'click',
      function( e ) 
      {
        //self.infowin( feature );
        self.trigger('select:feature', feature);
      }); 

    this._markers.push( marker );

    return marker;
  }

  ,make_marker: function( feature )
  {
    var opt = this.options;
    var id = feature.get('id');
    var props = feature.get('properties'); 

    var coordarr = feature
      .get('geometry')
      .coordinates;

    var coord = new google.maps.LatLng(
        coordarr[0], coordarr[1] );   

    var opt_marker = _.extend( {}, opt.marker );

    opt_marker.origin = new google.maps.Point(
        opt_marker.origin.x
        ,opt_marker.origin.y );

    opt_marker.anchor = new google.maps.Point(
      opt_marker.anchor.x, 
      opt_marker.anchor.y+opt_marker.height/2 );
      //opt_marker.anchor.x,opt_marker.anchor.y);

    return new google.maps.Marker({
      //map: opt.map,
      position: coord,
      icon: opt_marker
    });
  }

  ,markers: function()
  {
    return this._markers;
  }

});

return GMarkersView;

});

