define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'utils'
  ,'views/stats/StatsLayerView'
  ], 

function( $, _, Backbone, utils, StatsLayerView ) 
{

'use strict';

var StatsLayerCtrler = function( opt )
{
  var model = new Backbone.Model({});

  var view = new StatsLayerView({ 
    model: model 
    ,className: 'stats-view'
  });

  $('.container .content')
    .append( view.render().el );

  this.dispose = function()
  {}

  this.update = function(layer_name, layer_stat)
  {
    this.cur_layer_name = layer_name;

    model.set({
      layer_name: utils.capitalize(layer_name) 
      ,cant: layer_stat.cant
    });
  } 

};

return StatsLayerCtrler;

});

