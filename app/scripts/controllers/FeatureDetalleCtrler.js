define( [ 
    'jquery'
    ,'underscore'
    ,'backbone'
    ,'views/detalles/FeatureView'
    ], 

function( $, _, Backbone, FeatureView ) 
{

'use strict';

var FeatureDetalleCtrler = 
function( layers, feature, mapview )
{
  _.extend( this, Backbone.Events );

  // una simple vista......

  var view = new FeatureView({
    feature: feature
  });

  view.on( 'close', function()
  {
    view.off();
    this.trigger('close');
  });

  $('body').append( view.render().el );

  this.close = function()
  {
    //va a triggerear evento close de view
    view.close();
  }

};

return FeatureDetalleCtrler;

});

