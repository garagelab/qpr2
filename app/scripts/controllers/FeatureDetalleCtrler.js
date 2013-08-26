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

  var self = this;

  var view = new FeatureView({
    model: feature
  });

  view.on( 'close', function()
  {
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

};

return FeatureDetalleCtrler;

});

