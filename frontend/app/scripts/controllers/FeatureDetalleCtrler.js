define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/detalles/FeatureView'
    ], 

function( $, _, Backbone, FeatureView ) 
{

'use strict';

var FeatureDetalleCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var self = this;

  var feature = opt.feature;
  var layers = opt.layers;
  var mapview = opt.mapview;

  this.feature = function()
  {
    return feature;
  }

  var layer = layers
    [ feature.get('properties').type ];

  var marker;
  var lmarkers = layer.view.overlays.markers;

  if ( ! lmarkers.is_visible() )
  {
    if ( marker ) marker.setMap( null );
    marker = lmarkers.make_marker( feature );
    marker.setMap( mapview.map() );
  }

  layer.view.overlays.infowins
    .infowin( feature );

  var view = new FeatureView({
    model: feature
  });

  view.on( 'close', function()
  {
    if ( marker ) 
      marker.setMap( null );
    marker = null;

    this.trigger('close');

    view.off();
  }
  , this );

  $('body').append( view.render().el );

  this.close = function()
  {
    //va a triggerear evento close de view
    view.close();
  }

  //this.$el = function()
  //{
    //return view.$el;
  //}

};

return FeatureDetalleCtrler;

});

