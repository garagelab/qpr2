define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'markerclusterer'
    ], 

function( $, _, Backbone ) 
{

'use strict';

var GClustererView = Backbone.View.extend({ 

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

    this.markers = [];

    //var cluster_style = [];//default
    var cluster_style = [{
      url: opt.marker.url
      ,width: opt.marker.width
      ,height: opt.marker.height
      ,anchor: [ opt.marker.height-1, 0 ]
      //,anchorIcon: [24, 24]
      //,textColor: '#ffe100'
      ,textSize: 14
    }];

    this._clusterer = new MarkerClusterer(
      opt.map, [], 
      {
        maxZoom: 14,
        gridSize: 140, //80, 
        styles: cluster_style
      });

    //google.maps.event.addListener(
      //this._clusterer, 'clusteringbegin', 
      //function () 
      //{
        //self.trigger( 'update:ini' );
      //});

    google.maps.event.addListener(
      this._clusterer, 'clusteringend', 
      function () 
      {
        self.trigger( 'update' );
      });

    //var cl = this._clusterer;
    //var nclusters = cl.getTotalClusters();
    //var clusters = cl.getClusters();
  }

  ,dispose: function()
  {
    //TODO marker dispose
    google.maps.event.clearInstanceListeners(
        this._clusterer );
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
      console.warn(this.name, 'clusterer view is already visible');
      return;
    }

    _.each( this.markers, function( m )
    {
      this._clusterer.addMarker( m );
    }
    , this );

    this._visible = true;

    //this.trigger( 'update' );
  }

  ,hide: function()
  {
    this._clusterer.clearMarkers();
    this._visible = false;
  }

  ,marker_added: function( marker ) 
  {
    this.markers.push( marker );

    if ( this.is_visible() )
    {
      this._clusterer.addMarker( marker );
    }
    else
    {
      this._clusterer.clearMarkers();
    }

    //this.trigger( 'update' );
  }

  ,clusters: function() 
  {
    return this._clusterer.getClusters();
  }

  ,size: function( n )
  {
    this._clusterer.setGridSize( n );
  }

});

return GClustererView;

});

