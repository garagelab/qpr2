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

    opt.icon = _.defaults( opt.icon, {
      width: 24
      ,height: 24
      ,anchor: { x: 12, y: 0 }
      ,origin: { x: 0, y: 0 }
    } );

    this.name = opt.name;
    this._visible = opt.visible;

    this.markers = [];

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
  } 

  ,is_visible: function()
  {
    return this._visible;
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
      this.clusterer.addMarker( m );
      this.trigger( 'update', this.clusterer );
    }
    , this );

    this._visible = true;
  }

  ,hide: function()
  {
    this.clusterer.clearMarkers();
    this._visible = false;
  }

  ,marker_added: function( marker ) 
  {
    this.markers.push( marker );

    if ( this.is_visible() )
    {
      this.clusterer.addMarker( marker );
    }
    else
    {
      this.clusterer.clearMarkers();
    }

    this.trigger( 'update', this.clusterer );
  }

});

return GClustererView;

});

