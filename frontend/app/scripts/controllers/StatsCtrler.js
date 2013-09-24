define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'views/StatsView'
  ], 

function( $, _, Backbone, StatsView ) 
{

'use strict';

var StatsCtrler = function( opt )
{
  var cur_layer = null;
  this.cur_layer = function(){return cur_layer;}

  var model = new Backbone.Model({});

  var view = new StatsView({ 
    model: model 
    ,className: 'stats-view'
  });

  $('.container .content')
    .append( view.render().el );

  //this.set = _.bind( model.set, model );

  this.dispose = function()
  {
    cur_layer = null;
  }

  this.update = function( layer )
  {
    cur_layer = layer;

    var name = layer.name();
    name = name.charAt(0).toUpperCase() + name.slice(1);

    var points = _.filter( 
      layer.model.toArray()
      ,function( feature )
      {
        return feature.get('geometry').type === 'Point';
      });

    model.set({
      layer_type: name 
      ,cant: points.length
    });
  } 

};

return StatsCtrler;

});

