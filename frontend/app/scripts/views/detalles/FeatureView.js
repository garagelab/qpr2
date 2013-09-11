define( [ 
  'jquery'
  ,'underscore'
  ,'backbone'
  ,'text!tpl/detalles/feature.html'
  ], 

function( $, _, Backbone, tpl )
{

'use strict';

var FeatureView = Backbone.View.extend({ 

  initialize: function() 
  { 
    this.$el.addClass('feature-view');
  }

  ,tpl: _.template( tpl )

  ,render: function()
  {
    var feature = this.model; 
    var props = feature.get('properties');

    this.$el.html( 
      _.unescape( this.tpl({
        titulo: props.titulo
        ,txt: props.descripcion
        ,eventos: props.eventos
      }) )
    );

    //new CloseBtn().appendTo( 
        //this.$el.find('.close-svg'), 
        //20 );

    return this;
  }

  ,events: {
    'click .close': 'close'
  }

  ,close: function()
  {
    this.remove();
    this.trigger('close');
  }

});

return FeatureView;

});

