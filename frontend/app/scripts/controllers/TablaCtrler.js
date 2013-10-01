define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'views/TablaView'
  ], 

function( $, _, Backbone, TablaView ) 
{

'use strict';

var TablaCtrler = function( opt )
{
  _.extend( this, Backbone.Events );

  var layer = opt.layer;

  var view = new TablaView({
    collection: layer.model
    ,layer_name: layer.name()
    ,className: 'tabla info'
  });

  view.on( 'close', function()
  {
    this.trigger('close');
    this.dispose();
  }
  , this );

  view.on( 'select:feature', function( feature )
  {
    this.trigger( 'select:feature', feature );
  }
  , this );

  $(opt.el).append( view.render().el ); 

  view.init_datatable();

  this.dispose = function()
  {
    view.off();
    this.off();
    this.stopListening();
  }

  this.close = function()
  {
    // triggereara evento view.close -> dispose
    view.close();
  } 

};

return TablaCtrler;

});

